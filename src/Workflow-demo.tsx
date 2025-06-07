import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  createContext,
  useEffect,
} from "react";

// Types
interface Position {
  x: number;
  y: number;
}

interface Port {
  id: string;
  type: "input" | "output";
  label: string;
  dataType?: string;
}

interface NodeConfig {
  [key: string]: any;
}

interface Node {
  id: string;
  type: string;
  position: Position;
  config: NodeConfig;
}

interface Connection {
  id: string;
  from: {
    nodeId: string;
    port: string;
  };
  to: {
    nodeId: string;
    port: string;
  };
}

interface WorkflowData {
  nodes: Node[];
  connections: Connection[];
}

interface NodeDefinition {
  type: string;
  label: string;
  icon: string;
  inputs: Port[];
  outputs: Port[];
  configFields: ConfigField[];
}

interface ConfigField {
  id: string;
  type: "text" | "select" | "number";
  label: string;
  options?: string[];
  defaultValue?: any;
}

// Context for workflow state management
const WorkflowContext = createContext<{
  workflow: WorkflowData;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  updateNodeConfig: (nodeId: string, fieldId: string, value: any) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addConnection: (connection: Omit<Connection, "id">) => void;
  removeConnection: (connectionId: string) => void;
  scale: number;
  setScale: (scale: number) => void;
  offset: Position;
  setOffset: (offset: Position) => void;
} | null>(null);

// Node definitions
const nodeDefinitions: Record<string, NodeDefinition> = {
  start: {
    type: "start",
    label: "Start",
    icon: "▶️",
    inputs: [],
    outputs: [{ id: "out", type: "output", label: "Output" }],
    configFields: [
      { id: "name", type: "text", label: "Name", defaultValue: "Start Node" },
    ],
  },
  if: {
    type: "if",
    label: "If Condition",
    icon: "❓",
    inputs: [{ id: "in", type: "input", label: "Input" }],
    outputs: [
      { id: "true", type: "output", label: "True" },
      { id: "false", type: "output", label: "False" },
    ],
    configFields: [
      {
        id: "condition",
        type: "text",
        label: "Condition",
        defaultValue: "x > 5",
      },
    ],
  },
  action: {
    type: "action",
    label: "Action",
    icon: "⚡",
    inputs: [{ id: "in", type: "input", label: "Input" }],
    outputs: [{ id: "out", type: "output", label: "Output" }],
    configFields: [
      {
        id: "actionType",
        type: "select",
        label: "Action Type",
        options: ["Log", "Transform", "Send"],
        defaultValue: "Log",
      },
      {
        id: "message",
        type: "text",
        label: "Message",
        defaultValue: "Hello World",
      },
    ],
  },
  // Technical Analysis Nodes
  ema: {
    type: "ema",
    label: "EMA",
    icon: "📈",
    inputs: [{ id: "prices", type: "input", label: "Price Data" }],
    outputs: [{ id: "ema", type: "output", label: "EMA Values" }],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 14 },
      {
        id: "source",
        type: "select",
        label: "Source",
        options: ["close", "open", "high", "low", "volume"],
        defaultValue: "close",
      },
    ],
  },
  sma: {
    type: "sma",
    label: "SMA",
    icon: "📊",
    inputs: [{ id: "prices", type: "input", label: "Price Data" }],
    outputs: [{ id: "sma", type: "output", label: "SMA Values" }],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 20 },
      {
        id: "source",
        type: "select",
        label: "Source",
        options: ["close", "open", "high", "low", "volume"],
        defaultValue: "close",
      },
    ],
  },
  rsi: {
    type: "rsi",
    label: "RSI",
    icon: "⚖️",
    inputs: [{ id: "prices", type: "input", label: "Price Data" }],
    outputs: [{ id: "rsi", type: "output", label: "RSI Values" }],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 14 },
      {
        id: "source",
        type: "select",
        label: "Source",
        options: ["close", "open", "high", "low"],
        defaultValue: "close",
      },
      {
        id: "overbought",
        type: "number",
        label: "Overbought Level",
        defaultValue: 70,
      },
      {
        id: "oversold",
        type: "number",
        label: "Oversold Level",
        defaultValue: 30,
      },
    ],
  },
  macd: {
    type: "macd",
    label: "MACD",
    icon: "📉",
    inputs: [{ id: "prices", type: "input", label: "Price Data" }],
    outputs: [
      { id: "macd", type: "output", label: "MACD Line" },
      { id: "signal", type: "output", label: "Signal Line" },
      { id: "histogram", type: "output", label: "Histogram" },
    ],
    configFields: [
      {
        id: "fastPeriod",
        type: "number",
        label: "Fast Period",
        defaultValue: 12,
      },
      {
        id: "slowPeriod",
        type: "number",
        label: "Slow Period",
        defaultValue: 26,
      },
      {
        id: "signalPeriod",
        type: "number",
        label: "Signal Period",
        defaultValue: 9,
      },
      {
        id: "source",
        type: "select",
        label: "Source",
        options: ["close", "open", "high", "low"],
        defaultValue: "close",
      },
    ],
  },
  bollinger: {
    type: "bollinger",
    label: "Bollinger Bands",
    icon: "📏",
    inputs: [{ id: "prices", type: "input", label: "Price Data" }],
    outputs: [
      { id: "upper", type: "output", label: "Upper Band" },
      { id: "middle", type: "output", label: "Middle Band" },
      { id: "lower", type: "output", label: "Lower Band" },
    ],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 20 },
      {
        id: "stdDev",
        type: "number",
        label: "Standard Deviations",
        defaultValue: 2,
      },
      {
        id: "source",
        type: "select",
        label: "Source",
        options: ["close", "open", "high", "low"],
        defaultValue: "close",
      },
    ],
  },
  stochastic: {
    type: "stochastic",
    label: "Stochastic",
    icon: "🎯",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [
      { id: "k", type: "output", label: "%K Line" },
      { id: "d", type: "output", label: "%D Line" },
    ],
    configFields: [
      { id: "kPeriod", type: "number", label: "%K Period", defaultValue: 14 },
      { id: "dPeriod", type: "number", label: "%D Period", defaultValue: 3 },
      { id: "smooth", type: "number", label: "Smooth", defaultValue: 3 },
    ],
  },
  atr: {
    type: "atr",
    label: "ATR",
    icon: "📐",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [{ id: "atr", type: "output", label: "ATR Values" }],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 14 },
    ],
  },
  adx: {
    type: "adx",
    label: "ADX",
    icon: "💪",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [
      { id: "adx", type: "output", label: "ADX" },
      { id: "diPlus", type: "output", label: "DI+" },
      { id: "diMinus", type: "output", label: "DI-" },
    ],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 14 },
    ],
  },
  williams: {
    type: "williams",
    label: "Williams %R",
    icon: "🌊",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [{ id: "williams", type: "output", label: "Williams %R" }],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 14 },
    ],
  },
  cci: {
    type: "cci",
    label: "CCI",
    icon: "🔄",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [{ id: "cci", type: "output", label: "CCI Values" }],
    configFields: [
      { id: "period", type: "number", label: "Period", defaultValue: 20 },
    ],
  },
  obv: {
    type: "obv",
    label: "OBV",
    icon: "📦",
    inputs: [{ id: "prices", type: "input", label: "Price & Volume" }],
    outputs: [{ id: "obv", type: "output", label: "OBV Values" }],
    configFields: [
      {
        id: "source",
        type: "select",
        label: "Price Source",
        options: ["close", "open", "high", "low"],
        defaultValue: "close",
      },
    ],
  },
  vwap: {
    type: "vwap",
    label: "VWAP",
    icon: "⚖️",
    inputs: [{ id: "prices", type: "input", label: "OHLCV Data" }],
    outputs: [{ id: "vwap", type: "output", label: "VWAP Values" }],
    configFields: [
      {
        id: "period",
        type: "select",
        label: "Reset Period",
        options: ["session", "daily", "weekly", "monthly"],
        defaultValue: "daily",
      },
    ],
  },
  pivotPoints: {
    type: "pivotPoints",
    label: "Pivot Points",
    icon: "🎯",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [
      { id: "pivot", type: "output", label: "Pivot" },
      { id: "r1", type: "output", label: "R1" },
      { id: "r2", type: "output", label: "R2" },
      { id: "s1", type: "output", label: "S1" },
      { id: "s2", type: "output", label: "S2" },
    ],
    configFields: [
      {
        id: "method",
        type: "select",
        label: "Method",
        options: ["Standard", "Fibonacci", "Woodie", "Camarilla"],
        defaultValue: "Standard",
      },
    ],
  },
  ichimoku: {
    type: "ichimoku",
    label: "Ichimoku",
    icon: "☁️",
    inputs: [{ id: "prices", type: "input", label: "OHLC Data" }],
    outputs: [
      { id: "tenkan", type: "output", label: "Tenkan-sen" },
      { id: "kijun", type: "output", label: "Kijun-sen" },
      { id: "senkouA", type: "output", label: "Senkou A" },
      { id: "senkouB", type: "output", label: "Senkou B" },
      { id: "chikou", type: "output", label: "Chikou Span" },
    ],
    configFields: [
      {
        id: "tenkanPeriod",
        type: "number",
        label: "Tenkan Period",
        defaultValue: 9,
      },
      {
        id: "kijunPeriod",
        type: "number",
        label: "Kijun Period",
        defaultValue: 26,
      },
      {
        id: "senkouPeriod",
        type: "number",
        label: "Senkou B Period",
        defaultValue: 52,
      },
    ],
  },
  // Data Source and Utility Nodes
  dataSource: {
    type: "dataSource",
    label: "Data Source",
    icon: "📊",
    inputs: [],
    outputs: [{ id: "data", type: "output", label: "Market Data" }],
    configFields: [
      { id: "symbol", type: "text", label: "Symbol", defaultValue: "AAPL" },
      {
        id: "timeframe",
        type: "select",
        label: "Timeframe",
        options: ["1m", "5m", "15m", "1h", "4h", "1d"],
        defaultValue: "1h",
      },
      {
        id: "bars",
        type: "number",
        label: "Number of Bars",
        defaultValue: 100,
      },
    ],
  },
  crossover: {
    type: "crossover",
    label: "Crossover",
    icon: "✕",
    inputs: [
      { id: "line1", type: "input", label: "Line 1" },
      { id: "line2", type: "input", label: "Line 2" },
    ],
    outputs: [
      { id: "bullish", type: "output", label: "Bullish Cross" },
      { id: "bearish", type: "output", label: "Bearish Cross" },
    ],
    configFields: [
      {
        id: "sensitivity",
        type: "number",
        label: "Sensitivity",
        defaultValue: 1,
      },
    ],
  },
  compare: {
    type: "compare",
    label: "Compare",
    icon: "⚖️",
    inputs: [
      { id: "value1", type: "input", label: "Value 1" },
      { id: "value2", type: "input", label: "Value 2" },
    ],
    outputs: [
      { id: "greater", type: "output", label: "Greater Than" },
      { id: "less", type: "output", label: "Less Than" },
      { id: "equal", type: "output", label: "Equal" },
    ],
    configFields: [
      {
        id: "operator",
        type: "select",
        label: "Operator",
        options: [">", "<", ">=", "<=", "==", "!="],
        defaultValue: ">",
      },
      { id: "threshold", type: "number", label: "Threshold", defaultValue: 0 },
    ],
  },
  signal: {
    type: "signal",
    label: "Signal",
    icon: "🚦",
    inputs: [{ id: "trigger", type: "input", label: "Trigger" }],
    outputs: [
      { id: "buy", type: "output", label: "Buy Signal" },
      { id: "sell", type: "output", label: "Sell Signal" },
    ],
    configFields: [
      {
        id: "signalType",
        type: "select",
        label: "Signal Type",
        options: ["Buy", "Sell", "Both"],
        defaultValue: "Both",
      },
      {
        id: "strength",
        type: "select",
        label: "Strength",
        options: ["Weak", "Medium", "Strong"],
        defaultValue: "Medium",
      },
    ],
  },
};

// Hook for workflow context
const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
};

// Port component
const PortComponent: React.FC<{
  port: Port;
  nodeId: string;
  onConnectionStart?: (
    nodeId: string,
    portId: string,
    e: React.MouseEvent
  ) => void;
  onConnectionEnd?: (nodeId: string, portId: string) => void;
  isConnecting?: boolean;
}> = ({ port, nodeId, onConnectionStart, onConnectionEnd, isConnecting }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (port.type === "output" && onConnectionStart) {
      console.log("Starting connection from output port:", nodeId, port.id);
      onConnectionStart(nodeId, port.id, e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (port.type === "input" && onConnectionEnd && isConnecting) {
      console.log("Ending connection at input port:", nodeId, port.id);
      onConnectionEnd(nodeId, port.id);
    }
  };

  const handleMouseEnter = () => {
    if (port.type === "input" && isConnecting) {
      console.log("Hovering over input port:", nodeId, port.id);
    }
  };

  return (
    <div
      className={`
        w-4 h-4 rounded-full border-2 cursor-pointer transition-all z-50 relative
        ${
          port.type === "input"
            ? "bg-blue-500 border-blue-600"
            : "bg-green-500 border-green-600"
        }
        ${
          isConnecting && port.type === "input"
            ? "scale-125 shadow-lg ring-2 ring-blue-300"
            : ""
        }
        hover:scale-110 hover:shadow-md
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      title={`${port.type}: ${port.label}`}
      style={{ pointerEvents: "auto" }}
    />
  );
};

// Node component
const NodeComponent: React.FC<{
  node: Node;
  definition: NodeDefinition;
  onDragStart: (nodeId: string, startPos: Position) => void;
  onConnectionStart: (
    nodeId: string,
    portId: string,
    position: Position
  ) => void;
  onConnectionEnd: (nodeId: string, portId: string) => void;
  onDelete: (nodeId: string) => void;
  isConnecting: boolean;
}> = ({
  node,
  definition,
  onDragStart,
  onConnectionStart,
  onConnectionEnd,
  onDelete,
  isConnecting,
}) => {
  const { updateNode, scale, offset } = useWorkflow();
  const [isDragging, setIsDragging] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<Position>({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click
      setIsDragging(true);
      onDragStart(node.id, { x: e.clientX, y: e.clientY });
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    console.log("handleDelete called for node:", node.id);
    const confirmed = window.confirm(
      `Delete ${definition.label} node "${node.config.name || node.id}"?`
    );
    console.log("User confirmed deletion:", confirmed);
    if (confirmed) {
      onDelete(node.id);
    }
    setShowContextMenu(false);
  };

  const handleDuplicate = () => {
    // This could be implemented to duplicate the node
    setShowContextMenu(false);
  };

  const handleConfigChange = (fieldId: string, value: any) => {
    updateNode(node.id, {
      config: { ...node.config, [fieldId]: value },
    });
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showContextMenu]);

  const actualX = node.position.x * scale + offset.x;
  const actualY = node.position.y * scale + offset.y;

  return (
    <>
      <div
        className={`
          absolute bg-white border-2 rounded-lg shadow-lg min-w-40 cursor-move select-none group
          ${isDragging ? "border-blue-500 shadow-xl" : "border-gray-300"}
          hover:shadow-xl transition-all z-10 hover:z-20
        `}
        style={{
          left: actualX,
          top: actualY,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          minHeight: "80px",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setShowConfig(!showConfig)}
        onContextMenu={handleRightClick}
      >
        {/* Delete button - always visible on hover */}
        <button
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-all z-50 flex items-center justify-center font-bold shadow-lg opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Delete button clicked for node:", node.id);
            handleDelete();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          title="Delete node"
        >
          ×
        </button>

        {/* Node Header */}
        <div className="bg-gray-50 px-3 py-2 border-b rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">{definition.icon}</span>
            <span className="font-medium text-sm">{definition.label}</span>
          </div>
        </div>

        {/* Input Ports */}
        {definition.inputs.length > 0 && (
          <div className="absolute -left-5 top-14 space-y-4">
            {definition.inputs.map((port, index) => (
              <div key={port.id} className="flex items-center">
                <PortComponent
                  port={port}
                  nodeId={node.id}
                  onConnectionEnd={onConnectionEnd}
                  isConnecting={isConnecting}
                />
                <span className="ml-3 text-xs text-gray-600 bg-white px-1 rounded whitespace-nowrap">
                  {port.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Output Ports */}
        {definition.outputs.length > 0 && (
          <div className="absolute -right-5 top-14 space-y-4">
            {definition.outputs.map((port, index) => (
              <div key={port.id} className="flex items-center justify-end">
                <span className="mr-3 text-xs text-gray-600 bg-white px-1 rounded whitespace-nowrap">
                  {port.label}
                </span>
                <PortComponent
                  port={port}
                  nodeId={node.id}
                  onConnectionStart={onConnectionStart}
                />
              </div>
            ))}
          </div>
        )}

        {/* Node Content - moved to bottom so ports don't overlap */}
        <div
          className={`p-3 ${
            definition.inputs.length > 0 || definition.outputs.length > 0
              ? "pt-8"
              : ""
          }`}
        >
          {showConfig ? (
            <div className="space-y-2">
              {definition.configFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "text" && (
                    <input
                      type="text"
                      className="w-full px-2 py-1 text-xs border rounded"
                      value={node.config[field.id] || field.defaultValue || ""}
                      onChange={(e) =>
                        handleConfigChange(field.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      className="w-full px-2 py-1 text-xs border rounded"
                      value={node.config[field.id] || field.defaultValue || ""}
                      onChange={(e) =>
                        handleConfigChange(field.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      className="w-full px-2 py-1 text-xs border rounded"
                      value={node.config[field.id] || field.defaultValue || 0}
                      onChange={(e) =>
                        handleConfigChange(field.id, Number(e.target.value))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-600 min-h-8">
              {Object.entries(node.config)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="truncate">
                    <span className="font-medium">{key}:</span>{" "}
                    {String(value).slice(0, 12)}
                    {String(value).length > 12 && "..."}
                  </div>
                ))}
              <div className="text-gray-400 mt-1 text-xs">
                Double-click to configure
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{
            left: contextMenuPos.x,
            top: contextMenuPos.y,
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={() => setShowConfig(!showConfig)}
          >
            <span>⚙️</span>
            Configure
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={handleDuplicate}
          >
            <span>📋</span>
            Duplicate
          </button>
          <hr className="my-1" />
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 text-red-600 flex items-center gap-2"
            onClick={handleDelete}
          >
            <span>🗑️</span>
            Delete
          </button>
        </div>
      )}
    </>
  );
};

// Connection line component
const ConnectionLine: React.FC<{
  connection: Connection;
  nodes: Node[];
  scale: number;
  offset: Position;
  onDelete: (connectionId: string) => void;
}> = ({ connection, nodes, scale, offset, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fromNode = nodes.find((n) => n.id === connection.from.nodeId);
  const toNode = nodes.find((n) => n.id === connection.to.nodeId);

  if (!fromNode || !toNode) return null;

  const fromDef = nodeDefinitions[fromNode.type];
  const toDef = nodeDefinitions[toNode.type];

  const fromPortIndex = fromDef.outputs.findIndex(
    (p) => p.id === connection.from.port
  );
  const toPortIndex = toDef.inputs.findIndex(
    (p) => p.id === connection.to.port
  );

  // Calculate positions relative to the scaled nodes but without applying offset twice
  const startX = (fromNode.position.x + 160) * scale; // Adjusted for new port position
  const startY = (fromNode.position.y + 56 + fromPortIndex * 32 + 8) * scale; // Adjusted spacing
  const endX = (toNode.position.x - 20) * scale; // Adjusted for new port position
  const endY = (toNode.position.y + 56 + toPortIndex * 32 + 8) * scale; // Adjusted spacing

  const controlX1 = startX + 50 * scale;
  const controlX2 = endX - 50 * scale;

  const pathD = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this connection?")) {
      onDelete(connection.id);
    }
  };

  return (
    <g>
      {/* Invisible thick path for easier clicking */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        className="cursor-pointer"
        onClick={handleConnectionClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {/* Visible path */}
      <path
        d={pathD}
        stroke={isHovered ? "#ef4444" : "#10b981"}
        strokeWidth={isHovered ? "3" : "2"}
        fill="none"
        className={`drop-shadow-sm transition-all pointer-events-none ${
          isHovered ? "drop-shadow-lg" : ""
        }`}
      />
      {/* Delete button on hover */}
      {isHovered && (
        <g>
          <circle
            cx={(startX + endX) / 2}
            cy={(startY + endY) / 2}
            r="8"
            fill="#ef4444"
            className="cursor-pointer"
            onClick={handleConnectionClick}
          />
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 + 1}
            textAnchor="middle"
            fontSize="10"
            fill="white"
            className="cursor-pointer pointer-events-none select-none"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
};

// Temporary connection line for dragging
const TempConnectionLine: React.FC<{
  start: Position;
  end: Position;
}> = ({ start, end }) => {
  const controlX1 = start.x + 50;
  const controlX2 = end.x - 50;

  return (
    <path
      d={`M ${start.x} ${start.y} C ${controlX1} ${start.y}, ${controlX2} ${end.y}, ${end.x} ${end.y}`}
      stroke="#6b7280"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
    />
  );
};

// Canvas component
const Canvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scale, setScale, offset, setOffset } = useWorkflow();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.1), 2);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Middle click or Ctrl+click
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-gray-50 cursor-grab"
      style={{
        backgroundImage: `
          radial-gradient(circle, #d1d5db 1px, transparent 1px)
        `,
        backgroundSize: `${20 * scale}px ${20 * scale}px`,
        backgroundPosition: `${offset.x}px ${offset.y}px`,
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Node palette component
const NodePalette: React.FC<{
  onAddNode: (type: string, position: Position) => void;
}> = ({ onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const categories = {
    basic: {
      label: "Basic Nodes",
      icon: "🔧",
      nodes: ["start", "if", "action"],
    },
    data: {
      label: "Data Sources",
      icon: "📊",
      nodes: ["dataSource"],
    },
    trend: {
      label: "Trend Indicators",
      icon: "📈",
      nodes: ["ema", "sma", "macd", "adx", "ichimoku"],
    },
    momentum: {
      label: "Momentum Oscillators",
      icon: "⚡",
      nodes: ["rsi", "stochastic", "williams", "cci"],
    },
    volatility: {
      label: "Volatility & Bands",
      icon: "📏",
      nodes: ["bollinger", "atr"],
    },
    volume: {
      label: "Volume Analysis",
      icon: "📦",
      nodes: ["obv", "vwap"],
    },
    support: {
      label: "Support & Resistance",
      icon: "🎯",
      nodes: ["pivotPoints"],
    },
    signals: {
      label: "Signal Processing",
      icon: "🚦",
      nodes: ["crossover", "compare", "signal"],
    },
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddNode = (nodeType: string) => {
    onAddNode(nodeType, { x: 100, y: 100 });
    setIsOpen(false);
    setExpandedCategories(new Set());
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".node-palette")) {
      setIsOpen(false);
      setExpandedCategories(new Set());
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="absolute top-4 left-4 z-20 node-palette">
      {/* Add Button */}
      <button
        className={`
          w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-2xl
          transition-all duration-200 hover:scale-110
          ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close palette" : "Add node"}
      >
        <span
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Add Node</h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose from the categories below
            </p>
          </div>

          {/* Categories */}
          <div className="max-h-80 overflow-y-auto">
            {Object.entries(categories).map(([categoryKey, category]) => (
              <div
                key={categoryKey}
                className="border-b border-gray-100 last:border-b-0"
              >
                {/* Category Header */}
                <button
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.nodes.length} nodes
                      </div>
                    </div>
                  </div>
                  <span
                    className={`
                    text-gray-400 transition-transform duration-200
                    ${expandedCategories.has(categoryKey) ? "rotate-90" : ""}
                  `}
                  >
                    ▶
                  </span>
                </button>

                {/* Category Nodes */}
                {expandedCategories.has(categoryKey) && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    {category.nodes.map((nodeType) => {
                      const def = nodeDefinitions[nodeType];
                      return (
                        <button
                          key={nodeType}
                          className="w-full px-8 py-2 flex items-center gap-3 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left group"
                          onClick={() => handleAddNode(nodeType)}
                        >
                          <span className="text-base">{def.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {def.label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {def.inputs.length} inputs, {def.outputs.length}{" "}
                              outputs
                            </div>
                          </div>
                          <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                            Add
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Click on a node to add it to the canvas
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Algorithm Builder component
const AlgorithmBuilder: React.FC = () => {
  const [workflow, setWorkflow] = useState<WorkflowData>({
    nodes: [
      {
        id: "data-1",
        type: "dataSource",
        position: { x: 50, y: 100 },
        config: { symbol: "AAPL", timeframe: "1h", bars: 100 },
      },
      {
        id: "ema-1",
        type: "ema",
        position: { x: 300, y: 80 },
        config: { period: 20, source: "close" },
      },
      {
        id: "rsi-1",
        type: "rsi",
        position: { x: 300, y: 200 },
        config: { period: 14, source: "close", overbought: 70, oversold: 30 },
      },
    ],
    connections: [
      {
        id: "conn-1",
        from: { nodeId: "data-1", port: "data" },
        to: { nodeId: "ema-1", port: "prices" },
      },
      {
        id: "conn-2",
        from: { nodeId: "data-1", port: "data" },
        to: { nodeId: "rsi-1", port: "prices" },
      },
    ],
  });

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<{
    nodeId: string | null;
    startPos: Position;
    initialNodePos: Position;
  }>({
    nodeId: null,
    startPos: { x: 0, y: 0 },
    initialNodePos: { x: 0, y: 0 },
  });

  const [connectionState, setConnectionState] = useState<{
    isConnecting: boolean;
    fromNode: string | null;
    fromPort: string | null;
    startPos: Position;
    currentPos: Position;
  }>({
    isConnecting: false,
    fromNode: null,
    fromPort: null,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
  });

  // Workflow management functions
  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  }, []);

  const addNode = useCallback((node: Node) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: [...prev.nodes, node],
    }));
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    console.log("removeNode called for:", nodeId);
    setWorkflow((prev) => {
      const newWorkflow = {
        ...prev,
        nodes: prev.nodes.filter((node) => node.id !== nodeId),
        connections: prev.connections.filter(
          (conn) => conn.from.nodeId !== nodeId && conn.to.nodeId !== nodeId
        ),
      };
      console.log("Node removed, new workflow:", newWorkflow);
      return newWorkflow;
    });
  }, []);

  const addConnection = useCallback((connection: Omit<Connection, "id">) => {
    const newConnection: Connection = {
      ...connection,
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setWorkflow((prev) => ({
      ...prev,
      connections: [...prev.connections, newConnection],
    }));
  }, []);

  const removeConnection = useCallback((connectionId: string) => {
    setWorkflow((prev) => ({
      ...prev,
      connections: prev.connections.filter((conn) => conn.id !== connectionId),
    }));
  }, []);

  // Event handlers
  const handleNodeDragStart = (nodeId: string, startPos: Position) => {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (node) {
      setDragState({
        nodeId,
        startPos,
        initialNodePos: node.position,
      });
    }
  };

  const handleConnectionStart = (
    nodeId: string,
    portId: string,
    e: React.MouseEvent
  ) => {
    console.log("🚀 Starting connection from:", nodeId, portId);

    // Get the port element position
    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    console.log("Start position:", startPos);

    setConnectionState({
      isConnecting: true,
      fromNode: nodeId,
      fromPort: portId,
      startPos,
      currentPos: startPos,
    });
  };

  const handleConnectionEnd = (nodeId: string, portId: string) => {
    console.log("🎯 Ending connection at:", nodeId, portId);
    console.log("Current connection state:", connectionState);

    if (
      connectionState.isConnecting &&
      connectionState.fromNode &&
      connectionState.fromPort
    ) {
      // Prevent self-connection
      if (connectionState.fromNode === nodeId) {
        console.log("❌ Cannot connect node to itself");
        setConnectionState({
          isConnecting: false,
          fromNode: null,
          fromPort: null,
          startPos: { x: 0, y: 0 },
          currentPos: { x: 0, y: 0 },
        });
        return;
      }

      // Check if connection already exists
      const existingConnection = workflow.connections.find(
        (conn) =>
          conn.from.nodeId === connectionState.fromNode &&
          conn.from.port === connectionState.fromPort &&
          conn.to.nodeId === nodeId &&
          conn.to.port === portId
      );

      if (existingConnection) {
        console.log("❌ Connection already exists");
      } else {
        console.log("✅ Creating new connection");
        const newConnection = {
          from: {
            nodeId: connectionState.fromNode,
            port: connectionState.fromPort,
          },
          to: { nodeId, port: portId },
        };
        console.log("New connection:", newConnection);
        addConnection(newConnection);
      }
    }

    // Reset connection state
    setConnectionState({
      isConnecting: false,
      fromNode: null,
      fromPort: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
    });
  };

  const handleAddNode = (type: string, position: Position) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      config: {},
    };

    // Set default config values
    const definition = nodeDefinitions[type];
    definition.configFields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        newNode.config[field.id] = field.defaultValue;
      }
    });

    addNode(newNode);
  };

  // Mouse move handler for dragging and connections
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.nodeId) {
        const deltaX = (e.clientX - dragState.startPos.x) / scale;
        const deltaY = (e.clientY - dragState.startPos.y) / scale;
        updateNode(dragState.nodeId, {
          position: {
            x: dragState.initialNodePos.x + deltaX,
            y: dragState.initialNodePos.y + deltaY,
          },
        });
      }

      if (connectionState.isConnecting) {
        setConnectionState((prev) => ({
          ...prev,
          currentPos: { x: e.clientX, y: e.clientY },
        }));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragState.nodeId) {
        setDragState({
          nodeId: null,
          startPos: { x: 0, y: 0 },
          initialNodePos: { x: 0, y: 0 },
        });
      }

      // Don't auto-cancel connections on mouseup - let the port handle it
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, connectionState, scale, updateNode]);

  const contextValue = {
    workflow,
    updateNode,
    updateNodeConfig,
    addNode,
    removeNode,
    addConnection,
    removeConnection,
    scale,
    setScale,
    offset,
    setOffset,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      <div className="w-full h-screen bg-gray-100 relative">
        <Canvas>
          {/* SVG container for all connections with proper transform */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1, pointerEvents: "auto" }}
          >
            <g transform={`translate(${offset.x}, ${offset.y})`}>
              {/* Render connections */}
              {workflow.connections.map((connection) => (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  nodes={workflow.nodes}
                  scale={scale}
                  offset={{ x: 0, y: 0 }} // Pass zero offset since we're handling it with transform
                  onDelete={removeConnection}
                />
              ))}
            </g>
          </svg>

          {/* Render temporary connection line */}
          {connectionState.isConnecting && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 15 }}
            >
              <TempConnectionLine
                start={connectionState.startPos}
                end={connectionState.currentPos}
              />
            </svg>
          )}

          {/* Render nodes */}
          {workflow.nodes.map((node) => {
            const definition = nodeDefinitions[node.type];
            if (!definition) return null;

            return (
              <NodeComponent
                key={node.id}
                node={node}
                definition={definition}
                onDragStart={handleNodeDragStart}
                onConnectionStart={handleConnectionStart}
                onConnectionEnd={handleConnectionEnd}
                onDelete={removeNode}
                isConnecting={connectionState.isConnecting}
              />
            );
          })}
        </Canvas>

        {/* Node Palette */}
        <NodePalette onAddNode={handleAddNode} />

        {/* Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20">
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Zoom: {Math.round(scale * 100)}%
            </div>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setScale(Math.max(scale - 0.1, 0.1))}
              >
                -
              </button>
              <button
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setScale(1)}
              >
                Reset
              </button>
              <button
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setScale(Math.min(scale + 0.1, 2))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Data Display */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20 max-w-md">
          <div className="text-sm font-medium mb-2">Workflow Data:</div>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(workflow, null, 2)}
          </pre>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20 max-w-sm">
          <div className="text-sm font-medium mb-2">Instructions:</div>
          <ul className="text-xs space-y-1">
            <li>• Drag nodes to move them</li>
            <li>• Double-click nodes to configure</li>
            <li>• Drag from output ports to input ports</li>
            <li>• Use mouse wheel to zoom</li>
            <li>• Ctrl+click to pan canvas</li>
            <li>• Add nodes from the palette</li>
          </ul>
        </div>
      </div>
    </WorkflowContext.Provider>
  );
};

export default AlgorithmBuilder;

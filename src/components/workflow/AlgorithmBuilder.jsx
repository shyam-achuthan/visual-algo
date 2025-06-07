import React, { useState, useEffect } from 'react';
import { WorkflowContext } from '../../contexts/WorkflowContext';
import { useWorkflowOperations } from '../../hooks/useWorkflowOperations';
import Canvas from '../canvas/Canvas';
import NodeComponent from '../nodes/NodeComponent';
import NodePalette from './NodePalette';
import NodeConfigPanel from './NodeConfigPanel';
import Toolbar from './Toolbar';
import ConnectionLine, { TempConnectionLine } from '../canvas/ConnectionLine';
import basicNodes from '../../config/nodeDefinitions.json';
import { technical as technicalNodes } from '../../config/technicalIndicators.json';
import dataNodes from '../../config/dataNodes.json';
import signalNodes from '../../config/signalNodes.json';
import { brokers as brokerNodes } from '../../config/brokerNodes.json';
import { messengers as messengerNodes } from '../../config/messengerNodes.json';

// Combine all node definitions
const nodeDefinitions = {
  ...basicNodes,
  ...technicalNodes,
  ...dataNodes,
  ...signalNodes,
  ...brokerNodes,
  ...messengerNodes,
};

const initialWorkflow = {
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
  ],
  connections: [],
};

const AlgorithmBuilder = () => {
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragState, setDragState] = useState({
    nodeId: null,
    startPos: { x: 0, y: 0 },
    initialNodePos: { x: 0, y: 0 },
  });
  const [connectionState, setConnectionState] = useState({
    isConnecting: false,
    fromNode: null,
    fromPort: null,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
  });

  const {
    updateNode,
    updateNodeConfig,
    addNode,
    removeNode,
    addConnection,
    removeConnection,
  } = useWorkflowOperations(setWorkflow);

  const handleNodeDragStart = (nodeId, startPos) => {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (node) {
      setDragState({
        nodeId,
        startPos,
        initialNodePos: node.position,
      });
    }
  };

  const handleConnectionStart = (nodeId, portId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    setConnectionState({
      isConnecting: true,
      fromNode: nodeId,
      fromPort: portId,
      startPos,
      currentPos: startPos,
    });
  };

  const handleConnectionEnd = (nodeId, portId) => {
    if (
      connectionState.isConnecting &&
      connectionState.fromNode &&
      connectionState.fromPort
    ) {
      if (connectionState.fromNode !== nodeId) {
        const newConnection = {
          id: `connection-${Date.now()}`,
          from: {
            nodeId: connectionState.fromNode,
            port: connectionState.fromPort,
          },
          to: { nodeId, port: portId },
        };
        addConnection(newConnection);
      }
    }

    setConnectionState({
      isConnecting: false,
      fromNode: null,
      fromPort: null,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
    });
  };

  const handleAddNode = (type, position) => {
    console.log('Adding node:', type, 'at position:', position);
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: position || { x: 100, y: 100 }, // Default position if none provided
      config: {},
    };

    const definition = nodeDefinitions[type];
    console.log('Node definition:', definition);
    if (definition) {
      definition.configFields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          newNode.config[field.id] = field.defaultValue;
        }
      });
    }
    console.log('Created node:', newNode);

    addNode(newNode);
  };

  const handleNodeClick = (nodeId) => {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    setSelectedNode(node);
  };

  const handleLoadWorkflow = (workflowData) => {
    setWorkflow(workflowData);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
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

    const handleMouseUp = () => {
      if (dragState.nodeId) {
        setDragState({
          nodeId: null,
          startPos: { x: 0, y: 0 },
          initialNodePos: { x: 0, y: 0 },
        });
      }
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
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
              {workflow.connections.map((connection) => (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  nodes={workflow.nodes}
                  scale={scale}
                  offset={offset}
                  onDelete={removeConnection}
                />
              ))}
            </g>
          </svg>

          {connectionState.isConnecting && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
              <TempConnectionLine
                start={connectionState.startPos}
                end={connectionState.currentPos}
              />
            </svg>
          )}

          {/* Node Layer */}
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
                onClick={handleNodeClick}
                isConnecting={connectionState.isConnecting}
              />
            );
          })}

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
                onClick={handleNodeClick}
                isConnecting={connectionState.isConnecting}
              />
            );
          })}
        </Canvas>

        <NodePalette onAddNode={handleAddNode} />
        <Toolbar onLoadWorkflow={handleLoadWorkflow} />
        <Controls scale={scale} setScale={setScale} />
        <WorkflowDataDisplay workflow={workflow} />
        <Instructions />

        {selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </WorkflowContext.Provider>
  );
};

const Controls = ({ scale, setScale }) => (
  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20">
    <div className="space-y-2">
      <div className="text-sm font-medium">Zoom: {Math.round(scale * 100)}%</div>
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
);

const WorkflowDataDisplay = ({ workflow }) => (
  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20 max-w-md">
    <div className="text-sm font-medium mb-2">Workflow Data:</div>
    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
      {JSON.stringify(workflow, null, 2)}
    </pre>
  </div>
);

const Instructions = () => (
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
);

export default AlgorithmBuilder;

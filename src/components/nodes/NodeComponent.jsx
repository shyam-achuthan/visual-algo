import React, { useState } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import PortComponent from './PortComponent';

const ContextMenu = ({ x, y, onConfigure, onDuplicate, onDelete }) => (
  <div
    className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
    style={{ left: x, top: y }}
  >
    <button
      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      onClick={onConfigure}
    >
      <span>⚙️</span>
      Configure
    </button>
    <button
      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
      onClick={onDuplicate}
    >
      <span>📋</span>
      Duplicate
    </button>
    <hr className="my-1" />
    <button
      className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 text-red-600 flex items-center gap-2"
      onClick={onDelete}
    >
      <span>🗑️</span>
      Delete
    </button>
  </div>
);

const ConfigSummary = ({ node }) => (
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
);

const ConfigPanel = ({ node, definition }) => {
  const { updateNodeConfig } = useWorkflow();

  const handleChange = (fieldId, value) => {
    if (value === '') {
      value = undefined;
    } else if (field.type === 'number') {
      value = Number(value);
    }
    updateNodeConfig(node.id, fieldId, value);
  };

  return (
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
              value={node.config[field.id] ?? field.defaultValue ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {field.type === "select" && (
            <select
              className="w-full px-2 py-1 text-xs border rounded"
              value={node.config[field.id] ?? field.defaultValue ?? ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
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
              value={node.config[field.id] ?? field.defaultValue ?? 0}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const NodeComponent = ({
  node,
  definition,
  onDragStart,
  onConnectionStart,
  onConnectionEnd,
  onDelete,
  isConnecting,
  onClick,
}) => {
  const { updateNode, scale, offset } = useWorkflow();
  const [isDragging, setIsDragging] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      if (e.detail === 2) {
        // Double click
        onClick?.(node.id);
      } else {
        // Single click - drag
        const startPos = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        onDragStart?.(node.id, startPos);
      }
    }
    e.stopPropagation();
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${definition.label} node "${node.config.name || node.id}"?`)) {
      onDelete(node.id);
    }
    setShowContextMenu(false);
  };

  const handleDuplicate = () => {
    // TODO: Implement node duplication
    setShowContextMenu(false);
  };

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
        onContextMenu={handleRightClick}
      >
        {/* Delete button */}
        <button
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-all z-50 flex items-center justify-center font-bold shadow-lg opacity-0 group-hover:opacity-100"
          onClick={handleDelete}
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
            {definition.inputs.map((port) => (
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
            {definition.outputs.map((port) => (
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

        {/* Node Content */}
        <div className={`p-3 ${definition.inputs.length > 0 || definition.outputs.length > 0 ? "pt-8" : ""}`}>
          {showConfig ? (
            <ConfigPanel
              node={node}
              definition={definition}
            />
          ) : (
            <ConfigSummary node={node} />
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onConfigure={() => setShowConfig(!showConfig)}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default NodeComponent;

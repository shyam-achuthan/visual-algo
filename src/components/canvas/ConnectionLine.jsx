import React, { useState } from 'react';

const ConnectionLine = ({ connection, nodes, scale, offset, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fromNode = nodes.find((n) => n.id === connection.from.nodeId);
  const toNode = nodes.find((n) => n.id === connection.to.nodeId);

  if (!fromNode || !toNode) return null;

  // Get port positions
  const fromPort = fromNode.outputs?.find(p => p.id === connection.from.port);
  const toPort = toNode.inputs?.find(p => p.id === connection.to.port);

  // Calculate positions with proper offsets and scaling
  const startX = fromNode.position.x + (fromPort?.x || 160);
  const startY = fromNode.position.y + (fromPort?.y || 56);
  const endX = toNode.position.x + (toPort?.x || -20);
  const endY = toNode.position.y + (toPort?.y || 56);

  // Calculate control points for a smooth curve
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  const controlLength = Math.min(dx * 0.5, 150);
  
  const controlX1 = startX + controlLength;
  const controlX2 = endX - controlLength;

  const pathD = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;

  const handleConnectionClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this connection?")) {
      onDelete(connection.id);
    }
  };

  return (
    <g className="connection-line">
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
      {/* Visible path with gradient */}
      <defs>
        <linearGradient id={`gradient-${connection.id}`} gradientUnits="userSpaceOnUse"
          x1={startX} y1={startY} x2={endX} y2={endY}>
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
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

export const TempConnectionLine = ({ start, end }) => {
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

export default ConnectionLine;

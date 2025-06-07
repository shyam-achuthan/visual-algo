import React from 'react';

const PortComponent = ({ port, nodeId, onConnectionStart, onConnectionEnd, isConnecting }) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (port.type === "output" && onConnectionStart) {
      console.log("Starting connection from output port:", nodeId, port.id);
      onConnectionStart(nodeId, port.id, e);
    }
  };

  const handleMouseUp = (e) => {
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

export default PortComponent;

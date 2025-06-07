import { useState, useCallback } from "react";

export const useDragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((e, nodeType) => {
    setIsDragging(true);
    e.dataTransfer.setData("nodeType", nodeType);
    // Set ghost image
    const ghostElement = document.createElement("div");
    ghostElement.classList.add("node-ghost");
    ghostElement.innerHTML = `📦 ${nodeType}`;
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    setTimeout(() => document.body.removeChild(ghostElement), 0);
  }, []);

  const handleDrag = useCallback((e) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    position,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};

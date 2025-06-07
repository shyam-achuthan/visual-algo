import { useCallback } from "react";

export const useWorkflowOperations = (setWorkflow) => {
  const updateNode = useCallback(
    (nodeId, updates) => {
      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        ),
      }));
    },
    [setWorkflow]
  );

  const updateNodeConfig = useCallback(
    (nodeId, fieldId, value) => {
      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                config: {
                  ...node.config,
                  [fieldId]: value,
                },
              }
            : node
        ),
      }));
    },
    [setWorkflow]
  );

  const addNode = useCallback(
    (node) => {
      setWorkflow((prev) => ({
        ...prev,
        nodes: [...prev.nodes, node],
      }));
    },
    [setWorkflow]
  );

  const removeNode = useCallback(
    (nodeId) => {
      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((node) => node.id !== nodeId),
        connections: prev.connections.filter(
          (conn) => conn.from.nodeId !== nodeId && conn.to.nodeId !== nodeId
        ),
      }));
    },
    [setWorkflow]
  );

  const addConnection = useCallback(
    (connection) => {
      const newConnection = {
        ...connection,
        id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setWorkflow((prev) => ({
        ...prev,
        connections: [...prev.connections, newConnection],
      }));
    },
    [setWorkflow]
  );

  const removeConnection = useCallback(
    (connectionId) => {
      setWorkflow((prev) => ({
        ...prev,
        connections: prev.connections.filter(
          (conn) => conn.id !== connectionId
        ),
      }));
    },
    [setWorkflow]
  );

  return {
    updateNode,
    addNode,
    removeNode,
    addConnection,
    removeConnection,
    updateNodeConfig,
  };
};

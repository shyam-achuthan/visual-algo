import React, { createContext, useContext, useState } from 'react';
import { executeNode } from '../utils/workflowExecutor';

export const WorkflowContext = createContext(null);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

export const WorkflowProvider = ({ children }) => {
  const [workflow, setWorkflow] = useState({ nodes: [], connections: [] });
  const [nodeOutputs, setNodeOutputs] = useState({});

  const addNode = (node) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, node]
    }));
  };

  const removeNode = (nodeId) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(
        c => c.from.nodeId !== nodeId && c.to.nodeId !== nodeId
      )
    }));
  };

  const updateNode = (nodeId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const updateNodeConfig = (nodeId, fieldId, value) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              config: {
                ...node.config,
                [fieldId]: value
              }
            }
          : node
      )
    }));
  };

  const addConnection = (connection) => {
    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, connection]
    }));
  };

  const removeConnection = (connectionId) => {
    setWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(c => c.id !== connectionId)
    }));
  };

  const updateNodeOutput = (nodeId, output) => {
    setNodeOutputs(prev => ({
      ...prev,
      [nodeId]: output
    }));
  };

  const executeWorkflow = async () => {
    const outputs = {};
    try {
      // Execute data source nodes first
      const dataNodes = workflow.nodes.filter(node => node.type === 'marketData');
      for (const node of dataNodes) {
        const output = await executeNode(node, workflow);
        outputs[node.id] = output;
        updateNodeOutput(node.id, output);
      }
      
      return outputs;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  };

  const value = {
    workflow,
    setWorkflow,
    nodeOutputs,
    addNode,
    removeNode,
    updateNode,
    updateNodeConfig,
    addConnection,
    removeConnection,
    executeWorkflow
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

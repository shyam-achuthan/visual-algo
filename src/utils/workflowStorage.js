import { saveAs } from "file-saver";

export const saveWorkflow = (workflow) => {
  try {
    if (!workflow || !workflow.nodes) {
      throw new Error("Invalid workflow data");
    }

    const workflowData = {
      nodes: workflow.nodes.map((node) => ({
        ...node,
        config: node.config || {},
      })),
      connections: workflow.connections || [],
      metadata: {
        version: "1.0.0",
        created: new Date().toISOString(),
        nodeCount: workflow.nodes.length,
        connectionCount: (workflow.connections || []).length,
      },
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: "application/json",
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    saveAs(blob, `workflow-${timestamp}.json`);

    return true;
  } catch (error) {
    console.error("Error saving workflow:", error);
    throw new Error("Failed to save workflow: " + error.message);
  }
};

export const loadWorkflow = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workflowData = JSON.parse(event.target.result);

        // Validate workflow structure
        if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
          throw new Error("Invalid workflow format: missing nodes array");
        }

        // Ensure all nodes have required properties
        workflowData.nodes = workflowData.nodes.map((node) => ({
          id:
            node.id ||
            `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: node.type,
          position: node.position || { x: 0, y: 0 },
          config: node.config || {},
        }));

        // Ensure connections array exists
        workflowData.connections = workflowData.connections || [];

        resolve(workflowData);
      } catch (error) {
        reject(new Error("Invalid workflow file: " + error.message));
      }
    };

    reader.onerror = () => reject(new Error("Error reading workflow file"));
    reader.readAsText(file);
  });
};

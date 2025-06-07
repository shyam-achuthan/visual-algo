import { saveAs } from "file-saver";

export const saveWorkflow = (workflow) => {
  const workflowData = {
    nodes: workflow.nodes,
    connections: workflow.connections,
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
    type: "application/json",
  });

  saveAs(blob, `workflow-${Date.now()}.json`);
};

export const loadWorkflow = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workflowData = JSON.parse(event.target.result);
        resolve(workflowData);
      } catch (error) {
        reject(new Error("Invalid workflow file"));
      }
    };

    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};

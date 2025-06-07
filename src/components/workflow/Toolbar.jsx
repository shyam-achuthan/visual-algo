import React, { useRef, useState } from 'react';
import { saveWorkflow, loadWorkflow } from '../../utils/workflowStorage';
import NodeCreationMenu from './NodeCreationMenu';
import { useWorkflow } from '../../contexts/WorkflowContext';

const Toolbar = ({ onLoadWorkflow }) => {
  const fileInputRef = useRef(null);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const { addNode } = useWorkflow();

  const handleSaveWorkflow = (workflow) => {
    saveWorkflow(workflow);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddNode = (nodeType) => {
    const initialPosition = { x: 100, y: 100 };
    addNode({
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: initialPosition,
      config: {}
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const workflowData = await loadWorkflow(file);
        onLoadWorkflow(workflowData);
      } catch (error) {
        console.error('Error loading workflow:', error);
        alert('Error loading workflow file');
      }
    }
  };

  return (
    <div className="absolute top-4 left-4 z-20">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowNodeMenu(!showNodeMenu)}
            className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center text-xl font-semibold"
            title="Add Node"
          >
            +
          </button>
          <div className="h-8 w-px bg-gray-200" /> {/* Divider */}
          <button
            onClick={() => handleSaveWorkflow()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Save Workflow
          </button>
          <button
            onClick={handleLoadClick}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Load Workflow
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      {showNodeMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowNodeMenu(false)}
          />
          <NodeCreationMenu
            onNodeSelect={handleAddNode}
            onClose={() => setShowNodeMenu(false)}
          />
        </>
      )}
    </div>
  );
};

export default Toolbar;

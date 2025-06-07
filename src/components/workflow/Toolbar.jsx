import React, { useRef, useState } from 'react';
import { saveWorkflow, loadWorkflow } from '../../utils/workflowStorage';
import NodeCreationMenu from './NodeCreationMenu';
import { useWorkflow } from '../../contexts/WorkflowContext';

const Toolbar = ({ onLoadWorkflow }) => {
  const fileInputRef = useRef(null);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { workflow, addNode } = useWorkflow();

  const handleSaveWorkflow = () => {
    if (workflow) {
      saveWorkflow(workflow);
    }
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

  const handleExecuteWorkflow = async () => {
    if (!workflow || !workflow.nodes.length) {
      alert('No workflow to execute');
      return;
    }

    setIsExecuting(true);
    try {
      // Start with data source nodes
      const dataNodes = workflow.nodes.filter(node => node.type === 'marketData');
      for (const node of dataNodes) {
        await executeNode(node, workflow);
      }
      
    } catch (error) {
      console.error('Error executing workflow:', error);
      alert('Error executing workflow: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Title Section */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Algorithm Builder</h1>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">Workflow Actions</span>
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveWorkflow}
                className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center text-sm"
              >
                <span className="mr-1">💾</span>
                Save
              </button>

              <button
                onClick={handleLoadClick}
                className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center text-sm"
              >
                <span className="mr-1">📂</span>
                Load
              </button>

              <button
                onClick={handleExecuteWorkflow}
                disabled={isExecuting}
                className={`px-3 py-1.5 text-white rounded-md transition-colors flex items-center text-sm ${
                  isExecuting 
                    ? 'bg-yellow-500'
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                <span className="mr-1">{isExecuting ? '⚡' : '▶️'}</span>
                {isExecuting ? 'Executing...' : 'Execute'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Add Node */}
      <div className="fixed left-6 top-20 z-40">
        <div className="relative">
          <button
            onClick={() => setShowNodeMenu(!showNodeMenu)}
            className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-2xl
              transition-all duration-200 hover:scale-110
              bg-blue-500 hover:bg-blue-600"
            title="Add node"
          >
            <span className={`transition-transform duration-200 ${showNodeMenu ? 'rotate-45' : ''}`}>+</span>
          </button>

          {showNodeMenu && (
            <div className="absolute top-14 left-0">
              <NodeCreationMenu
                onNodeSelect={(nodeType) => {
                  handleAddNode(nodeType);
                  setShowNodeMenu(false);
                }}
                onClose={() => setShowNodeMenu(false)}
              />
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default Toolbar;

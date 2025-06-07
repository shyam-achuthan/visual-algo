import React from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import basicNodes from '../../config/nodeDefinitions.json';
import { technical as technicalNodes } from '../../config/technicalIndicators.json';
import dataNodes from '../../config/dataNodes.json';
import signalNodes from '../../config/signalNodes.json';
import { brokers as brokerNodes } from '../../config/brokerNodes.json';
import { messengers as messengerNodes } from '../../config/messengerNodes.json';

// Combine all node definitions
const nodeDefinitions = {
  ...basicNodes,
  ...technicalNodes,
  ...dataNodes,
  ...signalNodes,
  ...brokerNodes,
  ...messengerNodes
};

const NodeConfigPanel = ({ node, onClose }) => {
  const { updateNodeConfig } = useWorkflow();
  const definition = nodeDefinitions[node.type];

  if (!definition) {
    console.warn(`No definition found for node type: ${node.type}`);
    return null;
  }

  const handleConfigChange = (fieldId, value) => {
    if (value === '') {
      value = undefined;
    } else if (typeof definition.configFields.find(f => f.id === fieldId)?.defaultValue === 'number') {
      value = Number(value);
    }
    updateNodeConfig(node.id, fieldId, value);
  };

  const renderConfigField = (field) => {
    switch (field.type) {
      case 'text':
      case 'string':
      case 'number':
        return (
          <input
            type={field.type === 'string' ? 'text' : field.type}
            value={node.config?.[field.id] ?? field.defaultValue}
            onChange={(e) => handleConfigChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      case 'select':
        return (
          <select
            value={node.config?.[field.id] ?? field.defaultValue}
            onChange={(e) => handleConfigChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!node.config?.[field.id]}
              onChange={(e) => handleConfigChange(field.id, e.target.checked)}
              className="form-checkbox h-5 w-5"
            />
            <span className="text-sm text-gray-600">
              {field.label}
            </span>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>{definition.icon}</span>
            <span>{definition.label}</span>
          </h3>
          <p className="text-sm text-gray-500">{definition.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        {definition.configFields?.map((field) => (
          <div key={field.id}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {renderConfigField(field)}
            {field.description && (
              <p className="mt-1 text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        ))}
      </div>
      
      {/* Show current configuration */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Configuration</h4>
        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(node.config, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default NodeConfigPanel;

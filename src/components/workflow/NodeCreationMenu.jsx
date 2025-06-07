import React, { useState } from 'react';
import basicNodes from '../../config/nodeDefinitions.json';
import { technical as technicalNodes } from '../../config/technicalIndicators.json';
import dataNodes from '../../config/dataNodes.json';
import signalNodes from '../../config/signalNodes.json';
import { brokers as brokerNodes } from '../../config/brokerNodes.json';
import { messengers as messengerNodes } from '../../config/messengerNodes.json';

// Node definitions with icons and descriptions
const nodeDefinitions = {
  ...basicNodes,
  ...technicalNodes,
  ...dataNodes,
  ...signalNodes,
  ...brokerNodes,
  ...messengerNodes
};

const categories = {
  basic: {
    label: 'Basic',
    icon: '🔧',
    nodes: Object.keys(basicNodes)
  },
  indicators: {
    label: 'Technical Indicators',
    icon: '📈',
    nodes: Object.keys(technicalNodes)
  },
  data: {
    label: 'Data Sources',
    icon: '📊',
    nodes: Object.keys(dataNodes)
  },
  signals: {
    label: 'Signals',
    icon: '🎯',
    nodes: Object.keys(signalNodes)
  },
  brokers: {
    label: 'Brokers',
    icon: '💹',
    subcategories: {
      dhan: {
        label: 'Dhan',
        icon: '🏢',
        nodes: ['dhanCreateOrder', 'dhanDeleteOrder', 'dhanUpdateOrder', 'dhanClosePositions', 'dhanGetPositions']
      }
    }
  },
  messengers: {
    label: 'Messengers',
    icon: '💬',
    subcategories: {
      telegram: {
        label: 'Telegram',
        icon: '✈️',
        nodes: ['telegramSendMessage', 'telegramSendPhoto']
      }
    }
  }
};

const NodeCreationMenu = ({ onNodeSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const renderNodes = (nodes) => (
    <div className="space-y-1">
      {nodes.map((nodeType) => (
        <button
          key={nodeType}
          onClick={() => {
            onNodeSelect(nodeType);
            onClose();
          }}
          className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-md text-sm flex items-center gap-2"
        >
          <span className="text-lg">{nodeDefinitions[nodeType]?.icon || '📦'}</span>
          <div className="flex flex-col">
            <span>{nodeDefinitions[nodeType]?.label || nodeType}</span>
            {nodeDefinitions[nodeType]?.description && (
              <span className="text-xs text-gray-500">{nodeDefinitions[nodeType].description}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    if (selectedCategory && categories[selectedCategory].subcategories) {
      if (selectedSubcategory) {
        // Show nodes in selected subcategory
        const subcategory = categories[selectedCategory].subcategories[selectedSubcategory];
        return (
          <div>
            <div className="flex items-center mb-2 px-2">
              <button
                onClick={handleBack}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ‹ Back
              </button>
              <span className="ml-2 text-sm font-medium">
                {subcategory.label}
              </span>
            </div>
            {renderNodes(subcategory.nodes)}
          </div>
        );
      }

      // Show subcategories
      return (
        <div>
          <div className="flex items-center mb-2 px-2">
            <button
              onClick={handleBack}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ‹ Back
            </button>
            <span className="ml-2 text-sm font-medium">
              {categories[selectedCategory].label}
            </span>
          </div>
          <div className="space-y-1">
            {Object.entries(categories[selectedCategory].subcategories).map(([key, subcategory]) => (
              <button
                key={key}
                onClick={() => setSelectedSubcategory(key)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm"
              >
                <span className="text-lg">{subcategory.icon}</span>
                <span>{subcategory.label}</span>
                <span className="ml-auto text-gray-400">›</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCategory) {
      // Show nodes in selected category
      return (
        <div>
          <div className="flex items-center mb-2 px-2">
            <button
              onClick={handleBack}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ‹ Back
            </button>
            <span className="ml-2 text-sm font-medium">
              {categories[selectedCategory].label}
            </span>
          </div>
          {renderNodes(categories[selectedCategory].nodes)}
        </div>
      );
    }

    // Show main categories
    return (
      <div className="space-y-1">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm"
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.label}</span>
            <span className="ml-auto text-gray-400">›</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 min-w-[200px]">
      {renderContent()}
    </div>
  );
};

export default NodeCreationMenu;

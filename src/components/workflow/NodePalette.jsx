import React, { useState, useEffect } from 'react';
import basicNodes from '../../config/nodeDefinitions.json';
import technicalNodes from '../../config/technicalIndicators.json';

const categories = {
  basic: {
    label: "Basic Nodes",
    icon: "🔧",
    nodes: ["start", "if", "action"],
  },
  technical: {
    label: "Technical Indicators",
    icon: "📈",
    nodes: ["ema", "rsi", "macd"],
  },
  oscillators: {
    label: "Oscillators",
    icon: "⚡",
    nodes: ["stochastic"],
  },
  volume: {
    label: "Volume Analysis",
    icon: "📦",
    nodes: ["obv", "vwap"],
  }
};

const NodePalette = ({ onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (categoryKey) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddNode = (nodeType) => {
    onAddNode(nodeType, { x: 100, y: 100 });
    setIsOpen(false);
    setExpandedCategories(new Set());
  };

  const handleClickOutside = (e) => {
    const target = e.target;
    if (!target.closest(".node-palette")) {
      setIsOpen(false);
      setExpandedCategories(new Set());
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getNodeDefinition = (nodeType) => {
    return (
      basicNodes[nodeType] ||
      technicalNodes.technical?.[nodeType] ||
      technicalNodes.oscillators?.[nodeType] ||
      technicalNodes.volume?.[nodeType]
    );
  };

  return (
    <div className="absolute top-4 left-4 z-20 node-palette">
    

      {isOpen && (
        <div className="absolute top-14 left-0 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Add Node</h3>
            <p className="text-xs text-gray-500 mt-1">Choose from the categories below</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {Object.entries(categories).map(([categoryKey, category]) => (
              <div key={categoryKey} className="border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700">{category.label}</div>
                      <div className="text-xs text-gray-500">{category.nodes.length} nodes</div>
                    </div>
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 ${expandedCategories.has(categoryKey) ? "rotate-90" : ""}`}>
                    ▶
                  </span>
                </button>

                {expandedCategories.has(categoryKey) && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    {category.nodes.map((nodeType) => {
                      const def = getNodeDefinition(nodeType);
                      if (!def) return null;
                      return (
                        <button
                          key={nodeType}
                          className="w-full px-8 py-2 flex items-center gap-3 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left group"
                          onClick={() => handleAddNode(nodeType)}
                        >
                          <span className="text-base">{def.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{def.label}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {def.inputs.length} inputs, {def.outputs.length} outputs
                            </div>
                          </div>
                          <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                            Add
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Click on a node to add it to the canvas
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodePalette;

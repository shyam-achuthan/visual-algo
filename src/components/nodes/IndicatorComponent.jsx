import React, { useState, useEffect, useCallback } from 'react';
import { calculateIndicator } from '../../utils/technicalAnalysis';
import ChartComponent from '../chart/ChartComponent';

const IndicatorComponent = ({ node, inputData, onResultsUpdate }) => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateResults = useCallback(() => {
    if (!inputData || !node.config) return;

    try {
      const calculatedData = calculateIndicator(
        node.type,
        inputData,
        node.config
      );

      setResults(calculatedData);
      onResultsUpdate(calculatedData);
      setError(null);

      // Prepare data for chart display
      if (Array.isArray(calculatedData)) {
        const indicators = [{
          name: node.type.toUpperCase(),
          data: calculatedData,
          color: getIndicatorColor(node.type),
          overlay: isOverlayIndicator(node.type)
        }];
        setChartData(indicators);
      }
    } catch (err) {
      setError(err.message);
      setResults(null);
      onResultsUpdate(null);
    }
  }, [inputData, node.type, node.config, onResultsUpdate]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const handleConfigChange = (field, value) => {
    // Update configuration through parent component
    onResultsUpdate({ type: 'config', field, value });
  };

  const getIndicatorColor = (type) => {
    const colors = {
      ema: '#2962FF',
      sma: '#7B1FA2',
      rsi: '#E91E63',
      macd: '#FF6D00',
      bollinger: '#00BCD4',
      stochastic: '#4CAF50',
      adx: '#9C27B0',
      obv: '#795548',
      vwap: '#607D8B'
    };
    return colors[type] || '#2962FF';
  };

  const isOverlayIndicator = (type) => {
    return ['ema', 'sma', 'bollinger', 'vwap'].includes(type);
  };

  const renderConfigFields = () => {
    const definition = node.definition;
    if (!definition || !definition.configFields) return null;

    return (
      <div className="space-y-2">
        {definition.configFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === 'number' && (
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={node.config[field.id] || field.defaultValue}
                onChange={(e) => handleConfigChange(field.id, Number(e.target.value))}
              />
            )}
            {field.type === 'select' && (
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={node.config[field.id] || field.defaultValue}
                onChange={(e) => handleConfigChange(field.id, e.target.value)}
              >
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        {renderConfigFields()}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {inputData && (
        <ChartComponent
          data={inputData}
          indicators={chartData}
          onCrosshairMove={(param) => {
            // Handle crosshair move if needed
          }}
        />
      )}

      {results && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Latest Results:
          </div>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(
              Array.isArray(results) ? results.slice(-5) : results,
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default IndicatorComponent;

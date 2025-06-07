import React, { useState, useEffect, useCallback } from 'react';

const SignalComponent = ({ node, inputData, onSignalGenerated }) => {
  const [signals, setSignals] = useState([]);
  const [lastSignal, setLastSignal] = useState(null);

  const evaluateCondition = useCallback((value, operator, threshold) => {
    switch (operator) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      case '==':
        return Math.abs(value - threshold) < 0.0001; // For floating point comparison
      case '!=':
        return Math.abs(value - threshold) >= 0.0001;
      default:
        return false;
    }
  }, []);

  const generateSignal = useCallback(() => {
    if (!inputData || inputData.length === 0) return;

    const latestData = Array.isArray(inputData) ? inputData[inputData.length - 1] : inputData;
    const { operator, threshold, signalType } = node.config;
    
    if (typeof latestData !== 'number') return;

    const conditionMet = evaluateCondition(latestData, operator, threshold);
    
    if (conditionMet) {
      const newSignal = {
        timestamp: new Date(),
        type: signalType,
        value: latestData,
        message: `${signalType} signal generated at ${latestData}`
      };

      setSignals(prev => [...prev, newSignal]);
      setLastSignal(newSignal);
      onSignalGenerated(newSignal);
    }
  }, [inputData, node.config, evaluateCondition, onSignalGenerated]);

  useEffect(() => {
    generateSignal();
  }, [generateSignal]);

  const handleConfigChange = (field, value) => {
    onSignalGenerated({ type: 'config', field, value });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        {/* Configuration */}
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Operator
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={node.config.operator}
              onChange={(e) => handleConfigChange('operator', e.target.value)}
            >
              <option value=">">Greater than (&gt;)</option>
              <option value="<">Less than (&lt;)</option>
              <option value=">=">Greater than or equal (≥)</option>
              <option value="<=">Less than or equal (≤)</option>
              <option value="==">Equal to (=)</option>
              <option value="!=">Not equal to (≠)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Threshold
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={node.config.threshold}
              onChange={(e) => handleConfigChange('threshold', Number(e.target.value))}
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Signal Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={node.config.signalType}
              onChange={(e) => handleConfigChange('signalType', e.target.value)}
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
          </div>
        </div>

        {/* Latest Signal */}
        {lastSignal && (
          <div className={`p-3 rounded ${
            lastSignal.type === 'BUY' 
              ? 'bg-green-100 text-green-800'
              : lastSignal.type === 'SELL'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className="font-medium">Latest Signal:</div>
            <div className="text-sm mt-1">
              {lastSignal.message}
              <div className="text-xs opacity-75">
                {lastSignal.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Signal History */}
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Signal History:
          </div>
          <div className="max-h-40 overflow-y-auto">
            {signals.slice().reverse().map((signal, index) => (
              <div
                key={index}
                className={`text-xs p-2 mb-1 rounded ${
                  signal.type === 'BUY'
                    ? 'bg-green-50 text-green-700'
                    : signal.type === 'SELL'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-medium">{signal.type}</div>
                <div>{signal.message}</div>
                <div className="opacity-75">
                  {signal.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalComponent;

import React, { useState, useEffect, useCallback } from 'react';
import { fetchMarketData, subscribeToMarketData, getAvailableSymbols } from '../../utils/marketData';
import { calculateIndicator } from '../../utils/technicalAnalysis';
import ChartComponent from '../chart/ChartComponent';

const DataSourceComponent = ({ node, onDataUpdate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [symbols] = useState(getAvailableSymbols());

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { symbol, timeframe, bars } = node.config;
      const marketData = await fetchMarketData(symbol, timeframe, bars);
      setData(marketData);
      onDataUpdate(marketData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [node.config, onDataUpdate]);

  useEffect(() => {
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMarketData(node.config.symbol, (newData) => {
      setData(prevData => {
        const updatedData = [...prevData.slice(1), newData];
        onDataUpdate(updatedData);
        return updatedData;
      });
    });

    return () => unsubscribe();
  }, [node.config.symbol, loadData, onDataUpdate]);

  const handleConfigChange = (field, value) => {
    onDataUpdate({ type: 'config', field, value });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Symbol</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={node.config.symbol}
            onChange={(e) => handleConfigChange('symbol', e.target.value)}
          >
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Timeframe</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={node.config.timeframe}
            onChange={(e) => handleConfigChange('timeframe', e.target.value)}
          >
            <option value="1m">1 minute</option>
            <option value="5m">5 minutes</option>
            <option value="15m">15 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="1d">1 day</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bars</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={node.config.bars}
            onChange={(e) => handleConfigChange('bars', parseInt(e.target.value, 10))}
            min="10"
            max="1000"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ChartComponent
          data={data}
          indicators={[]}
          onCrosshairMove={(param) => {
            // Handle crosshair move if needed
          }}
        />
      )}
    </div>
  );
};

export default DataSourceComponent;

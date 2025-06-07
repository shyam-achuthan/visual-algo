import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const ChartComponent = ({ data, indicators, onCrosshairMove }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef({
    candlestick: null,
    volume: null,
    indicators: new Map(),
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set as an overlay
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Store references
    chartRef.current = chart;
    seriesRef.current.candlestick = candlestickSeries;
    seriesRef.current.volume = volumeSeries;

    // Setup crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (onCrosshairMove) {
        onCrosshairMove(param);
      }
    });

    // Set initial data
    if (data) {
      updateChartData(data);
    }

    // Cleanup
    return () => {
      chart.remove();
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (data) {
      updateChartData(data);
    }
  }, [data]);

  // Update indicators when they change
  useEffect(() => {
    updateIndicators(indicators);
  }, [indicators]);

  const updateChartData = (data) => {
    if (!seriesRef.current.candlestick || !seriesRef.current.volume) return;

    const candleData = data.map((d) => ({
      time: d.timestamp.getTime() / 1000,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData = data.map((d) => ({
      time: d.timestamp.getTime() / 1000,
      value: d.volume,
      color: d.close >= d.open ? '#26a69a' : '#ef5350',
    }));

    seriesRef.current.candlestick.setData(candleData);
    seriesRef.current.volume.setData(volumeData);
  };

  const updateIndicators = (indicators) => {
    if (!chartRef.current) return;

    // Remove old indicators
    seriesRef.current.indicators.forEach((series) => {
      chartRef.current.removeSeries(series);
    });
    seriesRef.current.indicators.clear();

    // Add new indicators
    indicators?.forEach((indicator) => {
      if (!indicator.data || indicator.data.length === 0) return;

      const series = chartRef.current.addLineSeries({
        color: indicator.color || '#2962FF',
        lineWidth: 2,
        title: indicator.name,
        priceScaleId: indicator.overlay ? 'right' : indicator.name,
        overlay: indicator.overlay,
      });

      const seriesData = indicator.data.map((value, index) => ({
        time: data[index].timestamp.getTime() / 1000,
        value: value,
      }));

      series.setData(seriesData);
      seriesRef.current.indicators.set(indicator.name, series);
    });
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-[500px] bg-white rounded-lg shadow-lg"
    />
  );
};

export default ChartComponent;

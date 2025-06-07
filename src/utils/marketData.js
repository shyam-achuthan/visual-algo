// Sample market data fetcher
// In a real application, this would connect to a market data provider

const sampleData = {
  AAPL: generateSampleData(),
  GOOGL: generateSampleData(),
  MSFT: generateSampleData(),
  AMZN: generateSampleData(),
};

function generateSampleData(days = 100) {
  const data = [];
  let price = 100 + Math.random() * 100;
  let volume = 1000000;

  for (let i = 0; i < days; i++) {
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility * price;
    price += change;

    const dayVolatility = Math.random() * 0.3 + 0.85;
    const high = price * (1 + Math.random() * 0.01);
    const low = price * (1 - Math.random() * 0.01);
    volume = volume * dayVolatility;

    data.push({
      timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
      open: price - change,
      high,
      low,
      close: price,
      volume: Math.round(volume),
    });
  }

  return data;
}

export const fetchMarketData = async (symbol, timeframe = "1d", bars = 100) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!sampleData[symbol]) {
    throw new Error(`No data available for symbol: ${symbol}`);
  }

  return sampleData[symbol].slice(-bars);
};

export const getAvailableSymbols = () => {
  return Object.keys(sampleData);
};

export const subscribeToMarketData = (symbol, callback) => {
  // Simulate real-time updates
  const interval = setInterval(() => {
    const lastPrice = sampleData[symbol][sampleData[symbol].length - 1].close;
    const change = (Math.random() - 0.5) * 0.002 * lastPrice;
    const newPrice = lastPrice + change;

    const newData = {
      timestamp: new Date(),
      open: lastPrice,
      high: Math.max(lastPrice, newPrice),
      low: Math.min(lastPrice, newPrice),
      close: newPrice,
      volume: Math.round(1000000 * (0.8 + Math.random() * 0.4)),
    };

    sampleData[symbol].push(newData);
    sampleData[symbol].shift();

    callback(newData);
  }, 1000);

  return () => clearInterval(interval);
};

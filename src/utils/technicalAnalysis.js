import {
  SMA,
  EMA,
  RSI,
  MACD,
  BollingerBands,
  StochasticRSI,
  ADX,
  OBV,
  VWAP,
} from "technicalindicators";

// Helper to extract price data based on source field
const getPriceData = (data, source = "close") => {
  return data.map((candle) => candle[source]);
};

// Technical Indicator Calculations
export const calculateIndicator = (type, data, config) => {
  try {
    switch (type) {
      case "sma":
        return calculateSMA(data, config);
      case "ema":
        return calculateEMA(data, config);
      case "rsi":
        return calculateRSI(data, config);
      case "macd":
        return calculateMACD(data, config);
      case "bollinger":
        return calculateBollingerBands(data, config);
      case "stochastic":
        return calculateStochastic(data, config);
      case "adx":
        return calculateADX(data, config);
      case "obv":
        return calculateOBV(data, config);
      case "vwap":
        return calculateVWAP(data, config);
      default:
        throw new Error(`Unknown indicator type: ${type}`);
    }
  } catch (error) {
    console.error(`Error calculating ${type}:`, error);
    return null;
  }
};

// Individual indicator calculations
const calculateSMA = (data, { period = 14, source = "close" }) => {
  const values = getPriceData(data, source);
  return SMA.calculate({ period, values });
};

const calculateEMA = (data, { period = 14, source = "close" }) => {
  const values = getPriceData(data, source);
  return EMA.calculate({ period, values });
};

const calculateRSI = (data, { period = 14, source = "close" }) => {
  const values = getPriceData(data, source);
  return RSI.calculate({ period, values });
};

const calculateMACD = (
  data,
  { fastPeriod = 12, slowPeriod = 26, signalPeriod = 9, source = "close" }
) => {
  const values = getPriceData(data, source);
  return MACD.calculate({
    fastPeriod,
    slowPeriod,
    signalPeriod,
    values,
  });
};

const calculateBollingerBands = (
  data,
  { period = 20, stdDev = 2, source = "close" }
) => {
  const values = getPriceData(data, source);
  return BollingerBands.calculate({
    period,
    stdDev,
    values,
  });
};

const calculateStochastic = (
  data,
  { kPeriod = 14, dPeriod = 3, smooth = 3 }
) => {
  return StochasticRSI.calculate({
    high: data.map((d) => d.high),
    low: data.map((d) => d.low),
    close: data.map((d) => d.close),
    period: kPeriod,
    signalPeriod: dPeriod,
  });
};

const calculateADX = (data, { period = 14 }) => {
  return ADX.calculate({
    high: data.map((d) => d.high),
    low: data.map((d) => d.low),
    close: data.map((d) => d.close),
    period,
  });
};

const calculateOBV = (data) => {
  return OBV.calculate({
    close: data.map((d) => d.close),
    volume: data.map((d) => d.volume),
  });
};

const calculateVWAP = (data) => {
  return VWAP.calculate({
    high: data.map((d) => d.high),
    low: data.map((d) => d.low),
    close: data.map((d) => d.close),
    volume: data.map((d) => d.volume),
  });
};

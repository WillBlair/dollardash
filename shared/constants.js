export const GAME_DURATION = 60;
export const TICK_MS = 250;
export const STARTING_CASH = 10_000;
export const MAX_HISTORY = 200;

export const STOCKS = [
  { symbol: "BNNA", name: "Banana Inc.", color: "#FFD600", volatility: 0.025, drift: 0.001, basePrice: 42 },
  { symbol: "REKT", name: "RektCoin Ltd.", color: "#FF3D71", volatility: 0.06, drift: -0.002, basePrice: 7 },
  { symbol: "MOON", name: "MoonShot AI", color: "#00E5FF", volatility: 0.04, drift: 0.003, basePrice: 120 },
  { symbol: "SAFE", name: "SafeHaven Bonds", color: "#76FF03", volatility: 0.008, drift: 0.0005, basePrice: 95 },
];

export const BADGES = [
  { id: "first_trade", label: "First Trade", icon: "🏁", key: "totalTrades", min: 1 },
  { id: "profit", label: "In The Green", icon: "💚", key: "returnPct", min: 0.01 },
  { id: "double", label: "Doubled Up", icon: "🚀", key: "returnPct", min: 100 },
  { id: "diamond", label: "Diamond Hands", icon: "💎", key: "longestHold", min: 20 },
  { id: "trader", label: "Day Trader", icon: "📈", key: "totalTrades", min: 15 },
  { id: "diversified", label: "Diversified", icon: "🎯", key: "uniqueStocks", min: 3 },
  { id: "whale", label: "Whale", icon: "🐋", key: "biggestPosition", min: 5000 },
  { id: "rekt", label: "Got REKT", icon: "💀", key: "returnPct", max: -50 },
];

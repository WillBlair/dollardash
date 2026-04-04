export const GAME_DURATIONS = [
  { label: "1 MIN", seconds: 60 },
  { label: "3 MIN", seconds: 180 },
  { label: "5 MIN", seconds: 300 },
];

export const DEFAULT_DURATION = 60;
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
  { id: "first_trade", label: "First Trade", icon: "🏁", key: "totalTrades", min: 1, desc: "Execute your first trade", threshold: "1 trade" },
  { id: "profit", label: "In The Green", icon: "💚", key: "returnPct", min: 0.01, desc: "Finish with a positive return", threshold: "> 0% return" },
  { id: "double", label: "Doubled Up", icon: "🚀", key: "returnPct", min: 100, desc: "Double your starting cash", threshold: "+100% return" },
  { id: "diamond", label: "Diamond Hands", icon: "💎", key: "longestHold", min: 20, desc: "Hold a position through volatility", threshold: "Hold 20+ ticks" },
  { id: "trader", label: "Day Trader", icon: "📈", key: "totalTrades", min: 15, desc: "Trade at high frequency", threshold: "15+ trades" },
  { id: "diversified", label: "Diversified", icon: "🎯", key: "uniqueStocks", min: 3, desc: "Trade at least 3 different stocks", threshold: "3+ stocks traded" },
  { id: "whale", label: "Whale", icon: "🐋", key: "biggestPosition", min: 5000, desc: "Build a massive single position", threshold: "$5,000+ position" },
  { id: "rekt", label: "Got REKT", icon: "💀", key: "returnPct", max: -50, desc: "Lose more than half your money", threshold: "-50% return" },
];

export const TRADER_TITLES = [
  { minReturn: -Infinity, title: "INTERN", icon: "📋", color: "#666" },
  { minReturn: 0, title: "ANALYST", icon: "📊", color: "#aaa" },
  { minReturn: 5, title: "ASSOCIATE", icon: "💼", color: "#00E5FF" },
  { minReturn: 15, title: "VP", icon: "📈", color: "#76FF03" },
  { minReturn: 30, title: "DIRECTOR", icon: "🏦", color: "#FFD600" },
  { minReturn: 50, title: "MANAGING DIR.", icon: "👔", color: "#FF9100" },
  { minReturn: 100, title: "PARTNER", icon: "👑", color: "#FF3D71" },
];

export const NEWS_EVENTS = [
  { stockIdx: 0, headline: "Banana Inc. smashes earnings — revenue up 40%", sentiment: "bullish", driftMod: 0.035, durationSec: 8 },
  { stockIdx: 0, headline: "FDA approves high-potassium superfruit patent for BNNA", sentiment: "bullish", driftMod: 0.025, durationSec: 7 },
  { stockIdx: 0, headline: "Major banana blight hits South American supply chain", sentiment: "bearish", driftMod: -0.03, durationSec: 8 },
  { stockIdx: 0, headline: "BNNA CEO caught in accounting scandal", sentiment: "bearish", driftMod: -0.04, durationSec: 6 },
  { stockIdx: 0, headline: "Banana Inc. announces 3-for-1 stock split", sentiment: "bullish", driftMod: 0.02, durationSec: 6 },
  { stockIdx: 0, headline: "BNNA warehouse fire destroys 2M units of inventory", sentiment: "bearish", driftMod: -0.025, durationSec: 7 },

  { stockIdx: 1, headline: "RektCoin listed on major exchange — volume surges 500%", sentiment: "bullish", driftMod: 0.06, durationSec: 6 },
  { stockIdx: 1, headline: "Crypto whale dumps 10M REKT tokens in 30 minutes", sentiment: "bearish", driftMod: -0.07, durationSec: 5 },
  { stockIdx: 1, headline: "REKT partners with top gaming studio for NFT launch", sentiment: "bullish", driftMod: 0.04, durationSec: 7 },
  { stockIdx: 1, headline: "SEC investigation into RektCoin for securities fraud", sentiment: "bearish", driftMod: -0.08, durationSec: 6 },
  { stockIdx: 1, headline: "Celebrity influencer tweets 'REKT to the moon!'", sentiment: "bullish", driftMod: 0.05, durationSec: 5 },
  { stockIdx: 1, headline: "RektCoin smart contract exploit — $50M drained", sentiment: "bearish", driftMod: -0.09, durationSec: 5 },

  { stockIdx: 2, headline: "MoonShot AI lands $2B government defense contract", sentiment: "bullish", driftMod: 0.04, durationSec: 8 },
  { stockIdx: 2, headline: "MoonShot AI model outperforms GPT on all benchmarks", sentiment: "bullish", driftMod: 0.035, durationSec: 7 },
  { stockIdx: 2, headline: "Key engineer leaves MoonShot AI for competitor", sentiment: "bearish", driftMod: -0.025, durationSec: 6 },
  { stockIdx: 2, headline: "EU proposes strict AI regulation — MOON hit hardest", sentiment: "bearish", driftMod: -0.035, durationSec: 8 },
  { stockIdx: 2, headline: "MoonShot AI reveals humanoid robot prototype", sentiment: "bullish", driftMod: 0.03, durationSec: 7 },
  { stockIdx: 2, headline: "MOON data center outage takes services offline globally", sentiment: "bearish", driftMod: -0.04, durationSec: 6 },

  { stockIdx: 3, headline: "Federal Reserve signals rate cuts — bonds rally", sentiment: "bullish", driftMod: 0.015, durationSec: 10 },
  { stockIdx: 3, headline: "Inflation spikes to 9% — bond yields crater", sentiment: "bearish", driftMod: -0.012, durationSec: 10 },
  { stockIdx: 3, headline: "SafeHaven upgrades credit rating to AAA", sentiment: "bullish", driftMod: 0.01, durationSec: 8 },
  { stockIdx: 3, headline: "Treasury auction sees record low demand", sentiment: "bearish", driftMod: -0.01, durationSec: 8 },

  { stockIdx: -1, headline: "BREAKING: Major bank collapses — markets in panic", sentiment: "bearish", driftMod: -0.04, durationSec: 8 },
  { stockIdx: -1, headline: "Fed announces emergency stimulus package", sentiment: "bullish", driftMod: 0.03, durationSec: 8 },
  { stockIdx: -1, headline: "Trade war escalates — tariffs up 25% across the board", sentiment: "bearish", driftMod: -0.025, durationSec: 7 },
  { stockIdx: -1, headline: "Global peace deal signed — investor confidence soars", sentiment: "bullish", driftMod: 0.02, durationSec: 7 },
  { stockIdx: -1, headline: "Unemployment hits all-time low — economy booming", sentiment: "bullish", driftMod: 0.015, durationSec: 9 },
  { stockIdx: -1, headline: "Surprise CPI report: inflation out of control", sentiment: "bearish", driftMod: -0.02, durationSec: 8 },
];

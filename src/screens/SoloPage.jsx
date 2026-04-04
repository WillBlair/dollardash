import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { STOCKS, STARTING_CASH, GAME_DURATION, TICK_MS, MAX_HISTORY, BADGES } from "../../shared/constants.js";
import BigChart from "../components/BigChart.jsx";
import StockCard from "../components/StockCard.jsx";
import TradeControls from "../components/TradeControls.jsx";
import FlashMessage from "../components/FlashMessage.jsx";
import Timer from "../components/Timer.jsx";

function generatePrice(prev, stock) {
  const shock = (Math.random() - 0.5) * 2 * stock.volatility;
  const crash = Math.random() < 0.005 ? (Math.random() > 0.5 ? 0.12 : -0.12) : 0;
  const next = prev * (1 + shock + stock.drift + crash);
  return Math.max(0.01, parseFloat(next.toFixed(2)));
}

function getPortfolioValue(cash, holdings, prices) {
  let val = cash;
  for (const [idx, qty] of Object.entries(holdings)) {
    val += qty * prices[parseInt(idx)];
  }
  return val;
}

export default function SoloPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("menu"); // menu | playing | results
  const [cash, setCash] = useState(STARTING_CASH);
  const [holdings, setHoldings] = useState({});
  const [prices, setPrices] = useState(STOCKS.map((s) => s.basePrice));
  const [histories, setHistories] = useState(STOCKS.map((s) => [s.basePrice]));
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [selectedStock, setSelectedStock] = useState(0);
  const [flash, setFlash] = useState(null);
  const [stats, setStats] = useState(null);

  const gameRef = useRef({
    cash: STARTING_CASH,
    holdings: {},
    prices: STOCKS.map((s) => s.basePrice),
    trades: 0,
    uniqueStocks: new Set(),
    holdTicks: {},
    longestHold: 0,
    biggestPosition: 0,
  });
  const timerRef = useRef(null);
  const tickRef = useRef(null);

  const startGame = useCallback(() => {
    const initPrices = STOCKS.map((s) => s.basePrice);
    setCash(STARTING_CASH);
    setHoldings({});
    setPrices(initPrices);
    setHistories(STOCKS.map((s) => [s.basePrice]));
    setTimeLeft(GAME_DURATION);
    setSelectedStock(0);
    setFlash(null);
    setStats(null);
    gameRef.current = {
      cash: STARTING_CASH,
      holdings: {},
      prices: initPrices,
      trades: 0,
      uniqueStocks: new Set(),
      holdTicks: {},
      longestHold: 0,
      biggestPosition: 0,
    };
    setPhase("playing");
  }, []);

  const getPortfolioVal = useCallback(
    (c, h, p) => getPortfolioValue(c, h, p),
    [],
  );

  useEffect(() => {
    if (phase !== "playing") {
      clearInterval(timerRef.current);
      clearInterval(tickRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(tickRef.current);
          const g = gameRef.current;
          const fv = getPortfolioVal(g.cash, g.holdings, g.prices);
          const returnPct = ((fv - STARTING_CASH) / STARTING_CASH) * 100;
          const s = {
            finalValue: fv,
            totalTrades: g.trades,
            uniqueStocks: g.uniqueStocks.size,
            longestHold: g.longestHold,
            biggestPosition: g.biggestPosition,
            returnPct: parseFloat(returnPct.toFixed(1)),
          };
          setStats(s);
          setPhase("results");
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.4 },
            colors: ["#FFD600", "#76FF03", "#00E5FF", "#FF3D71"],
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    tickRef.current = setInterval(() => {
      setPrices((prev) => {
        const next = prev.map((p, i) => generatePrice(p, STOCKS[i]));
        gameRef.current.prices = next;
        return next;
      });
      setHistories((prev) =>
        prev.map((h, i) => {
          const newH = [...h, gameRef.current.prices[i]];
          return newH.length > MAX_HISTORY ? newH.slice(-MAX_HISTORY) : newH;
        }),
      );
      const g = gameRef.current;
      for (const idx of Object.keys(g.holdings)) {
        g.holdTicks[idx] = (g.holdTicks[idx] || 0) + 1;
        g.longestHold = Math.max(g.longestHold, g.holdTicks[idx]);
      }
    }, TICK_MS);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(tickRef.current);
    };
  }, [phase, getPortfolioVal]);

  const handleTrade = useCallback(
    ({ stockIdx, qty, type }) => {
      const g = gameRef.current;
      const price = prices[stockIdx];

      if (type === "buy") {
        const cost = price * qty;
        if (cost > cash) {
          showFlash("NOT ENOUGH CASH", "#FF3D71");
          return;
        }
        const newCash = cash - cost;
        const newHoldings = { ...holdings, [stockIdx]: (holdings[stockIdx] || 0) + qty };
        setCash(newCash);
        setHoldings(newHoldings);
        g.cash = newCash;
        g.holdings = newHoldings;
        g.trades++;
        g.uniqueStocks.add(stockIdx);
        const posVal = newHoldings[stockIdx] * price;
        g.biggestPosition = Math.max(g.biggestPosition, posVal);
        if (!g.holdTicks[stockIdx]) g.holdTicks[stockIdx] = 0;
        showFlash(`BOUGHT ${qty} ${STOCKS[stockIdx].symbol}`, "#76FF03");
      } else {
        const held = holdings[stockIdx] || 0;
        if (held < qty) {
          showFlash("NOT ENOUGH SHARES", "#FF3D71");
          return;
        }
        const revenue = price * qty;
        const newCash = cash + revenue;
        const newHoldings = { ...holdings };
        newHoldings[stockIdx] = held - qty;
        if (newHoldings[stockIdx] === 0) {
          delete newHoldings[stockIdx];
          delete g.holdTicks[stockIdx];
        }
        setCash(newCash);
        setHoldings(newHoldings);
        g.cash = newCash;
        g.holdings = newHoldings;
        g.trades++;
        showFlash(`SOLD ${qty} ${STOCKS[stockIdx].symbol}`, "#FFD600");
      }
    },
    [cash, holdings, prices],
  );

  const showFlash = (msg, color) => {
    setFlash({ msg, color });
    setTimeout(() => setFlash(null), 1200);
  };

  const portfolioValue = getPortfolioVal(cash, holdings, prices);
  const pnl = portfolioValue - STARTING_CASH;

  // ─── Menu ───────────────────────────────────────────────────
  if (phase === "menu") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div
          className="mb-2"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "clamp(20px, 5vw, 36px)",
            color: "#FFD600",
            lineHeight: 1.5,
            textShadow: "0 0 30px rgba(255,214,0,0.25)",
          }}
        >
          DOLLAR DASH
        </div>
        <div className="text-sm mb-1" style={{ fontFamily: "var(--font-pixel)", color: "#76FF03" }}>
          SOLO MODE
        </div>
        <div className="text-4xl my-3">💰📈</div>
        <div className="text-sm max-w-md leading-relaxed mb-6" style={{ color: "#aaa" }}>
          You have <span className="font-bold" style={{ color: "#76FF03" }}>$10,000</span> and{" "}
          <span className="font-bold" style={{ color: "#FF3D71" }}>60 seconds</span>.
          <br />
          Buy low. Sell high. Don't get REKT.
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {STOCKS.map((s) => (
            <div
              key={s.symbol}
              className="rounded-lg px-3 py-2 text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${s.color}33`,
                fontFamily: "var(--font-mono)",
              }}
            >
              <span className="font-bold" style={{ color: s.color }}>
                {s.symbol}
              </span>
              <span className="ml-2" style={{ color: "#666" }}>
                {s.volatility > 0.04 ? "🔥 High Risk" : s.volatility > 0.02 ? "⚡ Medium" : "🛡️ Safe"}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={startGame}
          className="rounded-xl py-4 px-12 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
          style={{
            fontFamily: "var(--font-pixel)",
            background: "#76FF03",
            color: "#0a0e1a",
            boxShadow: "0 0 30px rgba(118,255,3,0.25)",
          }}
        >
          START TRADING
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-xs border-none bg-transparent cursor-pointer"
          style={{ color: "#444" }}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  // ─── Playing ──────────────────────────────────────────────
  if (phase === "playing") {
    return (
      <div className="min-h-dvh flex flex-col px-3 py-3 gap-2.5 max-w-lg mx-auto">
        <FlashMessage message={flash?.msg} color={flash?.color} />

        <div className="flex justify-between items-center">
          <span
            className="text-xs tracking-wider"
            style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
          >
            DOLLAR DASH
          </span>
          <span className="font-bold text-sm" style={{ color: pnl >= 0 ? "#76FF03" : "#FF3D71" }}>
            P&L: {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
          </span>
        </div>

        <Timer timeLeft={timeLeft} total={GAME_DURATION} />

        <div
          className="flex justify-between items-center rounded-lg px-3 py-2 text-sm"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <span>
            💵 <b style={{ color: "#76FF03" }}>${cash.toFixed(2)}</b>
          </span>
          <span>
            📊 <b style={{ color: "#00E5FF" }}>${portfolioValue.toFixed(2)}</b>
          </span>
        </div>

        <BigChart histories={histories} selectedIdx={selectedStock} />

        <div className="grid grid-cols-2 gap-2">
          {STOCKS.map((stock, i) => (
            <StockCard
              key={stock.symbol}
              index={i}
              price={prices[i]}
              history={histories[i]}
              holdings={holdings[i] || 0}
              selected={selectedStock === i}
              onSelect={setSelectedStock}
            />
          ))}
        </div>

        <TradeControls
          selectedStock={selectedStock}
          price={prices[selectedStock]}
          cash={cash}
          onTrade={handleTrade}
          disabled={false}
        />
      </div>
    );
  }

  // ─── Results ──────────────────────────────────────────────
  if (phase === "results" && stats) {
    const grade =
      stats.finalValue >= STARTING_CASH * 2
        ? "S"
        : stats.finalValue >= STARTING_CASH * 1.5
          ? "A"
          : stats.finalValue >= STARTING_CASH * 1.2
            ? "B"
            : stats.finalValue >= STARTING_CASH
              ? "C"
              : stats.finalValue >= STARTING_CASH * 0.7
                ? "D"
                : "F";

    const gradeColor = {
      S: "#FFD600", A: "#76FF03", B: "#00E5FF", C: "#fff", D: "#FF9100", F: "#FF3D71",
    };

    const earned = BADGES.filter((b) => {
      if (b.min !== undefined) return stats[b.key] >= b.min;
      if (b.max !== undefined) return stats[b.key] <= b.max;
      return false;
    });

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div
          className="text-sm mb-2 tracking-widest"
          style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}
        >
          MARKET CLOSED
        </div>

        <div
          className="text-7xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-pixel)",
            color: gradeColor[grade],
            textShadow: `0 0 40px ${gradeColor[grade]}66`,
          }}
        >
          {grade}
        </div>

        <div
          className="text-2xl font-bold mb-6"
          style={{ color: stats.returnPct >= 0 ? "#76FF03" : "#FF3D71" }}
        >
          {stats.returnPct >= 0 ? "+" : ""}{stats.returnPct}% return
        </div>

        <div
          className="rounded-xl p-5 w-full max-w-xs mb-6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <span style={{ color: "#aaa" }}>Final Value</span>
            <span className="text-right font-bold">${stats.finalValue.toFixed(2)}</span>
            <span style={{ color: "#aaa" }}>Trades Made</span>
            <span className="text-right font-bold">{stats.totalTrades}</span>
            <span style={{ color: "#aaa" }}>Stocks Traded</span>
            <span className="text-right font-bold">{stats.uniqueStocks}/4</span>
          </div>
        </div>

        {earned.length > 0 && (
          <div className="mb-6">
            <div className="text-xs mb-2" style={{ fontFamily: "var(--font-pixel)", color: "#666" }}>
              BADGES EARNED
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {earned.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg px-3 py-1.5 text-sm"
                  style={{
                    background: "rgba(255,214,0,0.1)",
                    border: "1px solid rgba(255,214,0,0.2)",
                  }}
                >
                  {b.icon} {b.label}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="rounded-xl py-3 px-8 font-bold text-sm cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
            style={{
              fontFamily: "var(--font-pixel)",
              background: "#76FF03",
              color: "#0a0e1a",
            }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl py-3 px-8 font-bold text-sm cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
            style={{
              fontFamily: "var(--font-pixel)",
              background: "#FFD600",
              color: "#0a0e1a",
            }}
          >
            HOME
          </button>
        </div>
      </div>
    );
  }

  return null;
}

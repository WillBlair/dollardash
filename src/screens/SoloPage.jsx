import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { STOCKS, STARTING_CASH, DEFAULT_DURATION, TICK_MS, MAX_HISTORY, BADGES, TRADER_TITLES } from "../../shared/constants.js";
import { NewsEngine } from "../../shared/newsEngine.js";
import BigChart from "../components/BigChart.jsx";
import StockCard from "../components/StockCard.jsx";
import TradeControls from "../components/TradeControls.jsx";
import FlashMessage from "../components/FlashMessage.jsx";
import Timer from "../components/Timer.jsx";
import NewsTicker from "../components/NewsTicker.jsx";
import DurationPicker from "../components/DurationPicker.jsx";
import TitleBadge from "../components/TitleBadge.jsx";
import BadgeChip from "../components/BadgeChip.jsx";
import UrgencyOverlay from "../components/UrgencyOverlay.jsx";
import useSoundEngine from "../hooks/useSoundEngine.js";
import { useNewsAnnouncer } from "../hooks/useNewsAnnouncer.js";
import ArcadeTitle from "../components/ArcadeTitle.jsx";

function publicAsset(filename) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "";
  const name = filename.replace(/^\//, "");
  return base ? `${base}/${name}` : `/${name}`;
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
  const sound = useSoundEngine();
  const [phase, setPhase] = useState("menu");
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [cash, setCash] = useState(STARTING_CASH);
  const [holdings, setHoldings] = useState({});
  const [prices, setPrices] = useState(STOCKS.map((s) => s.basePrice));
  const [histories, setHistories] = useState(STOCKS.map((s) => [s.basePrice]));
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const [selectedStock, setSelectedStock] = useState(0);
  const [flash, setFlash] = useState(null);
  const [stats, setStats] = useState(null);
  const [newsEvents, setNewsEvents] = useState([]);
  useNewsAnnouncer(phase === "playing" ? newsEvents : [], phase === "playing");

  const gameRef = useRef(null);
  const newsRef = useRef(null);
  const timerRef = useRef(null);
  const tickRef = useRef(null);
  const durationRef = useRef(duration);
  const prevPricesRef = useRef(null);

  const startGame = useCallback(() => {
    sound.unlock();
    durationRef.current = duration;
    const initPrices = STOCKS.map((s) => s.basePrice);
    setCash(STARTING_CASH);
    setHoldings({});
    setPrices(initPrices);
    setHistories(STOCKS.map((s) => [s.basePrice]));
    setTimeLeft(duration);
    setSelectedStock(0);
    setFlash(null);
    setStats(null);
    setNewsEvents([]);
    newsRef.current = new NewsEngine();
    prevPricesRef.current = [...initPrices];
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
    sound.bell();
    sound.startAmbient();
  }, [duration, sound]);

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
          sound.stopAmbient();
          sound.bell();
          const g = gameRef.current;
          const fv = getPortfolioValue(g.cash, g.holdings, g.prices);
          const returnPct = ((fv - STARTING_CASH) / STARTING_CASH) * 100;
          setStats({
            finalValue: fv,
            totalTrades: g.trades,
            uniqueStocks: g.uniqueStocks.size,
            longestHold: g.longestHold,
            biggestPosition: g.biggestPosition,
            returnPct: parseFloat(returnPct.toFixed(1)),
          });
          setPhase("results");
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 }, colors: ["#FFD600", "#76FF03", "#00E5FF", "#FF3D71"] });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    tickRef.current = setInterval(() => {
      const engine = newsRef.current;
      const newEvent = engine.tick();

      setPrices((prev) => {
        const next = prev.map((p, i) => engine.generatePrice(p, i));
        gameRef.current.prices = next;

        // Detect big moves (>5% swing on any stock)
        if (prevPricesRef.current) {
          for (let i = 0; i < next.length; i++) {
            const pctChange = Math.abs((next[i] - prevPricesRef.current[i]) / prevPricesRef.current[i]);
            if (pctChange > 0.05) {
              sound.bigMove();
              break;
            }
          }
        }
        prevPricesRef.current = [...next];

        return next;
      });
      setHistories((prev) =>
        prev.map((h, i) => {
          const newH = [...h, gameRef.current.prices[i]];
          return newH.length > MAX_HISTORY ? newH.slice(-MAX_HISTORY) : newH;
        }),
      );

      if (newEvent) {
        setNewsEvents((prev) => [...prev.slice(-9), newEvent]);
        sound.news();
      }

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
  }, [phase, sound]);

  const handleTrade = useCallback(
    ({ stockIdx, qty, type }) => {
      const g = gameRef.current;
      const price = prices[stockIdx];

      if (type === "buy") {
        const cost = price * qty;
        if (cost > cash) { showFlash("NOT ENOUGH CASH", "#FF3D71"); sound.error(); return; }
        const newCash = cash - cost;
        const newHoldings = { ...holdings, [stockIdx]: (holdings[stockIdx] || 0) + qty };
        setCash(newCash); setHoldings(newHoldings);
        g.cash = newCash; g.holdings = newHoldings; g.trades++;
        g.uniqueStocks.add(stockIdx);
        g.biggestPosition = Math.max(g.biggestPosition, newHoldings[stockIdx] * price);
        if (!g.holdTicks[stockIdx]) g.holdTicks[stockIdx] = 0;
        showFlash(`BOUGHT ${qty} ${STOCKS[stockIdx].symbol}`, "#76FF03");
        sound.buy();
      } else {
        const held = holdings[stockIdx] || 0;
        if (held < qty) { showFlash("NOT ENOUGH SHARES", "#FF3D71"); sound.error(); return; }
        const newCash = cash + price * qty;
        const newHoldings = { ...holdings };
        newHoldings[stockIdx] = held - qty;
        if (newHoldings[stockIdx] === 0) { delete newHoldings[stockIdx]; delete g.holdTicks[stockIdx]; }
        setCash(newCash); setHoldings(newHoldings);
        g.cash = newCash; g.holdings = newHoldings; g.trades++;
        showFlash(`SOLD ${qty} ${STOCKS[stockIdx].symbol}`, "#FFD600");
        sound.sell();
      }
    },
    [cash, holdings, prices, sound],
  );

  const showFlash = (msg, color) => {
    setFlash({ msg, color });
    setTimeout(() => setFlash(null), 1200);
  };

  const portfolioValue = getPortfolioValue(cash, holdings, prices);
  const pnl = portfolioValue - STARTING_CASH;

  // ─── Menu — same hero shell as HomeScreen (no max-w-lg; chips full width, CTAs max-w-sm) ───
  if (phase === "menu") {
    return (
      <div className="relative isolate min-h-dvh">
        <div className="relative z-20">
          <section className="min-h-dvh flex flex-col px-6">
            <div
              className="flex-1 flex flex-col items-center justify-center text-center min-h-0
                pt-[clamp(3rem,12vh,6rem)] pb-4"
            >
              <h1 className="mb-2 mt-0 text-center font-normal">
                <ArcadeTitle>DOLLAR DASH</ArcadeTitle>
              </h1>
              <div
                className="text-[10px] sm:text-xs mb-1 tracking-widest -mt-1"
                style={{ fontFamily: "var(--font-pixel)", color: "#76FF03" }}
              >
                SOLO MODE
              </div>

              <div className="flex items-end justify-center gap-1.5 my-1.5">
                <span className="text-base select-none opacity-90 pb-0.5" aria-hidden>💰</span>
                <img
                  src={publicAsset("rocket-to-the-moon.gif")}
                  alt=""
                  width={30}
                  height={30}
                  className="shrink-0 w-auto"
                  style={{
                    width: "30px",
                    maxWidth: "30px",
                    height: "auto",
                    imageRendering: "pixelated",
                    filter: "drop-shadow(0 0 4px rgba(255,214,0,0.18))",
                  }}
                  decoding="async"
                />
                <span className="text-base select-none opacity-90 pb-0.5" aria-hidden>💸</span>
              </div>

              <p className="text-sm max-w-md leading-relaxed mb-6" style={{ color: "#aaa" }}>
                You have <span className="font-bold" style={{ color: "#76FF03" }}>$10,000</span>.
                <br />
                Watch the news. React fast. Don’t get REKT.
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-8 w-full">
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
                    <span className="font-bold" style={{ color: s.color }}>{s.symbol}</span>
                    <span className="ml-2" style={{ color: "#555" }}>
                      {s.volatility > 0.04 ? "⚡ Volatile" : s.volatility > 0.02 ? "⚡ Medium" : "🛡️ Steady"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 w-full max-w-sm">
                <DurationPicker value={duration} onChange={setDuration} />
                <button
                  onClick={startGame}
                  className="w-full rounded-xl py-4 px-6 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
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
                  className="text-xs border-none bg-transparent cursor-pointer py-2"
                  style={{ color: "#444" }}
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ─── Playing ──────────────────────────────────────────────
  if (phase === "playing") {
    return (
      <div
        className="h-dvh max-h-dvh overflow-hidden flex flex-col px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] max-lg:gap-1.5 gap-2 lg:px-6 lg:pt-3 max-w-6xl mx-auto min-h-0 box-border"
      >
        <UrgencyOverlay timeLeft={timeLeft} />
        <FlashMessage message={flash?.msg} color={flash?.color} />

        <div className="shrink-0 flex flex-col max-lg:gap-1 gap-1.5">
          <div className="flex justify-between items-center gap-2 flex-wrap min-h-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="text-[10px] lg:text-xs tracking-wider truncate"
                style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
              >
                DOLLAR DASH
              </span>
              <TitleBadge portfolioValue={portfolioValue} />
            </div>
          </div>
          <Timer timeLeft={timeLeft} total={durationRef.current} />
        </div>

        <div
          className="shrink-0 flex justify-between items-end rounded-lg lg:rounded-xl px-3 py-2 lg:px-5 lg:py-4"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div>
            <div
              className="text-[9px] lg:text-[10px] tracking-wider mb-0.5 lg:mb-1"
              style={{ fontFamily: "var(--font-pixel)", color: "#666" }}
            >
              CASH
            </div>
            <div
              className="text-lg lg:text-2xl xl:text-3xl font-bold tabular-nums leading-tight"
              style={{ color: "#76FF03", fontFamily: "var(--font-mono)" }}
            >
              ${cash.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-[9px] lg:text-[10px] tracking-wider mb-0.5 lg:mb-1"
              style={{ fontFamily: "var(--font-pixel)", color: "#666" }}
            >
              P&L
            </div>
            <div
              className="text-lg lg:text-2xl xl:text-3xl font-bold tabular-nums leading-tight"
              style={{ color: pnl >= 0 ? "#76FF03" : "#FF3D71", fontFamily: "var(--font-mono)" }}
            >
              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-2 lg:gap-3 min-h-0">
          <div className="flex-1 min-h-0 flex flex-col gap-1.5 lg:gap-2 min-w-0 overflow-y-auto lg:overflow-visible">
            <BigChart histories={histories} selectedIdx={selectedStock} />

            <div className="grid grid-cols-2 gap-1.5 lg:gap-2 shrink-0">
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

            <div className="shrink-0 pb-0.5">
              <TradeControls
                selectedStock={selectedStock}
                price={prices[selectedStock]}
                cash={cash}
                heldQty={holdings[selectedStock] || 0}
                onTrade={handleTrade}
                disabled={false}
              />
            </div>
          </div>

          <div className="shrink-0 flex flex-col min-h-0 min-w-0 max-h-[min(22dvh,11rem)] lg:max-h-none lg:w-80 xl:w-96 lg:shrink-0">
            <NewsTicker events={newsEvents} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Results ──────────────────────────────────────────────
  if (phase === "results" && stats) {
    let traderTitle = TRADER_TITLES[0];
    for (const t of TRADER_TITLES) {
      if (stats.returnPct >= t.minReturn) traderTitle = t;
    }
    const earned = BADGES.filter((b) => {
      if (b.min !== undefined) return stats[b.key] >= b.min;
      if (b.max !== undefined) return stats[b.key] <= b.max;
      return false;
    });

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-sm mb-2 tracking-widest" style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}>
          MARKET CLOSED
        </div>
        <div className="text-5xl mb-1">{traderTitle.icon}</div>
        <div
          className="text-3xl sm:text-4xl font-bold mb-1"
          style={{ fontFamily: "var(--font-pixel)", color: traderTitle.color, textShadow: `0 0 40px ${traderTitle.color}66` }}
        >
          {traderTitle.title}
        </div>
        <div className="text-xs mb-4 tracking-wider" style={{ fontFamily: "var(--font-pixel)", color: "#555" }}>
          FINAL RANK
        </div>
        <div className="text-2xl font-bold mb-6" style={{ color: stats.returnPct >= 0 ? "#76FF03" : "#FF3D71" }}>
          {stats.returnPct >= 0 ? "+" : ""}{stats.returnPct}% return
        </div>
        <div className="rounded-xl p-5 w-full max-w-xs mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
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
            <div className="text-xs mb-2" style={{ fontFamily: "var(--font-pixel)", color: "#666" }}>BADGES EARNED</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {earned.map((b) => (
                <BadgeChip key={b.id} badge={b} />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={startGame} className="rounded-xl py-3 px-8 font-bold text-sm cursor-pointer border-none tracking-wider transition-transform hover:scale-105" style={{ fontFamily: "var(--font-pixel)", background: "#76FF03", color: "#0a0e1a" }}>PLAY AGAIN</button>
          <button onClick={() => navigate("/")} className="rounded-xl py-3 px-8 font-bold text-sm cursor-pointer border-none tracking-wider transition-transform hover:scale-105" style={{ fontFamily: "var(--font-pixel)", background: "#FFD600", color: "#0a0e1a" }}>HOME</button>
        </div>
      </div>
    );
  }

  return null;
}

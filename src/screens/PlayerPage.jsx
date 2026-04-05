import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useSocket } from "../hooks/useSocket.js";
import { STOCKS, STARTING_CASH, DEFAULT_DURATION, BADGES, TRADER_TITLES } from "../../shared/constants.js";
import BadgeChip from "../components/BadgeChip.jsx";
import StockCard from "../components/StockCard.jsx";
import TradeControls from "../components/TradeControls.jsx";
import FlashMessage from "../components/FlashMessage.jsx";
import Timer from "../components/Timer.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import NewsTicker from "../components/NewsTicker.jsx";
import TitleBadge from "../components/TitleBadge.jsx";
import UrgencyOverlay from "../components/UrgencyOverlay.jsx";
import useSoundEngine from "../hooks/useSoundEngine.js";
import { useNewsAnnouncer } from "../hooks/useNewsAnnouncer.js";

export default function PlayerPage() {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const sound = useSoundEngine();

  const [phase, setPhase] = useState("join");
  const [roomCode, setRoomCode] = useState(urlCode?.toUpperCase() || "");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [joinedCode, setJoinedCode] = useState("");

  const [market, setMarket] = useState(null);
  const [cash, setCash] = useState(STARTING_CASH);
  const [holdings, setHoldings] = useState({});
  const [portfolioValue, setPortfolioValue] = useState(STARTING_CASH);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedStock, setSelectedStock] = useState(0);
  const [flash, setFlash] = useState(null);
  const [results, setResults] = useState(null);
  const [myResult, setMyResult] = useState(null);
  const [newsEvents, setNewsEvents] = useState([]);

  useNewsAnnouncer(phase === "playing" ? newsEvents : [], phase === "playing");

  useEffect(() => {
    if (!socket) return;

    socket.on("game:start", ({ duration: d }) => {
      setPhase("playing");
      setCash(STARTING_CASH);
      setHoldings({});
      setPortfolioValue(STARTING_CASH);
      if (d) { setDuration(d); setTimeLeft(d); }
      sound.bell();
      sound.startAmbient();
    });

    socket.on("game:tick", (data) => {
      setMarket({ prices: data.prices, histories: data.histories, timeLeft: data.timeLeft });
      setLeaderboard(data.leaderboard);
      const me = data.leaderboard.find((e) => e.id === socket.id);
      if (me) setPortfolioValue(me.value);
    });

    socket.on("game:news", (event) => {
      setNewsEvents((prev) => [...prev.slice(-9), event]);
      sound.news();
    });

    socket.on("game:timer", ({ timeLeft: t }) => setTimeLeft(t));

    socket.on("game:end", ({ results: r }) => {
      setResults(r);
      const me = r.find((e) => e.id === socket.id);
      setMyResult(me);
      setPhase("results");
      sound.stopAmbient();
      sound.bell();
      if (me?.rank === 1) {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.4 }, colors: ["#FFD600", "#76FF03", "#00E5FF"] });
      }
    });

    socket.on("player:kicked", () => {
      setPhase("join");
      setError("You were kicked from the room");
      sound.stopAmbient();
    });

    socket.on("room:closed", () => {
      setPhase("join");
      setError("Host disconnected. Room closed.");
      sound.stopAmbient();
    });

    return () => {
      socket.off("game:start");
      socket.off("game:tick");
      socket.off("game:news");
      socket.off("game:timer");
      socket.off("game:end");
      socket.off("player:kicked");
      socket.off("room:closed");
    };
  }, [socket, sound]);

  const joinGame = useCallback(() => {
    sound.unlock();
    if (!socket || !connected) return;
    const code = roomCode.trim().toUpperCase();
    const name = playerName.trim();
    if (!code || !name) { setError("Enter a room code and your name"); return; }
    setError("");
    socket.emit("player:join", { code, name }, (res) => {
      if (res.ok) { setJoinedCode(res.roomCode); setPhase("lobby"); }
      else setError(res.error);
    });
  }, [socket, connected, roomCode, playerName, sound]);

  const handleTrade = useCallback(
    ({ stockIdx, qty, type }) => {
      if (!socket) return;
      socket.emit("player:trade", { stockIdx, qty, type }, (res) => {
        if (res.ok) {
          setCash(res.cash);
          setHoldings(res.holdings || {});
          setPortfolioValue(res.portfolioValue);
          const color = type === "buy" ? "#76FF03" : "#FFD600";
          showFlash(`${type === "buy" ? "BOUGHT" : "SOLD"} ${qty} ${res.symbol}`, color);
          if (type === "buy") sound.buy();
          else sound.sell();
        } else {
          showFlash(res.error || "Trade failed", "#FF3D71");
          sound.error();
        }
      });
    },
    [socket, sound],
  );

  const showFlash = (msg, color) => {
    setFlash({ msg, color });
    setTimeout(() => setFlash(null), 1200);
  };

  const pnl = portfolioValue - STARTING_CASH;

  // ─── Join Screen ──────────────────────────────────────────
  if (phase === "join") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
        <div className="text-lg mb-8 tracking-widest" style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}>
          JOIN GAME
        </div>
        <div className="w-full max-w-xs flex flex-col gap-4">
          <div>
            <label className="text-xs block mb-1" style={{ color: "#aaa" }}>ROOM CODE</label>
            <input
              type="text" value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="ABCD" maxLength={4}
              className="w-full rounded-lg px-4 py-3 text-2xl text-center font-bold tracking-[0.3em] border-2 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#FFD600", fontFamily: "var(--font-pixel)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs block mb-1" style={{ color: "#aaa" }}>YOUR NAME</label>
            <input
              type="text" value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
              placeholder="Enter your name" maxLength={20}
              className="w-full rounded-lg px-4 py-3 text-base font-semibold border-2 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--font-mono)" }}
              onKeyDown={(e) => e.key === "Enter" && joinGame()}
            />
          </div>
          {error && (
            <div className="text-sm text-center py-2 rounded-lg" style={{ color: "#FF3D71", background: "rgba(255,61,113,0.1)" }}>{error}</div>
          )}
          <button
            onClick={joinGame} disabled={!connected}
            className="w-full rounded-xl py-4 font-bold text-base cursor-pointer border-none tracking-wider transition-transform hover:scale-105 disabled:opacity-40"
            style={{ fontFamily: "var(--font-pixel)", background: "#76FF03", color: "#0a0e1a" }}
          >
            {connected ? "JOIN" : "CONNECTING..."}
          </button>
        </div>
        <button onClick={() => navigate("/")} className="mt-8 text-xs border-none bg-transparent cursor-pointer" style={{ color: "#444" }}>
          ← Back to home
        </button>
      </div>
    );
  }

  // ─── Lobby ──────────────────────────────────────
  if (phase === "lobby") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <div className="text-base mb-2" style={{ fontFamily: "var(--font-pixel)", color: "#76FF03" }}>YOU'RE IN!</div>
        <div className="text-sm mb-2" style={{ color: "#aaa" }}>
          Room <span className="font-bold" style={{ color: "#FFD600" }}>{joinedCode}</span>
        </div>
        <div className="text-sm" style={{ color: "#666" }}>Waiting for the host to start the game...</div>
        <div className="mt-8">
          <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#FFD600 transparent #FFD600 transparent" }} />
        </div>
      </div>
    );
  }

  // ─── Playing ──────────────────────────────────────────────
  if (phase === "playing") {
    const prices = market?.prices || STOCKS.map((s) => s.basePrice);
    const histories = market?.histories || STOCKS.map((s) => [s.basePrice]);

    return (
      <div
        className="h-dvh max-h-dvh overflow-hidden flex flex-col px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] max-lg:gap-1.5 gap-2 max-w-6xl mx-auto min-h-0 box-border lg:pt-3"
      >
        <UrgencyOverlay timeLeft={timeLeft} />
        <FlashMessage message={flash?.msg} color={flash?.color} />

        <div className="shrink-0 flex flex-col max-lg:gap-1 gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[10px] lg:text-xs tracking-wider truncate"
              style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
            >
              TRADING
            </span>
            <TitleBadge portfolioValue={portfolioValue} />
          </div>
          <Timer timeLeft={timeLeft} total={duration} />
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

            {leaderboard.length > 0 && (
              <div className="shrink-0 max-lg:max-h-[5rem] max-lg:overflow-y-auto lg:max-h-none">
                <div className="text-[10px] lg:text-xs mb-0.5 lg:mb-1" style={{ fontFamily: "var(--font-pixel)", color: "#666" }}>
                  STANDINGS
                </div>
                <Leaderboard entries={leaderboard.slice(0, 5)} highlightId={socket?.id} compact />
              </div>
            )}

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
  if (phase === "results" && myResult) {
    let traderTitle = TRADER_TITLES[0];
    for (const t of TRADER_TITLES) {
      if (myResult.returnPct >= t.minReturn) traderTitle = t;
    }

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
        <div className="text-lg font-bold mb-1" style={{ color: "#aaa" }}>
          #{myResult.rank} of {results.length}
        </div>
        <div className="text-2xl font-bold mb-6" style={{ color: myResult.returnPct >= 0 ? "#76FF03" : "#FF3D71" }}>
          {myResult.returnPct >= 0 ? "+" : ""}{myResult.returnPct}% return
        </div>
        <div className="rounded-xl p-5 w-full max-w-xs mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "#aaa" }}>Final Value</span>
            <span className="font-bold">${myResult.value?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#aaa" }}>Trades</span>
            <span className="font-bold">{myResult.trades}</span>
          </div>
        </div>
        {myResult.badges?.length > 0 && (
          <div className="mb-6">
            <div className="text-xs mb-2" style={{ fontFamily: "var(--font-pixel)", color: "#666" }}>BADGES</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {myResult.badges.map((b) => {
                const full = BADGES.find((x) => x.id === b.id) || b;
                return <BadgeChip key={b.id} badge={{ ...b, desc: full.desc, threshold: full.threshold }} />;
              })}
            </div>
          </div>
        )}
        <div className="w-full max-w-sm mb-6">
          <Leaderboard entries={results} highlightId={socket?.id} compact />
        </div>
        <button
          onClick={() => { setPhase("join"); setRoomCode(""); setPlayerName(""); navigate("/play"); }}
          className="rounded-xl py-3 px-8 font-bold text-sm cursor-pointer border-none tracking-wider"
          style={{ fontFamily: "var(--font-pixel)", background: "#FFD600", color: "#0a0e1a" }}
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }

  return null;
}

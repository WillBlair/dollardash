import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { useSocket } from "../hooks/useSocket.js";
import { STOCKS, STARTING_CASH, GAME_DURATION } from "../../shared/constants.js";
import BigChart from "../components/BigChart.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import Timer from "../components/Timer.jsx";
import NewsTicker from "../components/NewsTicker.jsx";

export default function HostPage() {
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("creating"); // creating | lobby | playing | results
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [market, setMarket] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [results, setResults] = useState(null);
  const [selectedStock, setSelectedStock] = useState(0);
  const [newsEvents, setNewsEvents] = useState([]);

  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/play/${roomCode}` : "";

  useEffect(() => {
    if (!socket || !connected) return;

    socket.emit("host:create", (res) => {
      if (res.ok) {
        setRoomCode(res.code);
        setPhase("lobby");
      }
    });

    socket.on("lobby:update", ({ players: p }) => setPlayers(p));

    socket.on("game:start", ({ market: m }) => {
      setMarket(m);
      setPhase("playing");
    });

    socket.on("game:tick", (data) => {
      setMarket({ prices: data.prices, histories: data.histories, timeLeft: data.timeLeft });
      setLeaderboard(data.leaderboard);
      if (data.news?.recentEvents) {
        setNewsEvents(data.news.recentEvents);
      }
    });

    socket.on("game:news", (event) => {
      setNewsEvents((prev) => [...prev.slice(-9), event]);
    });

    socket.on("game:timer", ({ timeLeft: t }) => setTimeLeft(t));

    socket.on("game:end", ({ results: r }) => {
      setResults(r);
      setPhase("results");
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.3 },
        colors: ["#FFD600", "#76FF03", "#00E5FF", "#FF3D71"],
      });
    });

    return () => {
      socket.off("lobby:update");
      socket.off("game:start");
      socket.off("game:tick");
      socket.off("game:news");
      socket.off("game:timer");
      socket.off("game:end");
    };
  }, [socket, connected]);

  const startGame = useCallback(() => {
    if (!socket) return;
    socket.emit("host:start", (res) => {
      if (!res.ok) alert(res.error);
    });
  }, [socket]);

  const kickPlayer = useCallback(
    (playerId) => {
      if (!socket) return;
      socket.emit("host:kick", { playerId }, () => {});
    },
    [socket],
  );

  // ─── Lobby ────────────────────────────────────────────────
  if (phase === "creating" || phase === "lobby") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
        {phase === "creating" ? (
          <div style={{ color: "#aaa" }}>Creating room...</div>
        ) : (
          <>
            <div
              className="text-sm mb-2 tracking-widest"
              style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}
            >
              ROOM CODE
            </div>
            <div
              className="text-6xl sm:text-8xl font-bold mb-6 tracking-[0.2em] animate-pulse-border border-4 rounded-2xl px-8 py-4"
              style={{
                fontFamily: "var(--font-pixel)",
                color: "#FFD600",
                textShadow: "0 0 40px rgba(255,214,0,0.3)",
                borderColor: "rgba(255,214,0,0.3)",
              }}
            >
              {roomCode}
            </div>

            <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <QRCodeSVG value={joinUrl} size={160} bgColor="transparent" fgColor="#ffffff" />
              <div className="text-xs mt-2" style={{ color: "#666" }}>
                Scan to join
              </div>
            </div>

            <div className="text-xs mb-2" style={{ color: "#666" }}>
              {joinUrl}
            </div>

            <div className="mb-6 w-full max-w-md">
              <div className="text-sm mb-3" style={{ color: "#aaa" }}>
                Players ({players.length})
              </div>
              {players.length === 0 ? (
                <div className="text-sm py-4" style={{ color: "#444" }}>
                  Waiting for players to join...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  {players.map((p, i) => (
                    <div
                      key={p.id}
                      className="animate-slide-up rounded-lg px-4 py-2 flex items-center gap-2"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    >
                      <span className="font-semibold text-sm">{p.name}</span>
                      <button
                        onClick={() => kickPlayer(p.id)}
                        className="text-xs cursor-pointer border-none bg-transparent"
                        style={{ color: "#FF3D71" }}
                        title="Kick player"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              disabled={players.length === 0}
              className="rounded-xl py-4 px-12 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-pixel)",
                background: "#76FF03",
                color: "#0a0e1a",
                boxShadow: players.length > 0 ? "0 0 30px rgba(118,255,3,0.25)" : "none",
              }}
            >
              START GAME
            </button>
          </>
        )}
      </div>
    );
  }

  // ─── Playing ──────────────────────────────────────────────
  if (phase === "playing") {
    return (
      <div className="min-h-dvh flex flex-col px-4 py-3 gap-3 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div
            className="text-sm tracking-widest"
            style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
          >
            DOLLAR DASH
          </div>
          <div className="text-xs px-3 py-1 rounded-md" style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600" }}>
            ROOM: {roomCode}
          </div>
        </div>

        <Timer timeLeft={timeLeft} total={GAME_DURATION} />

        {/* News Ticker */}
        <NewsTicker events={newsEvents} />

        {/* Main content: chart + leaderboard side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1">
          <div className="flex-1 flex flex-col gap-3">
            <BigChart
              histories={market?.histories}
              selectedIdx={selectedStock}
            />
            {/* Stock tabs */}
            <div className="flex gap-2">
              {STOCKS.map((stock, i) => {
                const price = market?.prices?.[i];
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(i)}
                    className="flex-1 rounded-lg px-3 py-2 cursor-pointer border-2 transition-all text-center"
                    style={{
                      background: selectedStock === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                      borderColor: selectedStock === i ? stock.color : "transparent",
                    }}
                  >
                    <div className="font-bold text-xs" style={{ color: stock.color }}>
                      {stock.symbol}
                    </div>
                    <div className="font-bold text-sm">${price?.toFixed(2)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:w-80 shrink-0">
            <div
              className="text-xs mb-2 tracking-widest"
              style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}
            >
              LEADERBOARD
            </div>
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Results ──────────────────────────────────────────────
  if (phase === "results" && results) {
    const winner = results[0];
    const gradeColor = {
      S: "#FFD600", A: "#76FF03", B: "#00E5FF", C: "#fff", D: "#FF9100", F: "#FF3D71",
    };

    return (
      <div className="min-h-dvh flex flex-col items-center px-6 py-12">
        <div
          className="text-sm tracking-widest mb-4"
          style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}
        >
          MARKET CLOSED
        </div>

        {winner && (
          <div className="text-center mb-8 animate-slide-up">
            <div className="text-5xl mb-2">👑</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
            >
              {winner.name}
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: winner.returnPct >= 0 ? "#76FF03" : "#FF3D71" }}
            >
              {winner.returnPct >= 0 ? "+" : ""}{winner.returnPct}% return
            </div>
            <div className="text-sm mt-1" style={{ color: "#aaa" }}>
              ${winner.value?.toLocaleString()}
            </div>
          </div>
        )}

        <div className="w-full max-w-lg mb-8">
          <div
            className="text-xs mb-3 tracking-widest"
            style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}
          >
            FINAL RANKINGS
          </div>
          {results.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 animate-slide-up"
              style={{
                background: i === 0 ? "rgba(255,214,0,0.1)" : "rgba(255,255,255,0.04)",
                border: i === 0 ? "1px solid rgba(255,214,0,0.3)" : "1px solid transparent",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <span className="text-lg w-8 text-center">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${r.rank}`}
              </span>
              <span className="flex-1 font-semibold">{r.name}</span>
              <span
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-pixel)", color: gradeColor[r.grade] || "#fff" }}
              >
                {r.grade}
              </span>
              <span
                className="font-bold text-sm w-16 text-right"
                style={{ color: r.returnPct >= 0 ? "#76FF03" : "#FF3D71" }}
              >
                {r.returnPct >= 0 ? "+" : ""}{r.returnPct}%
              </span>
            </div>
          ))}
        </div>

        {/* Badges for winner */}
        {winner?.badges?.length > 0 && (
          <div className="mb-8 text-center">
            <div className="text-xs mb-2" style={{ fontFamily: "var(--font-pixel)", color: "#666" }}>
              WINNER BADGES
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {winner.badges.map((b) => (
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

        <button
          onClick={() => navigate("/")}
          className="rounded-xl py-3 px-8 font-bold text-sm cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
          style={{
            fontFamily: "var(--font-pixel)",
            background: "#FFD600",
            color: "#0a0e1a",
          }}
        >
          NEW GAME
        </button>
      </div>
    );
  }

  return null;
}

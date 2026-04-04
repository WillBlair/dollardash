import { useNavigate } from "react-router-dom";
import { STOCKS } from "../../shared/constants.js";

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 text-center">
      <div
        className="mb-2"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "clamp(24px, 6vw, 48px)",
          color: "#FFD600",
          lineHeight: 1.4,
          textShadow: "0 0 40px rgba(255,214,0,0.25)",
        }}
      >
        DOLLAR DASH
      </div>

      <div className="text-4xl my-3">💰📈💸</div>

      <p className="text-sm max-w-md leading-relaxed mb-6" style={{ color: "#aaa" }}>
        A real-time stock trading game.
        <br />
        Play solo or compete with friends. Highest portfolio wins.
      </p>

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

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={() => navigate("/solo")}
          className="w-full rounded-xl py-4 px-6 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
          style={{
            fontFamily: "var(--font-pixel)",
            background: "#76FF03",
            color: "#0a0e1a",
            boxShadow: "0 0 30px rgba(118,255,3,0.25)",
          }}
        >
          SOLO PLAY
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/host")}
            className="flex-1 rounded-xl py-4 px-6 font-bold text-base cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
            style={{
              fontFamily: "var(--font-pixel)",
              background: "#FFD600",
              color: "#0a0e1a",
              boxShadow: "0 0 30px rgba(255,214,0,0.25)",
            }}
          >
            HOST
          </button>
          <button
            onClick={() => navigate("/play")}
            className="flex-1 rounded-xl py-4 px-6 font-bold text-base cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
            style={{
              fontFamily: "var(--font-pixel)",
              background: "#00E5FF",
              color: "#0a0e1a",
              boxShadow: "0 0 30px rgba(0,229,255,0.25)",
            }}
          >
            JOIN
          </button>
        </div>
      </div>

      <p className="text-xs mt-8" style={{ color: "#444" }}>
        Solo mode works offline. Multiplayer needs a server.
      </p>
    </div>
  );
}

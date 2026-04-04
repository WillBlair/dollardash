import { useNavigate } from "react-router-dom";
import { STOCKS } from "../../shared/constants.js";

const STEPS = [
  { num: "1", icon: "📰", title: "Watch the News", desc: "Headlines move prices. Bullish news pushes stocks up, bearish drags them down." },
  { num: "2", icon: "💰", title: "Buy & Sell", desc: "Tap a stock, pick a quantity, and trade. You start with $10,000 in cash." },
  { num: "3", icon: "📈", title: "Grow Your Portfolio", desc: "Buy low, sell high. Your total portfolio value is cash + holdings." },
  { num: "4", icon: "🏆", title: "Beat the Clock", desc: "When time runs out, highest portfolio wins. Earn badges along the way." },
];

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start max-w-5xl w-full">

        {/* Left — branding + CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div
            className="mb-2"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(28px, 6vw, 52px)",
              color: "#FFD600",
              lineHeight: 1.3,
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

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
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
                <span className="ml-2" style={{ color: "#555" }}>
                  {s.volatility > 0.04 ? "⚡ Volatile" : s.volatility > 0.02 ? "⚡ Medium" : "🛡️ Steady"}
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

          <p className="text-xs mt-6" style={{ color: "#444" }}>
            Solo mode works offline. Multiplayer needs a server.
          </p>
        </div>

        {/* Right — How to Play */}
        <div
          className="w-full lg:w-80 xl:w-96 shrink-0 rounded-2xl px-6 py-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="text-xs tracking-widest mb-5"
            style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
          >
            HOW TO PLAY
          </div>

          <div className="flex flex-col gap-5">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-3">
                <div
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{
                    background: "rgba(255,214,0,0.08)",
                    border: "1px solid rgba(255,214,0,0.15)",
                    fontFamily: "var(--font-pixel)",
                    color: "#FFD600",
                    fontSize: 12,
                  }}
                >
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{step.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: "#ddd" }}>
                      {step.title}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#777" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 pt-4 text-xs leading-relaxed"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#555" }}
          >
            <span style={{ color: "#76FF03" }}>TIP:</span> Read the news feed — it tells you which stocks are about to move and in which direction.
          </div>
        </div>
      </div>
    </div>
  );
}

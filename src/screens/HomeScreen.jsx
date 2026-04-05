import { useNavigate } from "react-router-dom";
import { STOCKS } from "../../shared/constants.js";
import ArcadeTitle from "../components/ArcadeTitle.jsx";

const STEPS = [
  { num: "1", icon: "📰", title: "Watch the News", desc: "Headlines move prices. Bullish news pushes stocks up, bearish drags them down." },
  { num: "2", icon: "💰", title: "Buy & Sell", desc: "Tap a stock, pick a quantity, and trade. You start with $10,000 in cash." },
  { num: "3", icon: "📈", title: "Grow Your Portfolio", desc: "Buy low, sell high. Your total portfolio value is cash + holdings." },
  { num: "4", icon: "🏆", title: "Beat the Clock", desc: "When time runs out, highest portfolio wins. Earn badges along the way." },
];

/** Public folder URL (correct when app is hosted under a subpath). */
function publicAsset(filename) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "";
  const name = filename.replace(/^\//, "");
  return base ? `${base}/${name}` : `/${name}`;
}

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative isolate min-h-dvh">
      <img
        src={publicAsset("moneyflynobackground.gif")}
        alt=""
        className="home-money-fly"
        width={36}
        height={36}
        decoding="async"
        loading="eager"
      />
      <img
        src={publicAsset("breifcasenobg.gif")}
        alt=""
        className="home-briefcase-fly"
        width={36}
        height={36}
        decoding="async"
        loading="eager"
      />
      <img
        src={publicAsset("coffee.gif")}
        alt=""
        className="home-coffee-fly"
        width={36}
        height={36}
        decoding="async"
        loading="eager"
      />
      <img
        src={publicAsset("coinnobg.gif")}
        alt=""
        className="home-coin-fly"
        width={122}
        height={122}
        decoding="async"
        loading="eager"
      />
      <div className="relative z-20">
        {/* First viewport: hero vertically centered (shifted down), “HOW TO PLAY” only at bottom */}
        <section className="min-h-dvh flex flex-col px-6">
          <div
            className="flex-1 flex flex-col items-center justify-center text-center min-h-0
              pt-[clamp(3rem,12vh,6rem)] pb-4"
          >
            <h1 className="mb-2 mt-0 text-center font-normal">
              <ArcadeTitle>DOLLAR DASH</ArcadeTitle>
            </h1>

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

            <p className="text-sm max-w-md leading-relaxed mb-4" style={{ color: "#aaa" }}>
              Learn to trade through Dollar Guy's story
              <br />
              — then compete with friends.
            </p>

            <div className="w-full max-w-[min(100%,280px)] mx-auto mb-6 flex justify-center">
              <img
                src={publicAsset("output-onlinegiftools.gif")}
                alt="Dollar Dash"
                className="w-full h-auto max-h-[min(40vh,220px)] object-contain"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(255,214,0,0.15))",
                }}
                decoding="async"
                loading="eager"
              />
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
                  <span className="ml-2" style={{ color: "#555" }}>
                    {s.volatility > 0.04 ? "⚡ Volatile" : s.volatility > 0.02 ? "⚡ Medium" : "🛡️ Steady"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={() => navigate("/story")}
                className="btn-pixel w-full py-4 px-6 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
                style={{
                  fontFamily: "var(--font-pixel)",
                  background: "#76FF03",
                  color: "#0a0e1a",
                  boxShadow: "0 0 30px rgba(118,255,3,0.25)",
                }}
              >
                STORY MODE
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/host")}
                  className="btn-pixel flex-1 py-4 px-6 font-bold text-base cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
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
                  className="btn-pixel flex-1 py-4 px-6 font-bold text-base cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
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

            <p className="text-xs mt-6 mb-2 max-w-md" style={{ color: "#444" }}>
              Story mode teaches the basics. Multiplayer lets you compete.
            </p>
          </div>

          <div className="shrink-0 w-full text-center py-6 border-t border-white/[0.06]">
            <div
              className="text-xs tracking-widest"
              style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
            >
              HOW TO PLAY
            </div>
          </div>
        </section>

        {/* Below the fold — steps + tip */}
        <section className="px-6 pb-20 max-w-lg mx-auto w-full text-center">
          <div className="flex flex-col gap-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex gap-3 text-left rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
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
                  <div className="flex items-center gap-1.5 mb-0.5">
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

          <p className="text-xs leading-relaxed mt-6 text-left" style={{ color: "#555" }}>
            <span style={{ color: "#76FF03" }}>TIP:</span> Read the news feed — it tells you which stocks are about to move and in which direction.
          </p>
        </section>
      </div>
    </div>
  );
}

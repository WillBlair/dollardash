import { useState, useEffect, useRef } from "react";
import Leaderboard from "./Leaderboard.jsx";
import { STOCKS } from "../../shared/constants.js";

// Duration of the day transition pause on the server (ms)
const TRANSITION_MS = 10000;
// Gif paths
const MASCOT_GIF = "/output-onlinegiftools.gif";
const DOLLAR_GUY_GIF = "/output-onlinegiftools%20(1).gif";

const DAY_TITLE_STYLE = {
  fontFamily: "var(--font-pixel)",
  color: "#FFD600",
  fontSize: "clamp(40px, 10vw, 80px)",
  textShadow:
    "3px 4px 0 rgba(160,70,0,0.94), -2px -1.5px 0 rgba(0,229,255,0.28), 0 0 40px rgba(255,214,0,0.65), 0 0 80px rgba(255,214,0,0.25), 0 6px 0 rgba(0,0,0,0.55)",
  letterSpacing: "0.05em",
};

// ── Day 1 intro: stock descriptions ──────────────────────────────────────────
function Day1Content() {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div
        className="text-xs text-center tracking-widest mb-1"
        style={{ fontFamily: "var(--font-pixel)", color: "#aaa" }}
      >
        TODAY'S STOCKS
      </div>
      {STOCKS.map((stock) => (
        <div
          key={stock.symbol}
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${stock.color}33` }}
        >
          <div className="shrink-0 text-center" style={{ width: 56 }}>
            <div
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-pixel)", color: stock.color }}
            >
              {stock.symbol}
            </div>
            <div
              className="text-xs font-bold mt-0.5 px-1 py-0.5 rounded"
              style={{
                background: `${stock.color}22`,
                color: stock.color,
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.05em",
              }}
            >
              {stock.risk}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-semibold" style={{ color: "#fff" }}>
                {stock.name}
              </span>
              <span
                className="text-base font-bold tabular-nums ml-2 shrink-0"
                style={{ fontFamily: "var(--font-mono)", color: stock.color }}
              >
                ${stock.basePrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
              {stock.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Day N progress screen: leaderboard + walking Dollar Guy progress bar ──────
function DayProgressContent({ leaderboard, highlightId }) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const id = setInterval(() => {
      const pct = Math.min((Date.now() - startRef.current) / TRANSITION_MS, 1);
      setProgress(pct);
      if (pct >= 1) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <>
      {/* Leaderboard */}
      <div className="flex-1 min-h-0 overflow-auto px-6 pb-2">
        <div className="max-w-lg mx-auto">
          {leaderboard.length > 0 ? (
            <Leaderboard entries={leaderboard} highlightId={highlightId} />
          ) : (
            <div className="text-center text-sm pt-6" style={{ color: "#444" }}>
              No players yet
            </div>
          )}
        </div>
      </div>

      {/* Progress bar + Dollar Guy */}
      <div className="shrink-0 px-8 pb-8 pt-2">
        <div className="text-center text-xs mb-3 tracking-widest" style={{ fontFamily: "var(--font-pixel)", color: "#666" }}>
          NEXT DAY STARTING...
        </div>

        {/* Bar container — extra top padding so gif floats above */}
        <div className="relative" style={{ paddingTop: 56 }}>
          {/* Dollar Guy walking across */}
          <div
            className="absolute"
            style={{
              left: `${pct}%`,
              bottom: "100%",
              transform: "translateX(-50%)",
              transition: "left 0.05s linear",
              marginBottom: 4,
            }}
          >
            <img
              src={DOLLAR_GUY_GIF}
              alt="Dollar Guy"
              style={{
                height: 52,
                imageRendering: "pixelated",
                display: "block",
              }}
            />
          </div>

          {/* Track */}
          <div
            className="relative h-5 rounded-full overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,214,0,0.2)",
            }}
          >
            {/* Fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #FFD600 0%, #FF9100 100%)",
                boxShadow: "0 0 12px rgba(255,214,0,0.5)",
                transition: "width 0.05s linear",
              }}
            />
            {/* Percent label */}
            <div
              className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
              style={{ fontFamily: "var(--font-pixel)", color: pct > 48 ? "#0a0e1a" : "#FFD600" }}
            >
              {pct}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function DayTransitionScreen({ dayNumber, leaderboard, highlightId }) {
  const isDay1 = dayNumber === 1;
  // For Day 2+ the title shows the completed day (e.g. dayNumber=2 → "DAY 1")
  const displayDay = isDay1 ? 1 : dayNumber - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "#0a0e1a" }}
    >
      {/* Title */}
      <div className="flex items-center justify-center pt-8 pb-4 shrink-0">
        <div style={DAY_TITLE_STYLE}>DAY {displayDay}</div>
      </div>

      {isDay1 ? (
        <>
          {/* Stock info fills remaining space */}
          <div className="flex-1 min-h-0 overflow-auto px-6 pb-2">
            <div className="max-w-lg mx-auto">
              <Day1Content />
            </div>
          </div>

          {/* Mascot gif at bottom */}
          <div className="shrink-0 flex items-center justify-center" style={{ height: "28%" }}>
            <img
              src={MASCOT_GIF}
              alt="Dollar Dash Mascot"
              style={{
                maxHeight: "100%",
                maxWidth: "min(260px, 80vw)",
                objectFit: "contain",
                imageRendering: "pixelated",
              }}
            />
          </div>
        </>
      ) : (
        // Day 2+ — leaderboard + walking progress bar
        <DayProgressContent leaderboard={leaderboard} highlightId={highlightId} />
      )}
    </div>
  );
}

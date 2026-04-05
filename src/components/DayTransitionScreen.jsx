import Leaderboard from "./Leaderboard.jsx";
import { STOCKS } from "../../shared/constants.js";

export default function DayTransitionScreen({ dayNumber, leaderboard, highlightId }) {
  const isDay1 = dayNumber === 1;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "#0a0e1a" }}
    >
      {/* Day label */}
      <div className="flex items-center justify-center pt-8 pb-4 shrink-0">
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            color: "#FFD600",
            fontSize: "clamp(40px, 10vw, 80px)",
            textShadow:
              "3px 4px 0 rgba(160,70,0,0.94), -2px -1.5px 0 rgba(0,229,255,0.28), 0 0 40px rgba(255,214,0,0.65), 0 0 80px rgba(255,214,0,0.25), 0 6px 0 rgba(0,0,0,0.55)",
            letterSpacing: "0.05em",
          }}
        >
          DAY {dayNumber}
        </div>
      </div>

      {/* Middle content */}
      <div className="flex-1 min-h-0 overflow-auto px-6 pb-2">
        <div className="max-w-lg mx-auto">
          {isDay1 ? (
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
          ) : (
            leaderboard.length > 0 ? (
              <Leaderboard entries={leaderboard} highlightId={highlightId} />
            ) : (
              <div className="text-center text-sm pt-6" style={{ color: "#444" }}>
                No players yet
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom — mascot gif */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ height: "30%" }}
      >
        <img
          src="/output-onlinegiftools.gif"
          alt="Dollar Dash Mascot"
          style={{
            maxHeight: "100%",
            maxWidth: "min(280px, 80vw)",
            objectFit: "contain",
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
}

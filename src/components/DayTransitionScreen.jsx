import Leaderboard from "./Leaderboard.jsx";

export default function DayTransitionScreen({ dayNumber, leaderboard, highlightId }) {
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

      {/* Top half — leaderboard */}
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

      {/* Bottom half — mascot gif */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ height: "40%" }}
      >
        <img
          src="/output-onlinegiftools.gif"
          alt="Dollar Dash Mascot"
          style={{
            maxHeight: "100%",
            maxWidth: "min(340px, 90vw)",
            objectFit: "contain",
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
}

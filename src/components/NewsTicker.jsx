import { useEffect, useRef } from "react";
import { STOCKS } from "../../shared/constants.js";

const SENTIMENT_STYLES = {
  bullish: { bg: "rgba(118,255,3,0.12)", border: "rgba(118,255,3,0.3)", color: "#76FF03", icon: "📈" },
  bearish: { bg: "rgba(255,61,113,0.12)", border: "rgba(255,61,113,0.3)", color: "#FF3D71", icon: "📉" },
  neutral: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.15)", color: "#aaa", icon: "📰" },
};

export default function NewsTicker({ events, compact = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events?.length]);

  if (!events || events.length === 0) {
    return (
      <div
        className="rounded-lg px-3 py-2 text-xs text-center"
        style={{ background: "rgba(255,255,255,0.03)", color: "#444" }}
      >
        Waiting for market news...
      </div>
    );
  }

  const displayed = compact ? events.slice(-3) : events.slice(-5);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-1.5 overflow-y-auto"
      style={{ maxHeight: compact ? 120 : 200 }}
    >
      {displayed.map((event, i) => {
        const style = SENTIMENT_STYLES[event.sentiment] || SENTIMENT_STYLES.neutral;
        const stockColor = event.stockIdx >= 0 ? STOCKS[event.stockIdx]?.color : "#FFD600";
        const isLatest = i === displayed.length - 1;

        return (
          <div
            key={`${event.headline}-${event.timestamp}`}
            className="rounded-lg px-3 py-2 transition-all"
            style={{
              background: style.bg,
              borderLeft: `3px solid ${style.border}`,
              opacity: isLatest ? 1 : 0.6,
              animation: isLatest ? "slide-up 0.3s ease-out" : undefined,
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-sm shrink-0">{style.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: `${stockColor}22`,
                      color: stockColor,
                    }}
                  >
                    {event.symbol}
                  </span>
                  <span className="text-[10px] font-bold uppercase" style={{ color: style.color }}>
                    {event.sentiment}
                  </span>
                </div>
                <div
                  className="text-xs leading-snug"
                  style={{ color: isLatest ? "#fff" : "#aaa" }}
                >
                  {event.headline}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

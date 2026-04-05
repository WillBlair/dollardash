import { useEffect, useRef } from "react";
import { STOCKS } from "../../shared/constants.js";

const SENTIMENT_STYLES = {
  bullish: { bg: "rgba(118,255,3,0.1)", border: "#76FF03", color: "#76FF03", icon: "📈", label: "BULLISH" },
  bearish: { bg: "rgba(255,61,113,0.1)", border: "#FF3D71", color: "#FF3D71", icon: "📉", label: "BEARISH" },
  neutral: { bg: "rgba(255,255,255,0.05)", border: "#666", color: "#aaa", icon: "📰", label: "NEWS" },
};

export default function NewsTicker({ events }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events?.length]);

  if (!events || events.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div
          className="text-xs mb-2 shrink-0 tracking-widest"
          style={{ fontFamily: "var(--font-pixel)", color: "#555" }}
        >
          MARKET NEWS
        </div>
        <div
          className="flex min-h-0 flex-1 items-center justify-center rounded-xl text-sm"
          style={{ background: "rgba(255,255,255,0.02)", color: "#333", minHeight: 96 }}
        >
          Waiting for breaking news...
        </div>
      </div>
    );
  }

  const displayed = events.slice(-4);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col min-w-0">
      <div
        className="text-xs mb-2 shrink-0 tracking-widest"
        style={{ fontFamily: "var(--font-pixel)", color: "#555" }}
      >
        MARKET NEWS
      </div>
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
      >
        {displayed.map((event, i) => {
          const s = SENTIMENT_STYLES[event.sentiment] || SENTIMENT_STYLES.neutral;
          const stockColor = event.stockIdx >= 0 ? STOCKS[event.stockIdx]?.color : "#FFD600";
          const isLatest = i === displayed.length - 1;

          return (
            <div
              key={`${event.headline}-${event.timestamp}`}
              className="rounded-xl px-4 py-3 transition-all"
              style={{
                background: isLatest ? s.bg : "rgba(255,255,255,0.02)",
                borderLeft: `4px solid ${isLatest ? s.border : "rgba(255,255,255,0.08)"}`,
                opacity: isLatest ? 1 : 0.5,
                animation: isLatest ? "slide-up 0.4s ease-out" : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{s.icon}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{ background: `${stockColor}22`, color: stockColor }}
                >
                  {event.symbol}
                </span>
                <span
                  className="text-xs font-bold tracking-wider"
                  style={{ color: s.color }}
                >
                  {s.label}
                </span>
              </div>
              <div
                className="text-sm leading-relaxed font-medium"
                style={{ color: isLatest ? "#fff" : "#777" }}
              >
                {event.headline}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

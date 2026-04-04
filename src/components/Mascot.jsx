import { useEffect, useState } from "react";

const MASCOT_PHRASES = {
  idle: ["Markets are open...", "Watch the tape.", "Stay sharp."],
  bullish: ["LFG! Moon mission!", "To the moon, baby!", "Bulls running wild!"],
  bearish: ["Oh no... sell sell sell!", "Brace for impact!", "Blood on the Street!"],
  buy: ["Nice entry!", "Big money move!", "Loading up, I see!"],
  sell: ["Taking profits!", "Smart exit!", "Cash is king!"],
  winning: ["You're on fire!", "Bonus season!", "Corner office!"],
  losing: ["Rough day...", "Hold the line!", "We'll bounce back."],
};

export default function Mascot({ mood = "idle", latestEvent = null }) {
  const [phrase, setPhrase] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const phrases = MASCOT_PHRASES[mood] || MASCOT_PHRASES.idle;
    setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [mood, latestEvent]);

  return (
    <div
      className="fixed bottom-4 left-4 z-40 flex items-end gap-2 pointer-events-none"
      style={{ transition: "opacity 0.3s ease", opacity: visible ? 1 : 0.4 }}
    >
      {/* Mascot placeholder — retro suit silhouette */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          width: 72,
          height: 88,
          background: "linear-gradient(180deg, rgba(255,214,0,0.08) 0%, rgba(255,255,255,0.03) 100%)",
          border: "2px solid rgba(255,214,0,0.2)",
          boxShadow: "0 0 20px rgba(255,214,0,0.08)",
        }}
      >
        {/* Pixel art suit guy silhouette */}
        <div className="flex flex-col items-center" style={{ marginTop: 4 }}>
          {/* Head */}
          <div
            className="rounded-full"
            style={{
              width: 24, height: 24,
              background: "#FFD600",
              boxShadow: "0 0 8px rgba(255,214,0,0.3)",
            }}
          />
          {/* Body / suit */}
          <div
            className="rounded-md mt-1"
            style={{
              width: 32, height: 28,
              background: "linear-gradient(180deg, #333 0%, #1a1a2e 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Tie */}
            <div className="mx-auto mt-1" style={{ width: 4, height: 14, background: "#FF3D71", borderRadius: 1 }} />
          </div>
          {/* Legs */}
          <div className="flex gap-1 mt-0.5">
            <div style={{ width: 10, height: 10, background: "#222", borderRadius: 2 }} />
            <div style={{ width: 10, height: 10, background: "#222", borderRadius: 2 }} />
          </div>
        </div>
        {/* PLACEHOLDER label */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center py-0.5"
          style={{ background: "rgba(0,0,0,0.6)", fontSize: 6, color: "#555", fontFamily: "var(--font-pixel)" }}
        >
          MASCOT
        </div>
      </div>

      {/* Speech bubble */}
      {phrase && (
        <div
          className="rounded-lg px-3 py-2 relative animate-slide-up"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            maxWidth: 180,
          }}
        >
          <div className="text-xs leading-snug font-medium" style={{ color: "#ddd" }}>
            {phrase}
          </div>
          {/* Bubble tail */}
          <div
            className="absolute -left-1.5 bottom-3"
            style={{
              width: 0, height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "6px solid rgba(255,255,255,0.15)",
            }}
          />
        </div>
      )}
    </div>
  );
}

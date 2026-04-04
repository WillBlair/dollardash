import { GAME_DURATIONS } from "../../shared/constants.js";

export default function DurationPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs font-bold tracking-wider" style={{ color: "#666" }}>
        DURATION:
      </span>
      <div className="flex gap-2">
        {GAME_DURATIONS.map((d) => (
          <button
            key={d.seconds}
            onClick={() => onChange(d.seconds)}
            className="rounded-lg px-4 py-2.5 font-bold text-sm cursor-pointer border-2 transition-all"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: 11,
              background: value === d.seconds ? "rgba(255,214,0,0.15)" : "rgba(255,255,255,0.04)",
              borderColor: value === d.seconds ? "#FFD600" : "rgba(255,255,255,0.08)",
              color: value === d.seconds ? "#FFD600" : "#666",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

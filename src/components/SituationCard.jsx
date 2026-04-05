/** Framed “you are here” strip for story beats — icon + headline above dialog. */
export default function SituationCard({ icon, headline, accent = "#00E5FF", children }) {
  return (
    <div
      className="w-full rounded-xl border-2 px-4 py-3 mb-1 animate-slide-up"
      style={{
        borderColor: `${accent}44`,
        background: `${accent}0f`,
        boxShadow: `0 0 24px ${accent}14`,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0 leading-none" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className="text-[10px] font-bold tracking-widest mb-0.5 truncate"
            style={{ fontFamily: "var(--font-pixel)", color: accent, opacity: 0.9 }}
          >
            {headline}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

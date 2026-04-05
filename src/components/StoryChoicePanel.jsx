/** Branch buttons for story decision steps — large tap targets, comic tone. */
export default function StoryChoicePanel({ options, onPick, disabled }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div
        className="text-[10px] font-bold tracking-wider mb-1"
        style={{ fontFamily: "var(--font-pixel)", color: "#FF9100" }}
      >
        PICK YOUR MOVE
      </div>
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onPick(i)}
          className="w-full text-left rounded-xl px-4 py-3.5 cursor-pointer border-2 transition-all hover:scale-[1.02] active:scale-[0.99] disabled:opacity-45 disabled:pointer-events-none disabled:hover:scale-100"
          style={{
            borderColor: "rgba(255, 214, 0, 0.5)",
            backgroundColor: "#161d2c",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(12px, 2.8vw, 14px)",
            lineHeight: 1.45,
            color: "#f0f0f0",
          }}
        >
          <span className="mr-2" aria-hidden>
            {opt.emoji ?? "➜"}
          </span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

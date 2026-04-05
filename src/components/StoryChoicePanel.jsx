/** Story choice list — narrow column, aligned text, readable tap targets. */
export default function StoryChoicePanel({ options, onPick, disabled }) {
  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <div
        className="text-[10px] font-bold tracking-wider"
        style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
      >
        CHOOSE ONE
      </div>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(i)}
              className="flex w-full gap-3 text-left rounded-xl border-2 px-3 py-3 sm:px-3.5 sm:py-3 cursor-pointer transition-colors hover:border-[#FFD60099] disabled:opacity-45 disabled:pointer-events-none disabled:hover:border-[rgba(255,214,0,0.45)]"
              style={{
                borderColor: "rgba(255, 214, 0, 0.45)",
                backgroundColor: "#161d2c",
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                style={{ background: "rgba(255, 214, 0, 0.14)", fontFamily: "var(--font-pixel)", color: "#FFD600" }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span
                className="min-w-0 flex-1 text-sm leading-snug sm:text-[15px] sm:leading-snug"
                style={{ fontFamily: "var(--font-mono)", color: "#f0f0f0" }}
              >
                {opt.emoji ? (
                  <>
                    <span className="mr-1.5 inline-block text-base translate-y-px" aria-hidden>
                      {opt.emoji}
                    </span>
                    {opt.label}
                  </>
                ) : (
                  opt.label
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

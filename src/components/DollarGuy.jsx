import { useState, useCallback, useEffect } from "react";
import DialogBubble from "./DialogBubble.jsx";
import SituationCard from "./SituationCard.jsx";
import StoryChoicePanel from "./StoryChoicePanel.jsx";

function toSteps(dialog) {
  return dialog.map((item) =>
    item?.type === "choice" ? { kind: "choice", ...item } : { kind: "line", line: item },
  );
}

/** Served from /public/story — story-mode mascot art. */
const DOLLAR_GUY_SRC = "/story/dollar-guy.png";

function DollarGuyPortrait({ size }) {
  const isLarge = size === "large";
  return (
    <img
      src={DOLLAR_GUY_SRC}
      alt="Dollar Guy"
      className={
        isLarge
          ? "h-32 sm:h-36 w-auto max-w-[12rem] sm:max-w-[14rem] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] shrink-0 select-none"
          : "h-16 sm:h-[4.5rem] w-auto max-w-[7rem] object-contain drop-shadow-md shrink-0 select-none"
      }
      draggable={false}
    />
  );
}

export default function DollarGuy({ dialog, onDialogComplete, size = "large" }) {
  const [steps, setSteps] = useState(() => toSteps(dialog));
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setSteps(toSteps(dialog));
    setLineIndex(0);
  }, [dialog]);

  const step = steps[lineIndex];

  const handleAdvance = useCallback(() => {
    if (!step || step.kind === "choice") return;
    if (lineIndex >= steps.length - 1) {
      onDialogComplete?.();
    } else {
      setLineIndex((i) => i + 1);
    }
  }, [lineIndex, steps.length, onDialogComplete, step]);

  const handlePick = useCallback(
    (optIdx) => {
      if (!step || step.kind !== "choice") return;
      const opt = step.options[optIdx];
      if (!opt) return;
      const injected = [
        ...(opt.lines || []).map((line) => ({ kind: "line", line })),
        ...(step.tail || []).map((line) => ({ kind: "line", line })),
      ];
      setSteps((prev) => [...prev.slice(0, lineIndex), ...injected, ...prev.slice(lineIndex + 1)]);
    },
    [step, lineIndex],
  );

  if (!step) return null;

  const bubbleKey =
    step.kind === "line"
      ? `L${lineIndex}-${step.line.text?.slice(0, 24) ?? ""}`
      : `C${lineIndex}`;

  const rootMax = step.kind === "choice" ? "max-w-5xl" : "max-w-lg";

  return (
    <div className={`flex flex-col items-center gap-4 w-full ${rootMax} mx-auto px-1 animate-slide-up`}>
      <DollarGuyPortrait size={size} />

      <div className="w-full">
        {step.kind === "line" && (
          <>
            {step.line.scene && (
              <SituationCard
                icon={step.line.scene.icon}
                headline={step.line.scene.headline}
                accent={step.line.scene.accent ?? "#00E5FF"}
              >
                {step.line.scene.detail && (
                  <div className="text-xs mt-1" style={{ color: "#aaa" }}>
                    {step.line.scene.detail}
                  </div>
                )}
              </SituationCard>
            )}
            <DialogBubble key={bubbleKey} text={step.line.text} onComplete={handleAdvance} />
          </>
        )}

        {step.kind === "choice" && (
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-5">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {step.scene && (
                <SituationCard
                  icon={step.scene.icon}
                  headline={step.scene.headline}
                  accent={step.scene.accent ?? "#FF9100"}
                >
                  {step.scene.detail && (
                    <div className="text-xs mt-1" style={{ color: "#aaa" }}>
                      {step.scene.detail}
                    </div>
                  )}
                </SituationCard>
              )}
              <div
                className="rounded-2xl border-2 p-4 w-full"
                style={{
                  borderColor: "rgba(255, 214, 0, 0.45)",
                  backgroundColor: "#141c2e",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
                }}
              >
                <p
                  className="m-0"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(13px, 2.5vw, 15px)",
                    lineHeight: 1.65,
                    color: "#e8e8e8",
                  }}
                >
                  {step.prompt}
                </p>
              </div>
            </div>
            <div className="w-full shrink-0 md:w-[min(20.5rem,34vw)] md:max-w-sm">
              <StoryChoicePanel options={step.options} onPick={handlePick} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap justify-center max-w-full">
        {steps.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all shrink-0"
            style={{
              background:
                i === lineIndex ? "#FFD600" : i < lineIndex ? "rgba(118,255,3,0.5)" : "rgba(255,255,255,0.12)",
              transform: i === lineIndex ? "scale(1.35)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

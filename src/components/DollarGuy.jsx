import { useState, useCallback, useEffect } from "react";
import DialogBubble from "./DialogBubble.jsx";
import SituationCard from "./SituationCard.jsx";
import StoryChoicePanel from "./StoryChoicePanel.jsx";

function toSteps(dialog) {
  return dialog.map((item) =>
    item?.type === "choice" ? { kind: "choice", ...item } : { kind: "line", line: item },
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
  const spriteSize = size === "large" ? "w-24 h-24" : "w-14 h-14";

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

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto animate-slide-up">
      <div
        className={`${spriteSize} rounded-full flex items-center justify-center shrink-0`}
        style={{
          background: "linear-gradient(135deg, #FFD600 0%, #FF9100 100%)",
          boxShadow: "0 0 30px rgba(255,214,0,0.3)",
          fontSize: size === "large" ? "48px" : "28px",
        }}
      >
        💰
      </div>

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
            <DialogBubble
              key={bubbleKey}
              text={step.line.text}
              speaker={step.line.speaker}
              onComplete={handleAdvance}
            />
          </>
        )}

        {step.kind === "choice" && (
          <div className="flex flex-col gap-3 w-full">
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
                borderColor: "rgba(255, 145, 0, 0.35)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {step.promptSpeaker === "dollar-guy" && (
                <div
                  className="text-[10px] font-bold mb-2 tracking-wider"
                  style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
                >
                  DOLLAR GUY
                </div>
              )}
              {step.promptSpeaker === "narrator" && (
                <div
                  className="text-[10px] font-bold mb-2 tracking-wider"
                  style={{ fontFamily: "var(--font-pixel)", color: "#FF9100" }}
                >
                  THE SITUATION
                </div>
              )}
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
            <StoryChoicePanel options={step.options} onPick={handlePick} />
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

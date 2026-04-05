import { useState, useCallback, useEffect } from "react";
import DialogBubble from "./DialogBubble.jsx";
import SituationCard from "./SituationCard.jsx";
import StoryChoicePanel from "./StoryChoicePanel.jsx";
import DollarGuySpeakerCue from "./DollarGuySpeakerCue.jsx";
import { useStoryNarrator } from "../hooks/useStoryNarrator.js";

function toSteps(dialog) {
  return dialog.map((item) =>
    item?.type === "choice" ? { kind: "choice", ...item } : { kind: "line", line: item },
  );
}

/** Served from /public/story — story-mode mascot art. */
const DOLLAR_GUY_SRC = "/story/dollar-guy.png";

const voiceEnabledDefault = import.meta.env.VITE_STORY_VOICE_ENABLED !== "false";

function DollarGuyPortrait({ size, isSpeaking }) {
  const isLarge = size === "large";
  return (
    <div className="flex shrink-0 flex-col items-center gap-2 self-start">
      <div
        className={`rounded-2xl p-1.5 sm:p-2 transition-all duration-300 ${
          isSpeaking
            ? "bg-[rgba(255,214,0,0.14)] shadow-[0_0_40px_rgba(255,214,0,0.38)] ring-2 ring-[#FFD60055]"
            : "ring-2 ring-transparent"
        }`}
      >
        <img
          src={DOLLAR_GUY_SRC}
          alt="Dollar Guy"
          className={
            isLarge
              ? "h-[13rem] min-[420px]:h-[22rem] sm:h-[28rem] md:h-[32rem] lg:h-[36rem] xl:h-[40rem] w-auto max-w-none object-contain object-bottom drop-shadow-[0_16px_40px_rgba(0,0,0,0.55)] select-none"
              : "h-44 sm:h-52 md:h-60 w-auto max-w-none object-contain object-bottom drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] select-none"
          }
          draggable={false}
        />
      </div>
      <span
        className="text-[8px] font-bold tracking-widest text-center leading-snug max-w-[11rem] sm:max-w-[12rem]"
        style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}
      >
        DOLLAR GUY · YOUR GUIDE
      </span>
    </div>
  );
}

export default function DollarGuy({
  dialog,
  onDialogComplete,
  size = "large",
  voiceEnabled = voiceEnabledDefault,
  typingSpeed = 22,
}) {
  const [steps, setSteps] = useState(() => toSteps(dialog));
  const [lineIndex, setLineIndex] = useState(0);

  const { speak, stop, isSpeaking } = useStoryNarrator(voiceEnabled);

  useEffect(() => {
    setSteps(toSteps(dialog));
    setLineIndex(0);
  }, [dialog]);

  const step = steps[lineIndex];

  useEffect(() => {
    if (!voiceEnabled) return;
    const s = steps[lineIndex];
    if (!s) return;
    const text = s.kind === "line" ? s.line.text : s.prompt;
    speak(text);
    return () => stop();
  }, [steps, lineIndex, voiceEnabled, speak, stop]);

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

  const speakerCue = <DollarGuySpeakerCue isSpeaking={isSpeaking} />;

  /** Narrow copy column so choices and cards never span full viewport. */
  const copyColumnClass =
    step.kind === "choice"
      ? "w-full min-w-0 max-w-[20rem] sm:max-w-sm"
      : "w-full min-w-0 max-w-md sm:max-w-lg";

  return (
    <div className="flex w-full animate-slide-up flex-col gap-4">
      <div className="flex w-full max-w-full flex-row flex-nowrap items-start gap-3 overflow-x-auto pb-1 sm:gap-4 md:gap-6 [scrollbar-width:thin]">
        <DollarGuyPortrait size={size} isSpeaking={isSpeaking} />

        <div className={`flex flex-col gap-3 pt-0.5 ${copyColumnClass}`}>
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
                header={speakerCue}
                typingSpeed={typingSpeed}
                onComplete={handleAdvance}
              />
            </>
          )}

          {step.kind === "choice" && (
            <div className="flex w-full flex-col gap-3">
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
              {speakerCue}
              <div
                className="rounded-xl border-2 px-3.5 py-3 w-full relative"
                style={{
                  borderColor: "rgba(255, 214, 0, 0.45)",
                  backgroundColor: "#141c2e",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  className="pointer-events-none absolute left-0 top-6 -translate-x-1.5 sm:-translate-x-2 w-0 h-0 border-y-[7px] border-y-transparent border-r-[9px] sm:border-r-[10px]"
                  style={{ borderRightColor: "#141c2e" }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute left-0 top-[calc(1.5rem-2px)] -translate-x-[calc(0.375rem+2px)] sm:-translate-x-[calc(0.5rem+2px)] w-0 h-0 border-y-[9px] border-y-transparent border-r-[11px]"
                  style={{ borderRightColor: "rgba(255, 214, 0, 0.45)" }}
                  aria-hidden
                />
                <p
                  className="m-0 text-sm sm:text-[15px] relative"
                  style={{
                    fontFamily: "var(--font-mono)",
                    lineHeight: 1.55,
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

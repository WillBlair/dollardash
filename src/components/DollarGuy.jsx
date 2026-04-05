import { useState, useCallback } from "react";
import DialogBubble from "./DialogBubble.jsx";

export default function DollarGuy({ dialog, onDialogComplete, size = "large" }) {
  const [currentLine, setCurrentLine] = useState(0);

  const handleAdvance = useCallback(() => {
    if (currentLine >= dialog.length - 1) {
      onDialogComplete?.();
    } else {
      setCurrentLine((prev) => prev + 1);
    }
  }, [currentLine, dialog.length, onDialogComplete]);

  const line = dialog[currentLine];
  if (!line) return null;

  const spriteSize = size === "large" ? "w-24 h-24" : "w-14 h-14";

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto animate-slide-up">
      {/* Dollar Guy sprite placeholder — swap with actual pixel art asset */}
      <div className={`${spriteSize} rounded-full flex items-center justify-center shrink-0`}
        style={{
          background: "linear-gradient(135deg, #FFD600 0%, #FF9100 100%)",
          boxShadow: "0 0 30px rgba(255,214,0,0.3)",
          fontSize: size === "large" ? "48px" : "28px",
        }}
      >
        💰
      </div>

      <div className="w-full">
        <DialogBubble
          key={currentLine}
          text={line.text}
          speaker={line.speaker}
          onComplete={handleAdvance}
        />
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {dialog.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i <= currentLine ? "#FFD600" : "rgba(255,255,255,0.15)",
              transform: i === currentLine ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

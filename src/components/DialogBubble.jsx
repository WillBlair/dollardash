import { useState, useEffect, useRef } from "react";

export default function DialogBubble({ text, speaker, onComplete, autoAdvance = false, typingSpeed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayedText(text);
        setIsTyping(false);
        if (autoAdvance) {
          setTimeout(() => onComplete?.(), 1200);
        }
        return;
      }
      setDisplayedText(text.slice(0, indexRef.current + 1));
    }, typingSpeed);

    return () => clearInterval(intervalRef.current);
  }, [text, typingSpeed, autoAdvance, onComplete]);

  const handleClick = () => {
    if (isTyping) {
      clearInterval(intervalRef.current);
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onComplete?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left rounded-2xl p-5 cursor-pointer border-2 transition-all relative"
      style={{
        background: "rgba(255,255,255,0.06)",
        borderColor: "rgba(255,214,0,0.3)",
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(13px, 2.5vw, 15px)",
        lineHeight: 1.7,
        color: "#e0e0e0",
      }}
    >
      {speaker === "dollar-guy" && (
        <div
          className="text-xs font-bold mb-2 tracking-wider"
          style={{ fontFamily: "var(--font-pixel)", color: "#FFD600", fontSize: "10px" }}
        >
          DOLLAR GUY
        </div>
      )}
      <div style={{ minHeight: "1.7em" }}>
        {displayedText}
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: "#FFD600", verticalAlign: "text-bottom" }} />
        )}
      </div>
      {!isTyping && (
        <div className="text-xs mt-3 text-right" style={{ color: "#555", fontFamily: "var(--font-pixel)", fontSize: "8px" }}>
          TAP TO CONTINUE ▶
        </div>
      )}
    </button>
  );
}

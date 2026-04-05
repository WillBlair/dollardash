import { useState } from "react";

export default function HeadlineQuizGame({ config, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("playing");

  const headline = config.headlines[currentIdx];

  const handleAnswer = (answer) => {
    const correct = answer === headline.answer;
    const newScore = correct ? score + 1 : score;
    const newAnswers = [...answers, { ...headline, playerAnswer: answer, correct }];

    setScore(newScore);
    setAnswers(newAnswers);
    setFeedback({ correct, explanation: headline.explanation });

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx >= config.headlines.length - 1) {
        setPhase("result");
        setTimeout(() => {
          onComplete?.(newScore === config.headlines.length);
        }, 2500);
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 2000);
  };

  if (phase === "result") {
    const allCorrect = score === config.headlines.length;
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto animate-slide-up">
        <div className="text-4xl mb-2">{allCorrect ? "🎯" : "📊"}</div>
        <div className="text-xl font-bold" style={{ fontFamily: "var(--font-pixel)", color: allCorrect ? "#76FF03" : "#FFD600" }}>
          {score}/{config.headlines.length} CORRECT
        </div>
        <div className="text-sm text-center" style={{ color: "#aaa" }}>
          {allCorrect ? config.successText : config.partialText}
        </div>
        <div className="w-full flex flex-col gap-2 mt-2">
          {answers.map((a, i) => (
            <div key={i} className="rounded-lg p-3 text-xs" style={{ background: a.correct ? "rgba(118,255,3,0.1)" : "rgba(255,61,113,0.1)", border: `1px solid ${a.correct ? "#76FF0333" : "#FF3D7133"}` }}>
              <div style={{ color: "#ddd" }}>{a.text}</div>
              <div className="mt-1" style={{ color: a.correct ? "#76FF03" : "#FF3D71" }}>
                {a.correct ? "✓" : "✗"} {a.answer === "bullish" ? "📈 Good News (Bullish)" : "📉 Bad News (Bearish)"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <div className="text-xs tracking-wider" style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}>
        MINI-GAME: READ THE HEADLINES
      </div>

      <div className="flex gap-2">
        {config.headlines.map((_, i) => (
          <div key={i} className="w-8 h-1 rounded-full" style={{ background: i < currentIdx ? "#76FF03" : i === currentIdx ? "#FFD600" : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>

      {!feedback && (
        <div className="rounded-xl p-5 w-full text-center animate-slide-up" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="text-xs mb-3" style={{ color: "#888" }}>
            About: <span className="font-bold" style={{ color: "#FFD600" }}>{headline.stock}</span>
          </div>
          <div className="text-sm leading-relaxed font-semibold" style={{ color: "#e0e0e0" }}>
            "{headline.text}"
          </div>
        </div>
      )}

      {feedback && (
        <div className="rounded-xl p-5 w-full text-center animate-slide-up" style={{ background: feedback.correct ? "rgba(118,255,3,0.08)" : "rgba(255,61,113,0.08)", border: `2px solid ${feedback.correct ? "#76FF03" : "#FF3D71"}44` }}>
          <div className="text-2xl mb-2">{feedback.correct ? "✅" : "❌"}</div>
          <div className="text-sm font-bold mb-1" style={{ color: feedback.correct ? "#76FF03" : "#FF3D71" }}>
            {feedback.correct ? "Correct!" : "Not quite!"}
          </div>
          <div className="text-xs" style={{ color: "#aaa" }}>{feedback.explanation}</div>
        </div>
      )}

      {!feedback && (
        <div className="flex gap-3 w-full">
          <button
            onClick={() => handleAnswer("bullish")}
            className="flex-1 rounded-xl py-4 font-bold cursor-pointer border-none tracking-wider transition-transform hover:scale-105 flex flex-col items-center gap-1"
            style={{ fontFamily: "var(--font-pixel)", background: "#76FF03", color: "#0a0e1a" }}
          >
            <span className="text-base">📈 GOOD</span>
            <span className="text-[8px] opacity-70">Bullish</span>
          </button>
          <button
            onClick={() => handleAnswer("bearish")}
            className="flex-1 rounded-xl py-4 font-bold cursor-pointer border-none tracking-wider transition-transform hover:scale-105 flex flex-col items-center gap-1"
            style={{ fontFamily: "var(--font-pixel)", background: "#FF3D71", color: "#fff" }}
          >
            <span className="text-base">📉 BAD</span>
            <span className="text-[8px] opacity-70">Bearish</span>
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { STOCKS, TICK_MS } from "../../../shared/constants.js";

export default function FirstBuyGame({ config, onComplete }) {
  const stock = STOCKS[config.stockIdx];
  const [price, setPrice] = useState(stock.basePrice);
  const [phase, setPhase] = useState("ready");
  const [buyPrice, setBuyPrice] = useState(null);
  const [profit, setProfit] = useState(null);
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setPrice((prev) => {
        const shock = (Math.random() - 0.5) * 2 * 0.015;
        const drift = 0.002;
        return Math.max(0.01, parseFloat((prev * (1 + shock + drift)).toFixed(2)));
      });
    }, TICK_MS);
    return () => clearInterval(tickRef.current);
  }, []);

  const handleBuy = () => {
    setBuyPrice(price);
    setPhase("bought");
  };

  const handleSell = () => {
    const pnl = price - buyPrice;
    setProfit(pnl);
    setPhase("sold");
    clearInterval(tickRef.current);
    setTimeout(() => {
      setPhase("done");
      onComplete?.(pnl > 0);
    }, 2000);
  };

  const pnlColor = profit !== null ? (profit >= 0 ? "#76FF03" : "#FF3D71") : "#fff";

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto animate-slide-up">
      <div className="text-xs tracking-wider" style={{ fontFamily: "var(--font-pixel)", color: "#FFD600" }}>
        MINI-GAME: YOUR FIRST TRADE
      </div>

      <div className="text-sm text-center" style={{ color: "#aaa" }}>
        {config.instructions}
      </div>

      <div className="rounded-xl p-5 w-full text-center" style={{ background: "rgba(255,255,255,0.06)", border: `2px solid ${stock.color}44` }}>
        <div className="text-lg font-bold" style={{ color: stock.color }}>{stock.symbol}</div>
        <div className="text-sm" style={{ color: "#888" }}>{stock.name}</div>
        <div className="text-3xl font-bold my-3 transition-all" style={{ fontFamily: "var(--font-mono)" }}>
          ${price.toFixed(2)}
        </div>
        {phase === "bought" && buyPrice && (
          <div className="text-sm" style={{ color: price >= buyPrice ? "#76FF03" : "#FF3D71" }}>
            {price >= buyPrice ? "▲" : "▼"} {((price - buyPrice) / buyPrice * 100).toFixed(1)}% since you bought
          </div>
        )}
      </div>

      {phase === "ready" && (
        <button
          onClick={handleBuy}
          className="rounded-xl py-4 px-12 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105 animate-pulse-border border-2"
          style={{ fontFamily: "var(--font-pixel)", background: "#76FF03", color: "#0a0e1a", borderColor: "#76FF03" }}
        >
          BUY 1 SHARE
        </button>
      )}

      {phase === "bought" && (
        <button
          onClick={handleSell}
          className="rounded-xl py-4 px-12 font-bold text-lg cursor-pointer border-none tracking-wider transition-transform hover:scale-105"
          style={{ fontFamily: "var(--font-pixel)", background: "#FF3D71", color: "#fff" }}
        >
          SELL
        </button>
      )}

      {phase === "sold" && profit !== null && (
        <div className="text-center animate-slide-up">
          <div className="text-2xl font-bold mb-2" style={{ color: pnlColor }}>
            {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
          </div>
          <div className="text-sm" style={{ color: "#aaa" }}>
            {profit >= 0 ? config.successText : config.failText}
          </div>
        </div>
      )}
    </div>
  );
}

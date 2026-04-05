import { useState } from "react";
import { STOCKS } from "../../shared/constants.js";

export default function TradeControls({ selectedStock, price, cash, heldQty = 0, onTrade, disabled }) {
  const [qty, setQty] = useState(1);
  const stock = STOCKS[selectedStock];
  const maxBuy = Math.floor((cash || 0) / (price || 1));
  const cost = (price || 0) * qty;
  const safeHeld = Math.max(0, heldQty || 0);
  const canSell = safeHeld > 0 && qty <= safeHeld;
  const sellDisabled = disabled || !canSell;

  const handleTrade = (type) => {
    if (disabled) return;
    if (type === "sell" && sellDisabled) return;
    onTrade({ stockIdx: selectedStock, qty, type });
  };

  const qtyPresets = [1, 5, 10, 25];

  return (
    <div
      className="rounded-lg lg:rounded-xl p-2 gap-2 lg:p-3 lg:gap-3 flex flex-col"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <div>
        <div
          className="text-[8px] lg:text-[9px] tracking-[0.2em] mb-0.5 lg:mb-1 font-bold"
          style={{ fontFamily: "var(--font-pixel)", color: "#7a8498" }}
        >
          ORDER
        </div>
        <div
          className="text-xs lg:text-sm font-bold tabular-nums flex flex-wrap items-baseline gap-x-2 gap-y-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span style={{ color: stock?.color }}>Trading: {stock?.symbol}</span>
          <span style={{ color: "#aaa" }}>—</span>
          <span style={{ color: "#fff" }}>${(price ?? 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-2 flex-wrap">
        <span className="text-[10px] lg:text-xs shrink-0" style={{ color: "#aaa" }}>
          QTY:
        </span>
        {qtyPresets.map((q) => (
          <button
            key={q}
            onClick={() => setQty(q)}
            disabled={disabled}
            className="rounded-md px-2 py-1 lg:px-3 lg:py-1.5 font-bold text-xs lg:text-sm cursor-pointer transition-all border-none"
            style={{
              background: qty === q ? stock?.color : "rgba(255,255,255,0.08)",
              color: qty === q ? "#0a0e1a" : "#fff",
              fontFamily: "var(--font-mono)",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {q}
          </button>
        ))}
        <button
          onClick={() => setQty(Math.max(1, maxBuy))}
          disabled={disabled}
          className="rounded-md px-2 py-1 lg:px-3 lg:py-1.5 font-bold text-xs lg:text-sm cursor-pointer transition-all border-none"
          style={{
            background:
              qty === maxBuy && maxBuy > 0 ? stock?.color : "rgba(255,255,255,0.08)",
            color: qty === maxBuy && maxBuy > 0 ? "#0a0e1a" : "#fff",
            fontFamily: "var(--font-mono)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          MAX
        </button>
      </div>

      <div className="flex gap-2 lg:gap-3">
        <button
          onClick={() => handleTrade("buy")}
          disabled={disabled}
          className="flex-1 rounded-lg py-2.5 lg:py-3 text-sm lg:text-base font-bold cursor-pointer border-none tracking-wider"
          style={{
            background: "#76FF03",
            color: "#0a0e1a",
            fontFamily: "var(--font-pixel)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          BUY
        </button>
        <button
          onClick={() => handleTrade("sell")}
          disabled={sellDisabled}
          className="flex-1 rounded-lg py-2.5 lg:py-3 text-sm lg:text-base font-bold cursor-pointer border-none tracking-wider"
          style={{
            background: "#FF3D71",
            color: "#fff",
            fontFamily: "var(--font-pixel)",
            opacity: sellDisabled ? 0.45 : 1,
          }}
        >
          SELL
        </button>
      </div>

      <div className="text-[10px] lg:text-xs text-center space-y-0.5 lg:space-y-1" style={{ color: "#666" }}>
        <div>
          Cost: ${cost.toFixed(2)} · Max buy: {maxBuy}
          {safeHeld > 0 && (
            <span>
              {" "}
              · You hold: {safeHeld}
            </span>
          )}
        </div>
        {safeHeld === 0 && (
          <div style={{ color: "#888" }}>No shares of {stock?.symbol} — buy first to sell.</div>
        )}
        {safeHeld > 0 && qty > safeHeld && (
          <div style={{ color: "#FF9100" }}>Lower quantity — you only hold {safeHeld}.</div>
        )}
      </div>
    </div>
  );
}

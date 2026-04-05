import { STOCKS } from "../../shared/constants.js";
import MiniChart from "./MiniChart.jsx";

export default function StockCard({ index, price, history, holdings, selected, onSelect }) {
  const stock = STOCKS[index];
  const change =
    history && history.length > 1
      ? (((price - history[0]) / history[0]) * 100).toFixed(1)
      : "0.0";
  const isUp = parseFloat(change) >= 0;

  const frameBorder = selected ? stock.color : "rgba(82, 92, 108, 0.55)";

  return (
    <button
      onClick={() => onSelect(index)}
      className="rounded-sm p-2 text-left transition-all cursor-pointer border-[3px] border-double outline-none"
      style={{
        background: selected
          ? "linear-gradient(160deg, rgba(14,20,32,0.97) 0%, rgba(8,12,22,0.99) 100%)"
          : "linear-gradient(160deg, rgba(10,14,22,0.95) 0%, rgba(6,10,18,0.98) 100%)",
        borderColor: frameBorder,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 6px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex justify-between items-center">
        <span
          className="font-bold text-[10px] tracking-[0.12em] px-1 py-0.5 border"
          style={{
            fontFamily: "var(--font-pixel)",
            color: stock.color,
            borderColor: `${stock.color}66`,
            background: `${stock.color}10`,
          }}
        >
          {stock.symbol}
        </span>
        <span className="text-xs font-mono tabular-nums" style={{ color: isUp ? "#76FF03" : "#FF3D71" }}>
          {isUp ? "▲" : "▼"}
          {change}%
        </span>
      </div>
      <div className="text-base font-bold my-0.5 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
        ${price?.toFixed(2)}
      </div>
      <div
        className="mt-1 -mx-0.5 px-1 py-1"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(4,6,10,0.65) 100%)",
          border: `1px solid ${selected ? `${stock.color}40` : "rgba(255,255,255,0.09)"}`,
          boxShadow:
            "inset 0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <MiniChart history={history?.slice(-60)} color={stock.color} width={120} height={28} />
      </div>
      {holdings > 0 && (
        <div className="text-[10px] mt-1" style={{ color: "#aaa" }}>
          Holding: {holdings} shares
        </div>
      )}
    </button>
  );
}

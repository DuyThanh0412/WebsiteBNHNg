import { useState } from "react"
import type { RevenuePoint } from "../types"
import { formatCompactVND, formatVND } from "../utils/format"

interface RevenueChartProps {
  data: RevenuePoint[]
  timeframe: "today" | "7d" | "30d"
  onTimeframeChange: (tf: "today" | "7d" | "30d") => void
  showProfit?: boolean
}

export function RevenueChart({
  data,
  timeframe,
  onTimeframeChange,
  showProfit = true,
}: RevenueChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [mode, setMode] = useState<"area" | "bar">("area")

  const width = 760
  const height = 275
  const padLeft = 64
  const padRight = 18
  const padTop = 18
  const padBottom = 34

  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom

  const maxRev = Math.max(10_000_000, ...data.map((d) => d.revenue)) * 1.12
  const stepX = data.length > 1 ? plotW / (data.length - 1) : plotW

  const points = data.map((d, idx) => {
    const x = data.length === 1 ? padLeft + plotW / 2 : padLeft + idx * stepX
    const yRev = padTop + plotH - (d.revenue / maxRev) * plotH
    const yProfit = padTop + plotH - (Math.max(0, d.profit) / maxRev) * plotH
    return { x, yRev, yProfit, d }
  })

  const revPath = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yRev.toFixed(1)}`,
    )
    .join(" ")
  const profitPath = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yProfit.toFixed(1)}`,
    )
    .join(" ")
  const areaPath =
    points.length > 0
      ? `${revPath} L ${points[points.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : ""

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: maxRev * ratio,
    y: padTop + plotH - ratio * plotH,
  }))

  const labelStep = data.length > 16 ? 5 : data.length > 10 ? 2 : 1
  const activePoint =
    hoverIdx !== null && points[hoverIdx] ? points[hoverIdx] : null

  const totalRev = data.reduce((s, d) => s + d.revenue, 0)
  const totalProfit = data.reduce((s, d) => s + d.profit, 0)
  const totalOrders = data.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="w-full max-w-4xl self-start bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-display font-bold text-slate-900">
              {showProfit
                ? "Biểu đồ Doanh thu & Lợi nhuận gộp"
                : "Giá trị đơn đặt hàng"}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono tabular-nums">
              <span>
                Tổng kỳ:{" "}
                <strong className="text-slate-900">
                  {formatVND(totalRev)}
                </strong>
              </span>
              {showProfit && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Lợi nhuận:{" "}
                    <strong className="text-emerald-700">
                      {formatVND(totalProfit)}
                    </strong>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{totalOrders} đơn</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(["today", "7d", "30d"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onTimeframeChange(tf)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    timeframe === tf
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tf === "today"
                    ? "Hôm nay"
                    : tf === "7d"
                      ? "7 ngày"
                      : "30 ngày"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMode("area")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === "area"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Đường
              </button>
              <button
                type="button"
                onClick={() => setMode("bar")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === "bar"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cột
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-0.5 bg-blue-600 inline-block" />
            <span>Doanh thu bán hàng</span>
          </span>
          {showProfit && (
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
              <span>Lợi nhuận gộp</span>
            </span>
          )}
        </div>
      </div>

      {/* Interactive SVG Plot */}
      <div className="mt-3 relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-60 overflow-visible select-none"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="bbmRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={t.y}
                x2={width - padRight}
                y2={t.y}
                stroke="#E2E8F0"
                strokeDasharray={i === 0 ? undefined : "3 3"}
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={t.y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono tabular-nums"
              >
                {formatCompactVND(t.value)}
              </text>
            </g>
          ))}

          {mode === "area" ? (
            <>
              {areaPath && <path d={areaPath} fill="url(#bbmRevGrad)" />}
              {revPath && (
                <path
                  d={revPath}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
              )}
              {showProfit && profitPath && (
                <path
                  d={profitPath}
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  strokeLinejoin="round"
                />
              )}
            </>
          ) : (
            points.map((p, idx) => {
              const barWidth = Math.max(
                6,
                Math.min(26, (plotW / Math.max(1, data.length)) * 0.56),
              )
              const revH = Math.max(0, padTop + plotH - p.yRev)
              const profH = Math.max(0, padTop + plotH - p.yProfit)
              return (
                <g key={idx}>
                  <rect
                    x={p.x - barWidth / 2}
                    y={p.yRev}
                    width={barWidth}
                    height={revH}
                    rx="3"
                    fill={hoverIdx === idx ? "#1D4ED8" : "#2563EB"}
                    opacity="0.88"
                  />
                  {showProfit && (
                    <rect
                      x={p.x - barWidth / 2}
                      y={p.yProfit}
                      width={barWidth}
                      height={profH}
                      rx="3"
                      fill="#16A34A"
                      opacity="0.85"
                    />
                  )}
                </g>
              )
            })
          )}

          {points.map((p, idx) => {
            if (idx % labelStep !== 0 && idx !== points.length - 1) return null
            return (
              <text
                key={idx}
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-500 text-[10px] font-mono tabular-nums"
              >
                {p.d.label}
              </text>
            )
          })}

          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={padTop}
                x2={activePoint.x}
                y2={padTop + plotH}
                stroke="#94A3B8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.yRev}
                r="4.5"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {showProfit && (
                <circle
                  cx={activePoint.x}
                  cy={activePoint.yProfit}
                  r="4"
                  fill="#16A34A"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {points.map((p, idx) => {
            const sliceW = data.length > 1 ? stepX : plotW
            return (
              <rect
                key={idx}
                x={p.x - sliceW / 2}
                y={padTop}
                width={sliceW}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(idx)}
                className="cursor-crosshair"
              />
            )
          })}
        </svg>

        {activePoint && (
          <div className="mt-2 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs flex flex-wrap items-center justify-between gap-4 font-mono tabular-nums">
            <span className="font-semibold text-slate-200">
              {activePoint.d.label}
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <span>
                Doanh thu:{" "}
                <strong className="text-blue-300">
                  {formatVND(activePoint.d.revenue)}
                </strong>
              </span>
              {showProfit && (
                <>
                  <span>
                    Lợi nhuận:{" "}
                    <strong className="text-emerald-300">
                      {formatVND(activePoint.d.profit)}
                    </strong>
                  </span>
                  <span>
                    Phí kênh:{" "}
                    <strong className="text-amber-300">
                      {formatVND(activePoint.d.fees)}
                    </strong>
                  </span>
                </>
              )}
              <span>
                Đơn hàng:{" "}
                <strong className="text-white">{activePoint.d.orders}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

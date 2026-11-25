import type { RevenuePoint } from "../types"
// Order value, excluding cancellations; this is not accounting cash revenue.
export function buildRevenueSeries(
  orders: any[],
  timeframe: "today" | "7d" | "30d",
  now = new Date(),
): RevenuePoint[] {
  const count = timeframe === "today" ? 24 : timeframe === "7d" ? 7 : 30
  return Array.from({ length: count }, (_, i) => {
    const start = new Date(now)
    if (timeframe === "today") start.setHours(i, 0, 0, 0)
    else {
      start.setDate(start.getDate() - (count - i - 1))
      start.setHours(0, 0, 0, 0)
    }
    const end = new Date(start)
    if (timeframe === "today") end.setHours(end.getHours() + 1)
    else end.setDate(end.getDate() + 1)
    const items = orders.filter(
      (o) =>
        !["cancelled", "canceled"].includes(o.status) &&
        new Date(o.createdAt) >= start &&
        new Date(o.createdAt) < end,
    )
    return {
      label:
        timeframe === "today"
          ? `${i}h`
          : `${start.getDate()}/${start.getMonth() + 1}`,
      revenue: items.reduce((s, o) => s + (Number(o.total) || 0), 0),
      orders: items.length,
      profit: 0,
      fees: 0,
    }
  })
}

import { AlertTriangle, Cpu, ShoppingCart, Users } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import { fmt } from "../../shared/catalog"
import { useAdmin } from "../AdminContext"
import { RevenueChart } from "../components/RevenueChart"
import { buildRevenueSeries } from "../utils/metrics"
export default function OverviewPage() {
  const { products, orders, customers, statusPill, setSelectedOrderId } =
    useAdmin()
  const [timeframe, setTimeframe] = useState<"today" | "7d" | "30d">("7d")
  const lowStock = products.filter(
    (p) => p.show !== false && Number(p.stock) <= 5,
  )
  const cards = [
    {
      label: "Tổng đơn hàng",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Sản phẩm",
      value: products.length,
      icon: Cpu,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Khách hàng",
      value: customers.length,
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Sắp hết hàng",
      value: lowStock.length,
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
    },
  ]
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Tổng quan cửa hàng
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Theo dõi đơn hàng, sản phẩm và khách hàng của BigBangMart.
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <span className={`inline-flex rounded-xl p-2.5 ${color}`}>
              <Icon size={20} />
            </span>
            <p className="mt-4 text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold">
              {value.toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
      <RevenueChart
        data={buildRevenueSeries(orders, timeframe)}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        showProfit={false}
      />
      <p className="text-xs text-slate-500">
        Biểu đồ tính tổng giá trị đơn đặt hàng, loại trừ đơn đã hủy; chưa phản
        ánh tiền thực thu.
      </p>
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex justify-between border-b border-slate-100 p-5">
            <h3 className="font-bold">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-sm text-blue-600">
              Xem tất cả →
            </Link>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[550px] text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  {["Mã đơn", "Khách hàng", "Tổng tiền", "Trạng thái"].map(
                    (t) => (
                      <th className="px-5 py-3" key={t}>
                        {t}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o._id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold">
                      <Link
                        onClick={() => setSelectedOrderId(String(o._id))}
                        to="/admin/orders"
                        className="text-blue-600"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">{o.customer?.name}</td>
                    <td className="px-5 py-4">{fmt(Number(o.total))}</td>
                    <td className="px-5 py-4">{statusPill(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!orders.length && (
            <p className="p-8 text-center text-sm text-slate-500">
              Chưa có đơn hàng.
            </p>
          )}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex justify-between gap-2">
            <h3 className="font-bold">Cảnh báo tồn kho</h3>
            <Link to="/admin/inventory" className="text-sm text-blue-600">
              Xem kho →
            </Link>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {lowStock.slice(0, 6).map((p) => (
              <div
                key={p._id}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <span>{p.name}</span>
                <span className="shrink-0 font-bold text-amber-700">
                  {Number(p.stock) || 0}
                </span>
              </div>
            ))}
            {!lowStock.length && (
              <p className="py-6 text-sm text-slate-500">
                Chưa có cảnh báo tồn kho.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

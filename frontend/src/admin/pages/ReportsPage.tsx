import { Link } from "react-router"
import { fmt } from "../../shared/catalog"
import { useAdmin } from "../AdminContext"

export default function ReportsPage() {
  const {
    products,
    orders,
    customers,
    reportTab,
    setReportTab,
    selectedReportDay,
    setSelectedReportDay,
    currentSection,
    title,
    customerList,
    revenue,
    cancelledOrders,
    statusPill,
    reportDays,
    maxBar,
    tableHead,
    cardClass,
    emptyState,
  } = useAdmin()

  const itemsSold = orders.flatMap((order) => order.items || [])
  const bestSellers = Object.values(
    itemsSold.reduce((result: Record<string, any>, item: any) => {
      const name = item.name || "Sản phẩm"
      result[name] = result[name] || { name, quantity: 0 }
      result[name].quantity += Number(item.quantity) || 0
      return result
    }, {}),
  )
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 5) as { name: string; quantity: number }[]
  const totalPayments = orders.reduce(
    (result: Record<string, number>, order) => {
      const payment = order.paymentMethod === "bank" ? "Chuyển khoản" : "COD"
      result[payment] = (result[payment] || 0) + 1
      return result
    },
    {},
  )
  const selectedDayOrders = selectedReportDay
    ? orders
        .filter((order) => {
          if (!order.createdAt) return false
          const orderDate = new Date(order.createdAt)
          if (Number.isNaN(orderDate.getTime())) return false
          const orderDateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`
          return orderDateKey === selectedReportDay
        })
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        )
    : []
  const activeDayOrders = selectedDayOrders.filter(
    (order) =>
      !["cancelled", "canceled"].includes(String(order.status).toLowerCase()),
  )
  const selectedDayRevenue = activeDayOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  )
  const selectedDayProducts = Object.values(
    activeDayOrders
      .flatMap((order) => order.items || [])
      .reduce(
        (
          result: Record<string, {
            name: string
            quantity: number
            revenue: number
          }>,
          item: any,
        ) => {
          const name = item.name || "Sản phẩm"
          const key = String(item.productId || name)
          result[key] = result[key] || { name, quantity: 0, revenue: 0 }
          result[key].quantity += Number(item.quantity) || 0
          result[key].revenue +=
            (Number(item.price) || 0) * (Number(item.quantity) || 0)
          return result
        },
        {},
      ),
  )
  const selectedDayLabel = selectedReportDay
    ? new Date(`${selectedReportDay}T12:00:00`).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">
            {currentSection === "reports" ? "Báo cáo" : "Tổng quan"}
          </h2>
          <p className="mt-1 text-sm text-[#71809a]">
            Thống kê chi tiết dữ liệu của cửa hàng
          </p>
        </div>
        <span className="rounded-lg border border-[#dfe6f0] bg-white px-3 py-2 text-sm text-[#52617a]">
          {reportDays[0].label} – {reportDays[7].label}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Doanh thu",
            value: fmt(revenue),
            icon: "₫",
            color: "text-blue-600",
            href: "/admin/reports",
          },
          {
            label: "Tổng đơn hàng",
            value: orders.length,
            icon: "▤",
            color: "text-emerald-600",
            href: "/admin/orders",
          },
          {
            label: "Sản phẩm",
            value: products.length,
            icon: "▣",
            color: "text-violet-600",
            href: "/admin/products",
          },
          {
            label: "Đơn đã hủy",
            value: cancelledOrders,
            icon: "×",
            color: "text-red-600",
            href: "/admin/orders",
          },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className={`${cardClass} flex items-center justify-between p-4 transition hover:border-[#b9d3f7] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a6fdb]`}
          >
            <div>
              <p className="text-sm text-[#71809a]">{card.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{card.value}</p>
            </div>
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f6fb] text-xl font-bold ${card.color}`}
            >
              {card.icon}
            </span>
          </Link>
        ))}
      </div>
      <section className={`${cardClass} p-4 sm:p-5`}>
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["revenue", "Doanh thu"],
            ["orders", "Đơn hàng"],
            ["products", "Sản phẩm bán chạy"],
            ["customers", "Khách hàng"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setReportTab(key)}
              className={`border-b-2 px-3 py-2 text-sm ${
                reportTab === key
                  ? "border-[#1a6fdb] font-semibold text-[#1a6fdb]"
                  : "border-transparent text-[#71809a]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {reportTab === "revenue" || reportTab === "orders" ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h3 className="mb-3 text-sm font-bold">
                {reportTab === "revenue"
                  ? "Doanh thu theo ngày"
                  : "Đơn hàng theo ngày"}
              </h3>
              <div className="flex h-52 items-end gap-2 border-b border-[#e8edf5] px-2">
                {reportDays.map((day) => {
                  const value =
                    reportTab === "orders" ? day.orders : day.revenue
                  const selected = selectedReportDay === day.dateKey
                  return (
                    <button
                      key={day.dateKey}
                      type="button"
                      aria-label={`${day.label}: ${
                        reportTab === "orders"
                          ? `${value} đơn hàng`
                          : `doanh thu ${fmt(value)}`
                      }. Nhấn để xem chi tiết`}
                      aria-pressed={selected}
                      onClick={() => setSelectedReportDay(day.dateKey)}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2 rounded-t-md outline-none focus-visible:ring-2 focus-visible:ring-[#1a6fdb]"
                    >
                      <span className="sr-only">
                        {reportTab === "orders" ? `${value} đơn` : fmt(value)}
                      </span>
                      <span
                        title={
                          reportTab === "orders" ? `${value} đơn` : fmt(value)
                        }
                        className={`w-full max-w-12 rounded-t transition-colors ${
                          selected
                            ? "bg-[#1558b0]"
                            : "bg-[#1a6fdb] hover:bg-[#4289e8]"
                        }`}
                        style={{
                          height: `${Math.max(value ? (value / maxBar) * 78 : 0, value ? 8 : 2)}%`,
                        }}
                      />
                      <span
                        className={`pb-1 text-[10px] ${
                          selected
                            ? "font-bold text-[#1a6fdb]"
                            : "text-[#71809a]"
                        }`}
                      >
                        {day.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-[#71809a]">
                Chọn một cột để xem đơn hàng, sản phẩm đã bán và doanh thu trong
                ngày.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold">Tỷ lệ thanh toán</h3>
              <div className="flex items-center gap-5">
                <div
                  className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: orders.length
                      ? "conic-gradient(#1a6fdb 0deg 250deg, #22c55e 250deg 360deg)"
                      : "#e8edf5",
                  }}
                >
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                    <b className="text-xl">{orders.length}</b>
                    <span className="text-xs text-[#71809a]">đơn hàng</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-[#52617a]">
                  {Object.entries(totalPayments).length ? (
                    Object.entries(totalPayments).map(([method, count]) => (
                      <p key={method}>
                        <span className="mr-2 text-[#1a6fdb]">●</span>
                        {method}: {count} đơn
                      </p>
                    ))
                  ) : (
                    <p>Chưa có dữ liệu thanh toán.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : reportTab === "products" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {bestSellers.length
              ? bestSellers.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-lg border border-[#edf0f5] p-3"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1a6fdb]">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-semibold">
                      {item.name}
                    </span>
                    <b>{item.quantity} đã bán</b>
                  </div>
                ))
              : emptyState("Chưa có dữ liệu bán hàng.")}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {customerList.length ? customerList.slice(0, 8).map((customer) => (
                  <div
                    key={customer.key}
                    className="flex justify-between rounded-lg border border-[#edf0f5] p-3"
                  >
                    <div>
                      <b className="text-sm">{customer.name}</b>
                      <p className="text-xs text-[#71809a]">
                        {customer.email || customer.phone}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {customer.count} đơn
                    </span>
                  </div>
                )) : emptyState("Chưa có dữ liệu khách hàng.")}
          </div>
        )}
      </section>
      {selectedReportDay && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedReportDay(null)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-report-title"
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#e6eaf2] px-5 py-4 sm:px-6">
              <div>
                <h3 id="daily-report-title" className="text-lg font-bold">
                  Chi tiết bán hàng ngày {selectedDayLabel}
                </h3>
                <p className="mt-1 text-sm text-[#71809a]">
                  Đơn đã hủy không được tính vào doanh thu và sản phẩm đã bán.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReportDay(null)}
                aria-label="Đóng chi tiết doanh thu ngày"
                className="text-2xl leading-none text-[#71809a]"
              >
                ×
              </button>
            </header>
            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[#f3f7ff] p-4">
                  <p className="text-xs text-[#71809a]">Doanh thu trong ngày</p>
                  <p className="mt-1 text-xl font-extrabold text-[#1a6fdb]">
                    {fmt(selectedDayRevenue)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f3f7ff] p-4">
                  <p className="text-xs text-[#71809a]">Tổng đơn hàng</p>
                  <p className="mt-1 text-xl font-extrabold">
                    {selectedDayOrders.length}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f3f7ff] p-4">
                  <p className="text-xs text-[#71809a]">
                    Đơn được tính doanh thu
                  </p>
                  <p className="mt-1 text-xl font-extrabold">
                    {activeDayOrders.length}
                  </p>
                </div>
              </div>
              <h4 className="mb-2 font-bold">Sản phẩm đã bán</h4>
              {selectedDayProducts.length ? (
                <div className="mb-6 overflow-x-auto rounded-lg border border-[#e6eaf2]">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className={tableHead}>
                      <tr>
                        <th className="px-3 py-2.5">Sản phẩm</th>
                        <th className="px-3 py-2.5 text-right">Số lượng</th>
                        <th className="px-3 py-2.5 text-right">
                          Doanh thu sản phẩm
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDayProducts.map((item) => (
                        <tr
                          key={item.name}
                          className="border-t border-[#edf0f5]"
                        >
                          <td className="px-3 py-3 font-medium">{item.name}</td>
                          <td className="px-3 py-3 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-3 text-right font-semibold">
                            {fmt(item.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mb-6 rounded-lg bg-[#f7f9fc] p-4 text-sm text-[#71809a]">
                  Ngày này chưa có sản phẩm từ đơn hàng hợp lệ.
                </p>
              )}
              <h4 className="mb-2 font-bold">Đơn hàng trong ngày</h4>
              {selectedDayOrders.length ? (
                <div className="space-y-3">
                  {selectedDayOrders.map((order) => {
                    const isCancelled = ["cancelled", "canceled"].includes(
                      String(order.status).toLowerCase(),
                    )
                    return (
                      <article
                        key={order._id || order.orderNumber}
                        className="rounded-xl border border-[#e6eaf2] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#edf0f5] pb-3">
                          <div>
                            <p className="font-semibold">
                              {order.orderNumber || `Đơn #${order._id}`}
                            </p>
                            <p className="mt-1 text-xs text-[#71809a]">
                              {order.customer?.name || "Khách hàng"} ·{" "}
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleTimeString(
                                    "vi-VN",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )
                                : "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            {statusPill(order.status)}
                            <p
                              className={`mt-1 font-bold ${
                                isCancelled
                                  ? "text-[#71809a] line-through"
                                  : "text-[#1a6fdb]"
                              }`}
                            >
                              {fmt(Number(order.total) || 0)}
                            </p>
                          </div>
                        </div>
                        <ul className="mt-3 space-y-1.5 text-sm">
                          {(order.items || []).map(
                            (item: any, index: number) => (
                              <li
                                key={`${item.productId}-${index}`}
                                className="flex flex-wrap justify-between gap-x-4 gap-y-1"
                              >
                                <span>
                                  {item.name}{" "}
                                  <span className="text-[#71809a]">
                                    × {item.quantity}
                                  </span>
                                </span>
                                <span className="font-medium">
                                  {fmt(
                                    (Number(item.price) || 0) *
                                      (Number(item.quantity) || 0),
                                  )}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                        {isCancelled && (
                          <p className="mt-2 text-xs text-red-600">
                            Đơn đã hủy — không tính vào doanh thu.
                          </p>
                        )}
                      </article>
                    )
                  })}
                </div>
              ) : (
                <p className="rounded-lg bg-[#f7f9fc] p-4 text-sm text-[#71809a]">
                  Không có đơn hàng trong ngày này.
                </p>
              )}
            </div>
            <footer className="flex justify-end border-t border-[#e6eaf2] px-5 py-3">
              <button
                type="button"
                onClick={() => setSelectedReportDay(null)}
                className="rounded-lg bg-[#1a6fdb] px-5 py-2 text-sm font-semibold text-white"
              >
                Đóng
              </button>
            </footer>
          </section>
        </div>
      )}
      {currentSection === "overview" && (
        <section className={`${cardClass} p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">Đơn hàng gần đây</h3>
            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-[#1a6fdb]"
            >
              Xem tất cả →
            </Link>
          </div>
          {orders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className={tableHead}>
                  <tr>
                    {["Mã đơn", "Khách hàng", "Tổng tiền", "Trạng thái"].map(
                      (item) => (
                        <th className="px-2 py-2" key={item}>
                          {item}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-t border-[#edf0f5]">
                      <td className="px-2 py-3 font-semibold">
                        {order.orderNumber}
                      </td>
                      <td className="px-2 py-3">{order.customer?.name}</td>
                      <td className="px-2 py-3">
                        {fmt(Number(order.total) || 0)}
                      </td>
                      <td className="px-2 py-3">{statusPill(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            emptyState("Chưa có đơn hàng nào.")
          )}
        </section>
      )}
    </>
  )
}

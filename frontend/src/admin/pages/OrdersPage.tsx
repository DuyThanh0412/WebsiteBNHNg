import { fmt } from "../../shared/catalog"
import { useAdmin } from "../AdminContext"

export default function OrdersPage() {
  const {
    orders,
    setSelectedOrderId,
    setOrderPrintPreviewOpen,
    statuses,
    cancelledOrders,
    filteredOrders,
    selectedOrder,
    statusPill,
    updateOrderStatus,
    beginEditOrder,
    tableHead,
    cardClass,
    emptyState,
    searchBox,
    filterSelect,
  } = useAdmin()
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <p className="mt-1 text-sm text-[#71809a]">
          Theo dõi và xử lý đơn đặt hàng của khách hàng
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng đơn hàng", orders.length, "bg-blue-50 text-blue-600"],
          [
            "Đơn chờ giao",
            orders.filter((order) =>
              ["pending", "processing"].includes(order.status),
            ).length,
            "bg-amber-50 text-amber-600",
          ],
          [
            "Đơn đã giao",
            orders.filter((order) => order.status === "delivered").length,
            "bg-emerald-50 text-emerald-600",
          ],
          ["Đơn hủy", cancelledOrders, "bg-red-50 text-red-600"],
        ].map(([label, value, color]) => (
          <div
            key={String(label)}
            className={`${cardClass} flex items-center gap-3 p-4`}
          >
            <span className={`rounded-full p-3 ${color}`}>▤</span>
            <div>
              <p className="text-xs text-[#71809a]">{label}</p>
              <b className="text-xl">{value}</b>
            </div>
          </div>
        ))}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-[#edf0f5] p-3">
            {searchBox("Tìm mã đơn, tên khách hàng, SĐT...")}
            {filterSelect([
              { value: "all", label: "Tất cả trạng thái" },
              ...statuses,
            ])}
          </div>
          <div className="max-h-[620px] overflow-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className={`${tableHead} sticky top-0`}>
                <tr>
                  {[
                    "Mã đơn",
                    "Khách hàng",
                    "Ngày đặt",
                    "Tổng tiền",
                    "Trạng thái",
                    "",
                  ].map((item, index) => (
                    <th className="px-2 py-3" key={`${item}-${index}`}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id || index}
                    onClick={() => setSelectedOrderId(String(order._id))}
                    className={`cursor-pointer border-t border-[#edf0f5] ${
                      String(order._id) === String(selectedOrder?._id)
                        ? "bg-[#edf4ff]"
                        : "hover:bg-[#f9fbfe]"
                    }`}
                  >
                    <td className="px-2 py-3 font-semibold">
                      {order.orderNumber || order._id}
                    </td>
                    <td className="px-2 py-3">{order.customer?.name || "—"}</td>
                    <td className="px-2 py-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-2 py-3">
                      {fmt(Number(order.total) || 0)}
                    </td>
                    <td className="px-2 py-3">{statusPill(order.status)}</td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedOrderId(String(order._id))
                        }}
                        className="rounded border px-2 py-1"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredOrders.length && emptyState("Chưa có đơn hàng phù hợp.")}
          </div>
        </section>
        {selectedOrder ? (
          <section className={`${cardClass} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#edf0f5] pb-4">
              <div>
                <h3 className="font-bold">
                  Chi tiết đơn hàng #
                  {selectedOrder.orderNumber || selectedOrder._id}
                </h3>
                <p className="mt-1 text-xs text-[#71809a]">
                  Đặt hàng:{" "}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN")
                    : "—"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => beginEditOrder(selectedOrder)}
                  className="rounded-md border border-[#dfe6f0] px-3 py-2 text-xs font-semibold text-[#1a6fdb] hover:bg-[#f4f8ff]"
                >
                  ✎ Chỉnh sửa đơn
                </button>
                <select
                  aria-label="Cập nhật trạng thái đơn hàng"
                  value={selectedOrder.status || "pending"}
                  onChange={(event) =>
                    updateOrderStatus(selectedOrder, event.target.value)
                  }
                  className="rounded-md border border-[#dfe6f0] px-2 py-2 text-xs"
                >
                  {statuses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 py-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-[#71809a]">
                  Thông tin khách hàng
                </h4>
                <p className="font-semibold">
                  {selectedOrder.customer?.name || "—"}
                </p>
                <p className="mt-1 text-sm text-[#71809a]">
                  {selectedOrder.customer?.phone || "—"}
                </p>
                <p className="text-sm text-[#71809a]">
                  {selectedOrder.customer?.email || "—"}
                </p>
                <p className="mt-1 text-sm text-[#71809a]">
                  {selectedOrder.customer?.address || "—"}
                </p>
                {selectedOrder.customer?.note && (
                  <p className="mt-2 text-sm text-[#71809a]">
                    Ghi chú: {selectedOrder.customer.note}
                  </p>
                )}
              </div>
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-[#71809a]">
                  Thanh toán
                </h4>
                <p>
                  {{
                    cod: "Thanh toán khi nhận hàng",
                    bank: "Chuyển khoản ngân hàng",
                    deposit: "Đặt cọc qua chuyển khoản",
                    card: "Thẻ tín dụng / ghi nợ",
                  }[(selectedOrder.paymentMethod as string)] ||
                    "Thanh toán khi nhận hàng"}
                </p>
                {selectedOrder.paymentMethod === "deposit" && (
                  <p className="mt-1 text-sm font-semibold text-[#1a6fdb]">
                    Tiền cọc: {fmt(Number(selectedOrder.depositAmount) || 0)}
                  </p>
                )}
                {["paid", "partial"].includes(selectedOrder.paymentStatus) && (
                  <p className="mt-2 text-xs text-[#71809a]">
                    Thanh toán: {statusPill(selectedOrder.paymentStatus)}
                    {Number(selectedOrder.paidAmount) > 0 &&
                      ` · Đã nhận ${fmt(Number(selectedOrder.paidAmount))}`}
                  </p>
                )}
                <p className="mt-1 text-xs text-[#71809a]">
                  Trạng thái đơn: {statusPill(selectedOrder.status)}
                </p>
                {selectedOrder.couponCode && (
                  <p className="mt-1 text-xs text-[#71809a]">
                    Mã khuyến mãi: {selectedOrder.couponCode}
                  </p>
                )}
              </div>
            </div>
            <h4 className="mb-2 text-sm font-bold">Sản phẩm trong đơn</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-xs">
                <thead className={tableHead}>
                  <tr>
                    {["Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"].map(
                      (item) => (
                        <th className="px-2 py-2" key={item}>
                          {item}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map(
                    (item: any, index: number) => (
                      <tr
                        key={`${item.productId}-${index}`}
                        className="border-t border-[#edf0f5]"
                      >
                        <td className="px-2 py-3">{item.name}</td>
                        <td className="px-2 py-3">{item.quantity}</td>
                        <td className="px-2 py-3">
                          {fmt(Number(item.price) || 0)}
                        </td>
                        <td className="px-2 py-3 font-semibold">
                          {fmt(
                            (Number(item.price) || 0) *
                              (Number(item.quantity) || 0),
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end border-t border-[#edf0f5] pt-4 text-right">
              <div>
                <span className="text-sm text-[#71809a]">Tổng thanh toán</span>
                <p className="text-xl font-extrabold text-[#1a6fdb]">
                  {fmt(Number(selectedOrder.total) || 0)}
                </p>
                {Number(selectedOrder.discount) > 0 && (
                  <p className="text-xs text-[#71809a]">
                    Đã giảm: {fmt(Number(selectedOrder.discount))}
                  </p>
                )}
                <p className="text-xs text-[#71809a]">
                  Phí vận chuyển: {fmt(Number(selectedOrder.shippingFee) || 0)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setOrderPrintPreviewOpen(true)}
                className="rounded-lg border border-[#dfe6f0] px-3 py-2 text-sm"
              >
                In đơn hàng
              </button>
              <button
                type="button"
                onClick={() => updateOrderStatus(selectedOrder, "cancelled")}
                disabled={selectedOrder.status === "cancelled"}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50"
              >
                Hủy đơn
              </button>
            </div>
          </section>
        ) : (
          <section className={`${cardClass}`}>
            {emptyState("Chọn một đơn hàng để xem chi tiết.")}
          </section>
        )}
      </div>
    </>
  )
}

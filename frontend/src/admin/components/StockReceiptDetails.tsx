import { useEffect, useRef } from "react"
import { CheckCircle2, X, XCircle } from "lucide-react"
import { fmt } from "../../shared/catalog"
import type { ReceiptRecord, SupplierRecord } from "../hooks/useWarehouse"

const statuses = {
  pending: "Chờ duyệt nhập kho",
  approving: "Đang duyệt — cần tiếp tục",
  approved: "Đã nhập kho",
  cancelled: "Đã hủy",
}
const date = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

export default function StockReceiptDetails({
  receipt,
  supplier,
  products,
  busy,
  onClose,
  onApprove,
  onCancel,
}: {
  receipt: ReceiptRecord
  supplier?: SupplierRecord
  products: {
    _id: string
    sku?: string
  }[]
  busy: boolean
  onClose: () => void
  onApprove: () => void
  onCancel: () => void
}) {
  const panel = useRef<HTMLElement>(null)
  useEffect(() => {
    panel.current?.focus({ preventScroll: true })
    panel.current?.scrollIntoView?.({ behavior: "smooth", block: "start" })
  }, [receipt._id])
  const totalQuantity = receipt.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )
  return (
    <section
      ref={panel}
      tabIndex={-1}
      aria-label={`Chi tiết phiếu nhập ${receipt.code}`}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm outline-none sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Chi tiết phiếu nhập #{receipt.code}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Ngày lập: {date(receipt.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              receipt.status === "approved"
                ? "bg-emerald-50 text-emerald-700"
                : receipt.status === "cancelled"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-amber-50 text-amber-700"
            }`}
          >
            {statuses[receipt.status]}
          </span>
          <button
            type="button"
            aria-label="Đóng chi tiết phiếu nhập"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="grid gap-6 py-5 text-sm sm:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-slate-500">
            Thông tin nhà cung cấp
          </h4>
          <p className="font-semibold text-slate-900">{receipt.supplierName}</p>
          <dl className="space-y-2 text-slate-600">
            <div>
              <dt className="inline text-slate-500">Người liên hệ: </dt>
              <dd className="inline">
                {supplier?.contactName || "Chưa có thông tin"}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Điện thoại: </dt>
              <dd className="inline">
                {supplier?.phone || "Chưa có thông tin"}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Email: </dt>
              <dd className="inline break-all">
                {supplier?.email || "Chưa có thông tin"}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Địa chỉ: </dt>
              <dd className="inline">
                {supplier?.address || "Chưa có thông tin"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-slate-500">
            Thông tin nhập hàng
          </h4>
          <dl className="space-y-2 text-slate-600">
            <div>
              <dt className="inline text-slate-500">Kho nhận: </dt>
              <dd className="inline font-medium text-slate-900">
                {receipt.warehouse || "Chưa ghi kho nhận"}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Người lập: </dt>
              <dd className="inline">
                {receipt.createdBy || "Chưa ghi người lập"}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Người duyệt: </dt>
              <dd className="inline">
                {receipt.approvedBy || "Chưa ghi người duyệt"}
              </dd>
            </div>
            {receipt.approvedAt && (
              <div>
                <dt className="inline text-slate-500">Ngày nhập kho: </dt>
                <dd className="inline">{date(receipt.approvedAt)}</dd>
              </div>
            )}
            <div>
              <dt className="inline text-slate-500">Tổng số lượng: </dt>
              <dd className="inline">
                {totalQuantity} sản phẩm / {receipt.items.length} mặt hàng
              </dd>
            </div>
          </dl>
          <p className="pt-1 text-xs text-slate-500">
            {receipt.status === "approved"
              ? "Hàng đã được cộng vào tồn kho."
              : receipt.status === "cancelled"
                ? "Phiếu đã hủy, không nhập hàng vào kho."
                : "Phiếu được cộng tồn khi hoàn tất duyệt nhập kho."}
          </p>
        </div>
      </div>
      {receipt.note && (
        <p className="mb-5 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Ghi chú: {receipt.note}
        </p>
      )}
      <h4 className="mb-3 text-sm font-bold">Sản phẩm trong phiếu nhập</h4>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-y border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3 font-semibold">Sản phẩm / SKU</th>
              <th className="px-3 py-3 text-right font-semibold">Số lượng</th>
              <th className="px-3 py-3 text-right font-semibold">
                Đơn giá nhập
              </th>
              <th className="px-3 py-3 text-right font-semibold">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item) => (
              <tr key={item.productId} className="border-b border-slate-100">
                <td className="px-3 py-4">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {products.find((p) => p._id === item.productId)?.sku ||
                      "Chưa có SKU"}
                  </p>
                </td>
                <td className="px-3 py-4 text-right tabular-nums">
                  {item.quantity.toLocaleString("vi-VN")}
                </td>
                <td className="px-3 py-4 text-right tabular-nums">
                  {fmt(item.unitCost)}
                </td>
                <td className="px-3 py-4 text-right font-semibold tabular-nums">
                  {fmt(item.quantity * item.unitCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="text-sm text-slate-500">Tổng giá trị nhập hàng</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-blue-600">
            {fmt(receipt.totalCost)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tổng tiền hàng theo đơn giá nhập trên phiếu.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {["pending", "approving"].includes(receipt.status) && (
            <button
              disabled={busy}
              onClick={onApprove}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <CheckCircle2 size={15} className="mr-2 inline" />
              {receipt.status === "approving"
                ? "Tiếp tục duyệt"
                : "Duyệt nhập kho"}
            </button>
          )}
          {receipt.status === "pending" && (
            <button
              disabled={busy}
              onClick={onCancel}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 disabled:opacity-50"
            >
              <XCircle size={15} className="mr-2 inline" />
              Hủy phiếu
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
          >
            Đóng chi tiết
          </button>
        </div>
      </div>
    </section>
  )
}

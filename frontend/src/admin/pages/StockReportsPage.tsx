import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Download, Plus } from "lucide-react"
import { useAdmin } from "../AdminContext"
import { warehouseApi, type WarehouseState } from "../hooks/useWarehouse"

interface ReportRow {
  productId: string
  name: string
  opening: number
  incoming: number
  outgoing: number
  closing: number
  current: number
}
interface Movement {
  id: string
  productId: string
  productName: string
  type: string
  quantityDelta: number
  stockBefore: number
  stockAfter: number
  reference: string
  reason: string
  createdAt: string
}
const labels: Record<string, string> = {
  import: "Nhập NCC",
  export: "Xuất kho",
  adjust_in: "Điều chỉnh tăng",
  adjust_out: "Điều chỉnh giảm",
  adjustment: "Sửa tồn sản phẩm",
}
const input = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
const button =
  "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
function createStockRequestId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()

  // On HTTP LAN addresses, getRandomValues is available even without randomUUID.
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-")
}

export default function StockReportsPage({
  warehouse,
}: {
  warehouse?: WarehouseState
}) {
  const { products, orders, refreshData } = useAdmin()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [report, setReport] = useState<{
    rows: ReportRow[]
    movements: Movement[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    productId: "",
    quantity: 1,
    type: "export",
    reason: "",
  })
  const [requestId, setRequestId] = useState(createStockRequestId)
  const [success, setSuccess] = useState("")
  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    setReport(null)
    try {
      if ((from || to) && (!from || !to || from > to))
        throw new Error("Vui lòng chọn khoảng ngày hợp lệ.")
      const data = await warehouseApi(
        from && to ? `/stock-report?from=${from}&to=${to}` : "/stock-report",
      )
      setReport(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [from, to])
  useEffect(() => {
    void load()
  }, [load])
  const rows = (report?.rows || []).map((r) => {
    const product = products.find((p) => String(p._id) === r.productId)
    const reserved = orders
      .filter((o) => ["pending", "processing"].includes(o.status))
      .flatMap((o) => o.items || [])
      .filter((i) => String(i.productId) === r.productId)
      .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
    const moves = (report?.movements || []).filter(
      (m) => m.productId === r.productId,
    )
    const adjustment = moves
      .filter((m) => ["adjust_in", "adjust_out", "adjustment"].includes(m.type))
      .reduce((sum, m) => sum + m.quantityDelta, 0)
    const positiveAdjustment = moves
      .filter(
        (m) =>
          ["adjust_in", "adjustment"].includes(m.type) && m.quantityDelta > 0,
      )
      .reduce((sum, m) => sum + m.quantityDelta, 0)
    const negativeAdjustment = -moves
      .filter(
        (m) =>
          ["adjust_out", "adjustment"].includes(m.type) && m.quantityDelta < 0,
      )
      .reduce((sum, m) => sum + m.quantityDelta, 0)
    const available = Math.max(0, (r.current ?? r.closing) - reserved)
    const minStock = Number(product?.minStock ?? 5)
    return {
      ...r,
      sku: product?.sku || "Chưa có SKU",
      category: product?.category || "—",
      reserved,
      minStock,
      available,
      adjustment,
      imports: r.incoming - positiveAdjustment,
      exports: r.outgoing - negativeAdjustment,
    }
  })
  const totals = rows.reduce(
    (sum, r) => ({
      stock: sum.stock + r.available,
      reserved: sum.reserved + r.reserved,
      incoming: sum.incoming + r.imports,
      outgoing: sum.outgoing + r.exports,
      adjustment: sum.adjustment + r.adjustment,
      low: sum.low + Number(r.available < r.minStock),
    }),
    { stock: 0, reserved: 0, incoming: 0, outgoing: 0, adjustment: 0, low: 0 },
  )
  const approvedCount =
    warehouse?.receipts.filter((r) => r.status === "approved").length ??
    new Set(
      (report?.movements || [])
        .filter((m) => m.type === "import")
        .map((m) => m.reference),
    ).size
  function exportCsv() {
    if (!report) return
    const escape = (v: unknown) =>
      `"${String(v)
        .replace(/"/g, '""')
        .replace(/^[=+@-]/, "'$&")}"`
    const csv = [
      [
        "SKU",
        "Sản phẩm",
        "Danh mục",
        "Tổng nhập",
        "Tổng xuất",
        "Điều chỉnh",
        "Tồn khả dụng",
        "Giữ đơn",
        "Định mức",
      ],
      ...rows.map((r) => [
        r.sku,
        r.name,
        r.category,
        r.imports,
        r.exports,
        r.adjustment,
        r.available,
        r.reserved,
        r.minStock,
      ]),
    ]
      .map((r) => r.map(escape).join(","))
      .join("\r\n")
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `nhap-xuat-ton-${from}-${to}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setSuccess("")
    try {
      await warehouseApi("/stock-movements", { ...form, requestId })
      setSuccess("Đã ghi nhận giao dịch và cập nhật tồn kho.")
      setShowForm(false)
      setRequestId(createStockRequestId())
      setForm({ productId: "", quantity: 1, type: "export", reason: "" })
      refreshData()
      await load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-6">
        <div>
          <h2 className="text-base font-bold">
            Báo cáo Nhập / Xuất / Tồn kho theo SKU
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Tổng hợp số lượng nhập kho, xuất kho, kiểm kê điều chỉnh và tồn khả
            dụng tại BigBangMart (không bao gồm dữ liệu tài chính)
          </p>
        </div>
        <button
          className={button + " !rounded-xl !text-xs"}
          disabled={!report || loading}
          onClick={exportCsv}
        >
          <Download size={15} className="mr-2 inline" />
          Xuất báo cáo Nhập/Xuất/Tồn (CSV)
        </button>
      </div>
      {report && (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">Tổng tồn kho hiện tại</p>
            <strong className="mt-2 block font-mono text-xl">
              {totals.stock} SP
            </strong>
            <p className="mt-2 font-mono text-xs text-slate-500">
              Đang giữ đơn: {totals.reserved} SP
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">
              Tổng số lượng đã nhập / hoàn
            </p>
            <strong className="mt-2 block font-mono text-xl text-emerald-700">
              +{totals.incoming} SP
            </strong>
            <p className="mt-2 font-mono text-xs text-slate-500">
              {approvedCount} phiếu nhập đã duyệt
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">Tổng số lượng đã xuất kho</p>
            <strong className="mt-2 block font-mono text-xl text-blue-600">
              -{totals.outgoing} SP
            </strong>
            <p className="mt-2 font-mono text-xs text-slate-500">
              Điều chỉnh kiểm kho: {totals.adjustment > 0 ? "+" : ""}
              {totals.adjustment}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">Cảnh báo dưới định mức</p>
            <strong className="mt-2 block font-mono text-xl text-red-600">
              {totals.low} SKU
            </strong>
            <p className="mt-2 text-xs text-slate-500">
              Trên tổng {rows.length} SKU đang quản lý
            </p>
          </div>
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-emerald-700">
          {success}
        </p>
      )}
      {showForm && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <fieldset disabled={busy} className="space-y-4">
            <h3 className="font-bold">Ghi nhận giao dịch kho</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span className="block">Sản phẩm</span>
                <select
                  required
                  className={input + " w-full"}
                  value={form.productId}
                  onChange={(e) => {
                    setRequestId(createStockRequestId())
                    setForm({ ...form, productId: e.target.value })
                  }}
                >
                  <option value="">Chọn sản phẩm</option>
                  {products
                    .filter((p) => p._id)
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (tồn {p.stock || 0})
                      </option>
                    ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="block">Loại giao dịch</span>
                <select
                  className={input + " w-full"}
                  value={form.type}
                  onChange={(e) => {
                    setRequestId(createStockRequestId())
                    setForm({ ...form, type: e.target.value })
                  }}
                >
                  {["export", "adjust_in", "adjust_out"].map((t) => (
                    <option key={t} value={t}>
                      {labels[t]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="block">Số lượng</span>
                <input
                  required
                  className={input + " w-full"}
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => {
                    setRequestId(createStockRequestId())
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }}
                />
              </label>
            </div>
            <label className="block space-y-1 text-sm">
              <span>Lý do / mã đơn liên quan *</span>
              <input
                required
                className={input + " w-full"}
                value={form.reason}
                onChange={(e) => {
                  setRequestId(createStockRequestId())
                  setForm({ ...form, reason: e.target.value })
                }}
              />
            </label>
            <div className="flex gap-3">
              <button className={button} disabled={busy}>
                {busy ? "Đang lưu..." : "Lưu giao dịch"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setShowForm(false)}
              >
                Đóng
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {loading && <p className="text-sm text-slate-500">Đang tải báo cáo...</p>}
      {report && (
        <>
          <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <h3 className="border-b border-slate-200 px-5 py-4 text-sm font-semibold">
              Bảng tổng hợp Nhập – Xuất – Tồn chi tiết theo sản phẩm
            </h3>
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500">
                <tr>
                  {[
                    "SKU / Sản phẩm",
                    "Danh mục",
                    "Tổng nhập",
                    "Tổng xuất",
                    "Điều chỉnh",
                    "Tồn khả dụng",
                    "Giữ đơn / Min",
                    "Tình trạng",
                  ].map((h, i) => (
                    <th
                      className={
                        "px-4 py-3 font-semibold " +
                        (i > 1 && i < 7 ? "text-right" : "")
                      }
                      key={h}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.productId} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{r.name}</p>
                      <p className="mt-1 font-mono text-slate-400">{r.sku}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{r.category}</td>
                    <td className="px-4 py-4 text-right font-mono font-semibold text-emerald-700">
                      +{r.imports}
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-semibold text-blue-600">
                      -{r.exports}
                    </td>
                    <td className="px-4 py-4 text-right font-mono">
                      {r.adjustment >= 0 ? "+" : ""}
                      {r.adjustment}
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold">
                      {r.available}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-slate-500">
                      {r.reserved} / {r.minStock}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={
                          "whitespace-nowrap rounded border px-2 py-0.5 " +
                          (r.available < r.minStock
                            ? "border-amber-200 bg-amber-50 text-amber-600"
                            : "border-emerald-200 bg-emerald-50 text-emerald-600")
                        }
                      >
                        {r.available < r.minStock ? "Dưới định mức" : "An toàn"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-500">
                      Chưa có sản phẩm trong kho.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          <details className="rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-xs font-medium text-slate-500">
              Lọc theo ngày & thao tác kho
            </summary>
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <label className="space-y-1 text-sm">
                  <span className="block">Từ ngày</span>
                  <input
                    className={input}
                    type="date"
                    value={from}
                    max={to}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="block">Đến ngày</span>
                  <input
                    className={input}
                    type="date"
                    value={to}
                    min={from}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </label>
                <button className={input} disabled={loading} onClick={load}>
                  Làm mới báo cáo
                </button>
              </div>

              <button className={button} onClick={() => setShowForm(true)}>
                <Plus size={15} className="mr-2 inline" />
                Ghi nhận xuất / điều chỉnh
              </button>
              <p className="text-xs text-slate-500">
                Tồn khả dụng = tồn hiện tại trừ số lượng của đơn chờ xác nhận /
                đang chuẩn bị. Mặc định định mức là 5 nếu sản phẩm chưa có định
                mức riêng. Xuất kho vẫn ghi nhận thủ công.
              </p>
            </div>
          </details>
          <details className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <summary className="cursor-pointer p-4 text-xs font-medium text-slate-500">
              Nhật ký nhập / xuất / điều chỉnh
            </summary>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Thời gian",
                    "Sản phẩm",
                    "Loại",
                    "Thay đổi",
                    "Trước → Sau",
                    "Tham chiếu / Lý do",
                  ].map((h) => (
                    <th key={h} className="p-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.movements.map((m) => (
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className="p-4">
                      {new Date(m.createdAt).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </td>
                    <td className="p-4">{m.productName}</td>
                    <td className="p-4">{labels[m.type] || m.type}</td>
                    <td
                      className={`p-4 font-bold ${
                        m.quantityDelta > 0
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      {m.quantityDelta > 0 ? "+" : ""}
                      {m.quantityDelta}
                    </td>
                    <td className="p-4">
                      {m.stockBefore} → {m.stockAfter}
                    </td>
                    <td className="p-4">
                      <p>{m.reference}</p>
                      <p className="text-slate-500">{m.reason}</p>
                    </td>
                  </tr>
                ))}
                {!report.movements.length && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Chưa có giao dịch kho trong khoảng ngày đã chọn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </details>
        </>
      )}
    </>
  )
}

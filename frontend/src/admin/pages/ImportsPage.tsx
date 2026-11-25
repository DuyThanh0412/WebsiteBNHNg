import { useState, type FormEvent } from "react"
import { Plus, CheckCircle2, XCircle, Trash2 } from "lucide-react"
import { fmt } from "../../shared/catalog"
import { useAdmin } from "../AdminContext"
import StockReceiptDetails from "../components/StockReceiptDetails"
import {
  warehouseApi,
  type SupplierRecord,
  type WarehouseState,
} from "../hooks/useWarehouse"

const input =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
const primary =
  "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
const blankSupplier = {
  name: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
}
const statusLabels = {
  pending: "Chờ duyệt",
  approving: "Đang duyệt — cần tiếp tục",
  approved: "Đã nhập kho",
  cancelled: "Đã hủy",
}
export default function ImportsPage({
  warehouse,
}: {
  warehouse: WarehouseState
}) {
  const { products, refreshData, context } = useAdmin()
  const [tab, setTab] = useState<"receipts" | "suppliers">("receipts")
  const [supplierForm, setSupplierForm] = useState(false)
  const [supplierId, setSupplierId] = useState("")
  const [supplier, setSupplier] = useState(blankSupplier)
  const [receiptForm, setReceiptForm] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [note, setNote] = useState("")
  const [warehouseName, setWarehouseName] = useState("")
  const [items, setItems] = useState([
    { productId: "", quantity: 1, unitCost: 0 },
  ])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [expanded, setExpanded] = useState("")
  const selectedReceipt = warehouse.receipts.find((r) => r._id === expanded)
  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError("")
    setSuccess("")
    try {
      await action()
      await warehouse.refresh()
      refreshData()
      setSuccess("Đã lưu thay đổi.")
    } catch (e) {
      setError((e as Error).message)
      await warehouse.refresh()
      refreshData()
    } finally {
      setBusy(false)
    }
  }
  function editSupplier(s?: SupplierRecord) {
    setSupplierId(s?._id || "")
    setSupplier(
      s
        ? {
            name: s.name,
            contactName: s.contactName || "",
            phone: s.phone || "",
            email: s.email || "",
            address: s.address || "",
          }
        : blankSupplier,
    )
    setSupplierForm(true)
  }
  function saveSupplier(e: FormEvent) {
    e.preventDefault()
    void run(async () => {
      await warehouseApi(
        `/suppliers${supplierId ? `/${supplierId}` : ""}`,
        supplier,
        supplierId ? "PUT" : "POST",
      )
      setSupplierForm(false)
    })
  }
  function saveReceipt(e: FormEvent) {
    e.preventDefault()
    void run(async () => {
      await warehouseApi("/stock-imports", {
        supplierId: selectedSupplier,
        items,
        note,
        warehouse: warehouseName,
        createdBy: context.user.name,
      })
      setReceiptForm(false)
      setItems([{ productId: "", quantity: 1, unitCost: 0 }])
      setNote("")
      setSelectedSupplier("")
    })
  }
  return (
    <>
      <h2 className="sr-only">Nhập hàng & NCC</h2>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
          <button
            className={
              tab === "receipts"
                ? "rounded-lg bg-white px-3 py-2 shadow-sm"
                : "px-3 py-2 text-slate-500"
            }
            onClick={() => setTab("receipts")}
          >
            Phiếu nhập hàng ({warehouse.receipts.length})
          </button>
          <button
            aria-label="Nhà cung cấp"
            className={
              tab === "suppliers"
                ? "rounded-lg bg-white px-3 py-2 shadow-sm"
                : "px-3 py-2 text-slate-500"
            }
            onClick={() => setTab("suppliers")}
          >
            Nhà cung cấp ({warehouse.suppliers.length})
          </button>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Thêm nhà cung cấp"
            disabled={busy || warehouse.loading || !!warehouse.error}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-600 disabled:opacity-50"
            onClick={() => editSupplier()}
          >
            + Thêm NCC
          </button>
          <button
            aria-label="Tạo phiếu nhập"
            className={primary + " !rounded-xl !text-xs"}
            disabled={busy || warehouse.loading || !!warehouse.error}
            onClick={() => setReceiptForm(true)}
          >
            <Plus size={15} className="mr-2 inline" />
            Tạo phiếu nhập hàng
          </button>
        </div>
      </div>
      {(error || warehouse.error) && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error || warehouse.error}{" "}
          <button className="underline" onClick={warehouse.refresh}>
            Thử lại
          </button>
        </div>
      )}
      {success && (
        <p role="status" className="text-sm text-emerald-700">
          {success}
        </p>
      )}
      {tab === "receipts" && selectedReceipt && (
        <StockReceiptDetails
          receipt={selectedReceipt}
          supplier={warehouse.suppliers.find((s) =>
            selectedReceipt.supplierId
              ? s._id === selectedReceipt.supplierId
              : s.name === selectedReceipt.supplierName,
          )}
          products={products}
          busy={busy}
          onClose={() => setExpanded("")}
          onApprove={() =>
            void run(async () => {
              await warehouseApi(
                `/stock-imports/${selectedReceipt._id}/approve`,
                { approvedBy: context.user.name },
              )
            })
          }
          onCancel={() =>
            void run(async () => {
              await warehouseApi(
                `/stock-imports/${selectedReceipt._id}/cancel`,
                {},
              )
            })
          }
        />
      )}
      {supplierForm && (
        <form
          onSubmit={saveSupplier}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h3 className="font-bold">
            {supplierId ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ["name", "Tên nhà cung cấp"],
              ["contactName", "Người liên hệ"],
              ["phone", "Điện thoại"],
              ["email", "Email"],
              ["address", "Địa chỉ"],
            ] as const).map(([key, label]) => (
              <label key={key} className="space-y-1 text-sm">
                <span>
                  {label}
                  {key === "name" ? " *" : ""}
                </span>
                <input
                  className={input}
                  required={key === "name"}
                  type={key === "email" ? "email" : "text"}
                  value={supplier[key]}
                  onChange={(e) =>
                    setSupplier({ ...supplier, [key]: e.target.value })
                  }
                />
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button disabled={busy} className={primary}>
              Lưu nhà cung cấp
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setSupplierForm(false)}
            >
              Đóng
            </button>
          </div>
        </form>
      )}
      {receiptForm && (
        <form
          onSubmit={saveReceipt}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h3 className="font-bold">Tạo phiếu nhập</h3>
          {!warehouse.suppliers.length && (
            <p className="text-sm text-amber-700">
              Hãy thêm nhà cung cấp trước khi tạo phiếu nhập.
            </p>
          )}
          <label className="block space-y-1 text-sm">
            <span>Nhà cung cấp *</span>
            <select
              required
              className={input}
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="">Chọn nhà cung cấp</option>
              {warehouse.suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span>Kho nhận</span>
            <input
              className={input}
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              placeholder="Nhập tên kho nhận hàng"
            />
          </label>
          {items.map((item, i) => (
            <div
              key={i}
              className="grid items-end gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
            >
              <label className="text-sm">
                Sản phẩm
                <select
                  required
                  className={input}
                  value={item.productId}
                  onChange={(e) =>
                    setItems(
                      items.map((x, j) =>
                        j === i ? { ...x, productId: e.target.value } : x,
                      ),
                    )
                  }
                >
                  <option value="">Chọn sản phẩm</option>
                  {products
                    .filter(
                      (p) =>
                        p._id &&
                        !items.some((x, j) => j !== i && x.productId === p._id),
                    )
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="text-sm">
                Số lượng
                <input
                  required
                  className={input}
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) =>
                    setItems(
                      items.map((x, j) =>
                        j === i
                          ? { ...x, quantity: Number(e.target.value) }
                          : x,
                      ),
                    )
                  }
                />
              </label>
              <label className="text-sm">
                Giá nhập (₫)
                <input
                  required
                  className={input}
                  type="number"
                  min="0"
                  step="1"
                  value={item.unitCost}
                  onChange={(e) =>
                    setItems(
                      items.map((x, j) =>
                        j === i
                          ? { ...x, unitCost: Number(e.target.value) }
                          : x,
                      ),
                    )
                  }
                />
              </label>
              <button
                type="button"
                className="p-2 text-red-600 disabled:opacity-40"
                disabled={items.length === 1}
                onClick={() => setItems(items.filter((_, j) => j !== i))}
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-blue-600"
            onClick={() =>
              setItems([...items, { productId: "", quantity: 1, unitCost: 0 }])
            }
          >
            + Thêm dòng sản phẩm
          </button>
          <label className="block text-sm">
            Ghi chú
            <textarea
              className={input}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <p className="font-bold">
            Tổng tiền:{" "}
            {fmt(items.reduce((s, i) => s + i.quantity * i.unitCost, 0))}
          </p>
          <div className="flex gap-3">
            <button
              className={primary}
              disabled={busy || !warehouse.suppliers.length}
            >
              Lưu phiếu chờ duyệt
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setReceiptForm(false)}
            >
              Đóng
            </button>
          </div>
        </form>
      )}
      {warehouse.loading && (
        <p className="text-sm text-slate-500">Đang tải dữ liệu kho...</p>
      )}
      {tab === "suppliers" ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Nhà cung cấp",
                  "Liên hệ",
                  "Điện thoại",
                  "Email",
                  "Địa chỉ",
                  "",
                ].map((h, i) => (
                  <th className="p-4" key={i}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warehouse.suppliers.map((s) => (
                <tr key={s._id} className="border-t border-slate-100">
                  <td className="p-4 font-semibold">{s.name}</td>
                  <td className="p-4">{s.contactName || "—"}</td>
                  <td className="p-4">{s.phone || "—"}</td>
                  <td className="p-4">{s.email || "—"}</td>
                  <td className="p-4">{s.address || "—"}</td>
                  <td className="p-4">
                    <button
                      className="text-blue-600"
                      onClick={() => editSupplier(s)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
              {!warehouse.suppliers.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Chưa có nhà cung cấp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[1000px] text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/60 text-slate-500">
              <tr>
                {[
                  "Mã phiếu / Ngày lập",
                  "Nhà cung cấp / Kho nhận",
                  "Chi tiết lô hàng",
                  "Trạng thái",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    className={
                      "px-4 py-3 font-semibold " +
                      (h === "Thao tác" ? "text-right" : "")
                    }
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warehouse.receipts.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-slate-200 last:border-0"
                >
                  <td className="px-4 py-4 align-top">
                    <button
                      className="font-mono font-semibold text-slate-900"
                      onClick={() =>
                        setExpanded(expanded === r._id ? "" : r._id)
                      }
                    >
                      {r.code}
                    </button>
                    <p className="mt-1 font-mono text-slate-400">
                      {new Date(r.createdAt).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium">{r.supplierName}</p>
                    <p className="mt-1 text-slate-500">
                      {r.warehouse || "Chưa ghi kho nhận"}
                    </p>
                  </td>
                  <td className="max-w-[340px] px-4 py-4 align-top">
                    <p className="leading-relaxed">
                      {r.items
                        .map(
                          (i) =>
                            (products.find((p) => p._id === i.productId)?.sku ||
                              i.name) +
                            " (×" +
                            i.quantity +
                            ")",
                        )
                        .join(", ")}
                    </p>
                    <p className="mt-1 text-slate-500">
                      Tổng {r.items.reduce((s, i) => s + i.quantity, 0)} sản
                      phẩm{r.createdBy ? " · Lập bởi " + r.createdBy : ""}
                    </p>
                    <p className="mt-2 font-semibold text-slate-700">
                      Giá trị nhập: {fmt(r.totalCost)}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={
                        "whitespace-nowrap rounded border px-2 py-0.5 " +
                        (r.status === "approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : r.status === "cancelled"
                            ? "border-slate-200 bg-slate-50 text-slate-500"
                            : "border-amber-200 bg-amber-50 text-amber-600")
                      }
                    >
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <button
                        className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-blue-600"
                        onClick={() => setExpanded(r._id)}
                      >
                        Xem chi tiết
                      </button>
                      {["pending", "approving"].includes(r.status) && (
                        <button
                          disabled={busy}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 font-semibold text-white disabled:opacity-50"
                          onClick={() =>
                            void run(async () => {
                              await warehouseApi(
                                "/stock-imports/" + r._id + "/approve",
                                { approvedBy: context.user.name },
                              )
                            })
                          }
                        >
                          <CheckCircle2 size={13} className="mr-1 inline" />
                          {r.status === "approving"
                            ? "Tiếp tục duyệt"
                            : "Duyệt nhập kho"}
                        </button>
                      )}
                      {r.status === "approved" && (
                        <span className="text-slate-400">
                          {r.approvedBy
                            ? "Duyệt bởi " + r.approvedBy
                            : "Đã duyệt nhập kho"}
                        </span>
                      )}
                      {r.status === "pending" && (
                        <button
                          disabled={busy}
                          className="rounded-lg bg-slate-100 px-2 py-1 text-slate-600"
                          onClick={() =>
                            void run(async () => {
                              await warehouseApi(
                                "/stock-imports/" + r._id + "/cancel",
                                {},
                              )
                            })
                          }
                        >
                          <XCircle size={13} className="mr-1 inline" />
                          Hủy
                        </button>
                      )}
                      <button
                        disabled={busy || r.status === "approving"}
                        aria-label={"Xóa phiếu " + r.code}
                        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-red-600 disabled:opacity-40"
                        onClick={() =>
                          void run(async () => {
                            await warehouseApi(
                              "/stock-imports/" + r._id,
                              {},
                              "DELETE",
                            )
                          })
                        }
                      >
                        <Trash2 size={13} className="mr-1 inline" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!warehouse.receipts.length && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    Chưa có phiếu nhập. Tạo phiếu đầu tiên để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

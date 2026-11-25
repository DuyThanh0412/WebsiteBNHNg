import { Boxes, Search } from "lucide-react"
import { useState } from "react"
import { useAdmin } from "../AdminContext"
export default function InventoryPage() {
  const { products, beginEdit } = useAdmin()
  const [query, setQuery] = useState("")
  const [lowOnly, setLowOnly] = useState(false)
  const filtered = products.filter(
    (p) =>
      String(p.name)
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")) &&
      (!lowOnly || Number(p.stock) <= 5),
  )
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold">Tồn kho sản phẩm</h2>
        <p className="mt-1 text-sm text-slate-500">
          Theo dõi số lượng hiện có. Cảnh báo khi còn từ 5 sản phẩm trở xuống.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 p-4">
          <label className="flex flex-1 items-center gap-2">
            <Search size={18} />
            <input
              aria-label="Tìm sản phẩm trong kho"
              className="w-full p-2 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm sản phẩm..."
            />
          </label>
          <label className="text-sm">
            <input
              type="checkbox"
              checked={lowOnly}
              onChange={(e) => setLowOnly(e.target.checked)}
            />{" "}
            Chỉ xem sắp hết hàng
          </label>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {[
                  "Sản phẩm",
                  "Danh mục",
                  "Số lượng",
                  "Cảnh báo",
                  "Thao tác",
                ].map((t) => (
                  <th key={t} className="p-4">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t border-slate-100">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 tabular-nums">{Number(p.stock) || 0}</td>
                  <td className="p-4">
                    <span
                      className={
                        Number(p.stock) <= 5
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }
                    >
                      {Number(p.stock) <= 0
                        ? "Hết hàng"
                        : Number(p.stock) <= 5
                          ? "Sắp hết hàng"
                          : "Còn hàng"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      className="font-semibold text-blue-600"
                      onClick={() => beginEdit("product", p)}
                    >
                      Cập nhật sản phẩm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="p-12 text-center text-slate-500">
            <Boxes className="mx-auto mb-3" />
            Không có sản phẩm phù hợp.
          </div>
        )}
      </div>
    </>
  )
}

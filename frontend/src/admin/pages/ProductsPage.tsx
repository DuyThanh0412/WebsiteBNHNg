import { fmt } from "../../shared/catalog"
import ProductImage from "../../shared/ProductImage"
import { useAdmin } from "../AdminContext"

export default function ProductsPage() {
  const {
    filteredProducts,
    statusPill,
    beginEdit,
    deleteRecord,
    tableHead,
    cardClass,
    emptyState,
    searchBox,
    filterSelect,
    primaryButton,
  } = useAdmin()
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sản phẩm</h2>
          <p className="mt-1 text-sm text-[#71809a]">
            Quản lý sản phẩm trên cửa hàng
          </p>
        </div>
        {primaryButton("+ Thêm sản phẩm", () => beginEdit("product"))}
      </div>
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] p-3 sm:flex-row">
          {searchBox("Tìm tên sản phẩm, mã SP...")}
          {filterSelect([
            { value: "all", label: "Tất cả trạng thái" },
            { value: "active", label: "Còn bán" },
            { value: "hidden", label: "Đang ẩn" },
          ])}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className={tableHead}>
              <tr>
                {[
                  "Ảnh",
                  "Tên sản phẩm",
                  "Danh mục",
                  "Giá bán",
                  "Tồn kho",
                  "Trạng thái",
                  "Thao tác",
                ].map((item) => (
                  <th className="px-3 py-3" key={item}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id || index}
                  className="border-t border-[#edf0f5] hover:bg-[#f9fbfe]"
                >
                  <td className="px-3 py-2">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#f0f3f8] p-1">
                      <ProductImage src={product.img} name={product.name} category={product.category} compact />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-[#8b97aa]">
                      {product.sku ||
                        product.code ||
                        (String(product._id || "").startsWith("embedded:")
                          ? `SP${String(index + 1).padStart(3, "0")}`
                          : product._id || product.id || "—")}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#6b7a99]">
                    {product.category || "—"}
                  </td>
                  <td className="px-3 py-3 font-medium">
                    {fmt(Number(product.price) || 0)}
                  </td>
                  <td className="px-3 py-3">{Number(product.stock) || 0}</td>
                  <td className="px-3 py-3">
                    {statusPill(product.show === false ? "hidden" : "active")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Sửa sản phẩm"
                        onClick={() => beginEdit("product", product)}
                        className="text-[#1a6fdb]"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa sản phẩm"
                        onClick={() => deleteRecord("product", product)}
                        className="text-red-500"
                      >
                        ♲
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredProducts.length && emptyState("Không tìm thấy sản phẩm.")}
        </div>
      </section>
    </>
  )
}

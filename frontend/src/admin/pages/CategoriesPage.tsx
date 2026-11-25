import { useAdmin } from "../AdminContext"

export default function CategoriesPage() {
  const {
    products,
    filteredCategories,
    statusPill,
    beginEdit,
    deleteRecord,
    tableHead,
    cardClass,
    emptyState,
    searchBox,
    primaryButton,
  } = useAdmin()
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
        </div>
        {primaryButton("+ Thêm danh mục", () => beginEdit("category"))}
      </div>
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] p-3 sm:flex-row">
          {searchBox("Tìm danh mục...")}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className={tableHead}>
              <tr>
                {[
                  "Ảnh",
                  "Tên danh mục",
                  "Mô tả",
                  "Số sản phẩm",
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
              {filteredCategories.map((category, index) => (
                <tr
                  key={category._id || index}
                  className="border-t border-[#edf0f5] hover:bg-[#f9fbfe]"
                >
                  <td className="px-3 py-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f3f8] text-xl">
                      {category.icon || "📦"}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold">
                    {category.name || category.label}
                  </td>
                  <td className="px-3 py-3 text-[#6b7a99]">
                    {category.desc || "—"}
                  </td>
                  <td className="px-3 py-3">
                    {
                      products.filter(
                        (product) => product.category === category.name,
                      ).length
                    }
                  </td>
                  <td className="px-3 py-3">
                    {statusPill(category.show === false ? "hidden" : "active")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Sửa danh mục"
                        onClick={() => beginEdit("category", category)}
                        className="text-[#1a6fdb]"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa danh mục"
                        onClick={() => deleteRecord("category", category)}
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
          {!filteredCategories.length &&
            emptyState("Chưa có danh mục phù hợp.")}
        </div>
      </section>
    </>
  )
}

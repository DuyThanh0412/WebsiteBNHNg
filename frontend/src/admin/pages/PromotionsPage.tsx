import { useAdmin } from "../AdminContext"

export default function PromotionsPage() {
  const {
    filteredPromotions,
    beginEdit,
    deleteRecord,
    tableHead,
    cardClass,
    emptyState,
    searchBox,
    filterSelect,
    primaryButton,
    savePromotionStatus,
  } = useAdmin()
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Khuyến mãi</h2>
          <p className="mt-1 text-sm text-[#71809a]">
            Quản lý các chương trình khuyến mãi
          </p>
        </div>
        {primaryButton("+ Tạo khuyến mãi", () => beginEdit("promotion"))}
      </div>
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] p-3 sm:flex-row">
          {searchBox("Tìm tên chương trình, mã KM...")}
          {filterSelect([
            { value: "all", label: "Tất cả trạng thái" },
            { value: "active", label: "Đang diễn ra" },
            { value: "scheduled", label: "Sắp diễn ra" },
            { value: "ended", label: "Đã kết thúc" },
          ])}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className={tableHead}>
              <tr>
                {[
                  "Mã KM",
                  "Tên chương trình",
                  "Loại",
                  "Giá trị",
                  "Thời gian áp dụng",
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
              {filteredPromotions.map((promotion) => (
                <tr
                  key={promotion._id || promotion.id}
                  className="border-t border-[#edf0f5]"
                >
                  <td className="px-3 py-3 font-bold">{promotion.code}</td>
                  <td className="px-3 py-3">{promotion.name}</td>
                  <td className="px-3 py-3 text-[#71809a]">{promotion.type}</td>
                  <td className="px-3 py-3">
                    {promotion.value}
                    {promotion.type === "Giảm giá" ||
                    promotion.type === "Giảm giá combo"
                      ? "%"
                      : ""}
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {promotion.startDate || "—"} – {promotion.endDate || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={promotion.status}
                      aria-label={`Trạng thái ${promotion.code}`}
                      onChange={(event) =>
                        savePromotionStatus(promotion, event.target.value)
                      }
                      className="rounded-md border border-[#dfe6f0] px-2 py-1 text-xs"
                    >
                      <option value="active">Đang diễn ra</option>
                      <option value="scheduled">Sắp diễn ra</option>
                      <option value="ended">Đã kết thúc</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => beginEdit("promotion", promotion)}
                        className="text-[#1a6fdb]"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord("promotion", promotion)}
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
          {!filteredPromotions.length &&
            emptyState(
              "Chưa có chương trình khuyến mãi. Tạo chương trình đầu tiên để bắt đầu.",
            )}
        </div>
      </section>
    </>
  )
}

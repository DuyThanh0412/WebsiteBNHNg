import { fmt } from "../../shared/catalog"
import { useAdmin } from "../AdminContext"

export default function CustomersPage() {
  const {
    orders,
    customerStatusFilter,
    setCustomerStatusFilter,
    customerPage,
    setCustomerPage,
    title,
    filteredCustomers,
    customerPageSize,
    customerPageCount,
    pagedCustomers,
    beginEdit,
    deleteRecord,
    tableHead,
    cardClass,
    emptyState,
    searchBox,
    updateCustomerStatus,
  } = useAdmin()
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Khách hàng</h2>
          <p className="mt-1 text-sm text-[#71809a]">
            Quản lý thông tin khách hàng
          </p>
        </div>
        <button
          type="button"
          onClick={() => beginEdit("customer")}
          className="rounded-lg bg-[#1a6fdb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1558b0]"
        >
          + Thêm khách hàng
        </button>
      </div>
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] p-3 sm:flex-row">
          {searchBox("Tìm tên, SĐT, email...")}
          <select
            aria-label="Lọc trạng thái khách hàng"
            value={customerStatusFilter}
            onChange={(event) => {
              setCustomerStatusFilter(event.target.value)
              setCustomerPage(1)
            }}
            className="rounded-lg border border-[#dfe6f0] bg-white px-3 py-2 text-sm text-[#52617a] outline-none focus:border-[#1a6fdb]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="blocked">Đã khóa</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className={tableHead}>
              <tr>
                {[
                  "Khách hàng",
                  "SĐT",
                  "Email",
                  "Tổng đơn",
                  "Tổng chi tiêu",
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
              {pagedCustomers.map((customer) => (
                <tr
                  key={customer.key}
                  className="border-t border-[#edf0f5] hover:bg-[#f9fbfe]"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] font-semibold text-[#1a6fdb]">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                      <b>{customer.name}</b>
                    </div>
                  </td>
                  <td className="px-3 py-3">{customer.phone || "—"}</td>
                  <td className="px-3 py-3 text-[#6b7a99]">
                    {customer.email || "—"}
                  </td>
                  <td className="px-3 py-3">{customer.count}</td>
                  <td className="px-3 py-3 font-semibold">
                    {fmt(customer.spend)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                        customer.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {customer.status === "active" ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Sửa ${customer.name}`}
                        title="Sửa khách hàng"
                        onClick={() => beginEdit("customer", customer)}
                        className="text-[#1a6fdb] hover:text-[#1558b0]"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        aria-label={
                          customer.status === "blocked"
                            ? "Mở khóa khách hàng"
                            : "Khóa khách hàng"
                        }
                        title={
                          customer.status === "blocked"
                            ? "Mở khóa khách hàng"
                            : "Khóa khách hàng"
                        }
                        onClick={() => updateCustomerStatus(customer)}
                        className="text-amber-600"
                      >
                        {customer.status === "blocked" ? "🔓" : "🔒"}
                      </button>
                      <button
                        type="button"
                        aria-label={`Xóa ${customer.name}`}
                        title="Xóa khách hàng"
                        onClick={() => deleteRecord("customer", customer)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ♲
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredCustomers.length &&
            emptyState(
              orders.length
                ? "Không tìm thấy khách hàng."
                : "Khách hàng sẽ xuất hiện sau khi có đơn hàng.",
            )}
        </div>
        <footer className="flex flex-col gap-3 border-t border-[#edf0f5] px-3 py-3 text-xs text-[#71809a] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Hiển thị{" "}
            {filteredCustomers.length
              ? (customerPage - 1) * customerPageSize + 1
              : 0}
            –
            {Math.min(
              customerPage * customerPageSize,
              filteredCustomers.length,
            )}{" "}
            trong {filteredCustomers.length} khách hàng
          </span>
          <nav
            aria-label="Phân trang khách hàng"
            className="flex items-center justify-end gap-1"
          >
            <button
              type="button"
              aria-label="Trang trước"
              disabled={customerPage <= 1}
              onClick={() => setCustomerPage((page) => Math.max(1, page - 1))}
              className="rounded-md border border-[#dfe6f0] px-2.5 py-1.5 disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from(
              { length: customerPageCount },
              (_, index) => index + 1,
            ).map((page) => (
              <button
                key={page}
                type="button"
                aria-current={customerPage === page ? "page" : undefined}
                onClick={() => setCustomerPage(page)}
                className={`rounded-md px-2.5 py-1.5 ${
                  customerPage === page
                    ? "bg-[#1a6fdb] font-semibold text-white"
                    : "border border-[#dfe6f0] bg-white text-[#52617a]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              aria-label="Trang tiếp theo"
              disabled={customerPage >= customerPageCount}
              onClick={() =>
                setCustomerPage((page) => Math.min(customerPageCount, page + 1))
              }
              className="rounded-md border border-[#dfe6f0] px-2.5 py-1.5 disabled:opacity-40"
            >
              ›
            </button>
          </nav>
        </footer>
      </section>
    </>
  )
}

import { createPortal } from "react-dom"
import { fmt } from "../../shared/catalog"
import { useAdmin } from "../AdminContext"

export default function AdminDialogs() {
  const {
    products,
    categories,
    editor,
    setEditor,
    form,
    setForm,
    saving,
    orderPrintPreviewOpen,
    setOrderPrintPreviewOpen,
    orderEditor,
    setOrderEditor,
    savingOrder,
    title,
    statuses,
    selectedOrder,
    saveOrderChanges,
    productIdForOrder,
    saveRecord,
    inputClass,
  } = useAdmin()
  return (
    <>
      {editor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setEditor(null)
          }}
        >
          <form
            onSubmit={saveRecord}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editor.record ? "Chỉnh sửa" : "Thêm"}{" "}
                {editor.kind === "product"
                  ? "sản phẩm"
                  : editor.kind === "category"
                    ? "danh mục"
                    : editor.kind === "promotion"
                      ? "khuyến mãi"
                      : "khách hàng"}
              </h2>
              <button
                type="button"
                onClick={() => setEditor(null)}
                aria-label="Đóng"
                className="text-2xl text-[#71809a]"
              >
                ×
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(editor.kind === "customer"
                ? [
                    { key: "name", label: "Tên khách hàng", required: true },
                    { key: "phone", label: "Số điện thoại" },
                    { key: "email", label: "Email", type: "email" },
                    { key: "address", label: "Địa chỉ", wide: true },
                    { key: "status", label: "Trạng thái" },
                  ]
                : editor.kind === "product"
                  ? [
                      { key: "name", label: "Tên sản phẩm", required: true },
                      { key: "category", label: "Danh mục", required: true },
                      {
                        key: "price",
                        label: "Giá bán",
                        type: "number",
                        required: true,
                      },
                      { key: "stock", label: "Tồn kho", type: "number" },
                      { key: "img", label: "URL hình ảnh", wide: true },
                      { key: "description", label: "Mô tả", wide: true },
                      { key: "show", label: "Hiển thị", type: "checkbox" },
                    ]
                  : editor.kind === "category"
                    ? [
                        { key: "name", label: "Tên danh mục", required: true },
                        { key: "icon", label: "Biểu tượng (emoji)" },
                        { key: "desc", label: "Mô tả", wide: true },
                        { key: "show", label: "Hiển thị", type: "checkbox" },
                      ]
                    : [
                        { key: "code", label: "Mã khuyến mãi", required: true },
                        {
                          key: "name",
                          label: "Tên chương trình",
                          required: true,
                        },
                        { key: "type", label: "Loại khuyến mãi" },
                        { key: "value", label: "Giá trị", required: true },
                        {
                          key: "startDate",
                          label: "Ngày bắt đầu",
                          type: "date",
                        },
                        {
                          key: "endDate",
                          label: "Ngày kết thúc",
                          type: "date",
                        },
                        { key: "status", label: "Trạng thái" },
                      ]
              ).map((field) => (
                <label
                  key={field.key}
                  className={`block text-sm font-medium text-[#52617a] ${
                    field.wide ? "sm:col-span-2" : ""
                  }`}
                >
                  {field.label}
                  {field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.key])}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          [field.key]: event.target.checked,
                        }))
                      }
                      className="ml-3 accent-[#1a6fdb]"
                    />
                  ) : editor.kind === "customer" && field.key === "status" ? (
                    <select
                      className={`${inputClass} mt-1`}
                      value={form.status || "active"}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          status: event.target.value,
                        }))
                      }
                    >
                      <option value="active">Hoạt động</option>
                      <option value="blocked">Đã khóa</option>
                    </select>
                  ) : editor.kind === "product" && field.key === "category" ? (
                    <select
                      required
                      className={`${inputClass} mt-1`}
                      value={form.category || ""}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          category: event.target.value,
                        }))
                      }
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option
                          key={category._id || category.name}
                          value={category.name}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : editor.kind === "promotion" && field.key === "type" ? (
                    <select
                      className={`${inputClass} mt-1`}
                      value={form.type || "Giảm giá"}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          type: event.target.value,
                        }))
                      }
                    >
                      <option>Giảm giá</option>
                      <option>Miễn phí vận chuyển</option>
                      <option>Giảm giá combo</option>
                    </select>
                  ) : editor.kind === "promotion" && field.key === "status" ? (
                    <select
                      className={`${inputClass} mt-1`}
                      value={form.status || "scheduled"}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          status: event.target.value,
                        }))
                      }
                    >
                      <option value="active">Đang diễn ra</option>
                      <option value="scheduled">Sắp diễn ra</option>
                      <option value="ended">Đã kết thúc</option>
                    </select>
                  ) : field.key === "description" || field.key === "desc" ? (
                    <textarea
                      className={`${inputClass} mt-1`}
                      rows={3}
                      value={form[field.key] || ""}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      required={field.required}
                      min={field.type === "number" ? "0" : undefined}
                      className={`${inputClass} mt-1`}
                      value={form[field.key] ?? ""}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          [field.key]:
                            field.type === "number"
                              ? Number(event.target.value)
                              : event.target.value,
                        }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-lg border border-[#dfe6f0] px-4 py-2 text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#1a6fdb] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      )}
      {orderEditor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingOrder)
              setOrderEditor(null)
          }}
        >
          <form
            onSubmit={saveOrderChanges}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Chỉnh sửa đơn hàng</h2>
                <p className="mt-1 text-xs text-[#71809a]">
                  Cập nhật thông tin giao hàng, sản phẩm và số lượng.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderEditor(null)}
                disabled={savingOrder}
                aria-label="Đóng"
                className="text-2xl text-[#71809a] disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: "name", label: "Tên khách hàng", required: true },
                { key: "phone", label: "Số điện thoại", required: true },
                { key: "email", label: "Email" },
                {
                  key: "address",
                  label: "Địa chỉ giao hàng",
                  required: true,
                  wide: true,
                },
                { key: "note", label: "Ghi chú", wide: true },
              ].map((field) => (
                <label
                  key={field.key}
                  className={`text-sm font-medium text-[#52617a] ${
                    field.wide ? "sm:col-span-2" : ""
                  }`}
                >
                  {field.label}
                  {field.key === "note" ? (
                    <textarea
                      rows={2}
                      required={field.required}
                      className={`${inputClass} mt-1`}
                      value={orderEditor.customer[field.key] || ""}
                      onChange={(event) =>
                        setOrderEditor((previous: any) => ({
                          ...previous,
                          customer: {
                            ...previous.customer,
                            [field.key]: event.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={field.key === "email" ? "email" : "text"}
                      className={`${inputClass} mt-1`}
                      value={orderEditor.customer[field.key] || ""}
                      onChange={(event) =>
                        setOrderEditor((previous: any) => ({
                          ...previous,
                          customer: {
                            ...previous.customer,
                            [field.key]: event.target.value,
                          },
                        }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold">Sản phẩm trong đơn</h3>
              <button
                type="button"
                disabled={!products.length}
                onClick={() => {
                  const product = products[0]
                  setOrderEditor((previous: any) => ({
                    ...previous,
                    items: [
                      ...previous.items,
                      {
                        productId: productIdForOrder(product),
                        name: product.name,
                        quantity: 1,
                      },
                    ],
                  }))
                }}
                className="rounded-lg border border-[#dfe6f0] px-3 py-2 text-sm font-semibold text-[#1a6fdb] disabled:opacity-50"
              >
                + Thêm sản phẩm
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {orderEditor.items.map((item: any, index: number) => (
                <div
                  key={`${orderEditor.orderId}-${index}`}
                  className="grid gap-2 rounded-xl border border-[#e6eaf2] p-3 sm:grid-cols-[minmax(0,1fr)_110px_auto] sm:items-end"
                >
                  <label className="text-xs font-medium text-[#52617a]">
                    Sản phẩm
                    <select
                      required
                      className={`${inputClass} mt-1`}
                      value={item.productId}
                      onChange={(event) => {
                        const product = products.find(
                          (candidate) =>
                            productIdForOrder(candidate) === event.target.value,
                        )
                        setOrderEditor((previous: any) => ({
                          ...previous,
                          items: previous.items.map(
                            (current: any, rowIndex: number) =>
                              rowIndex === index
                                ? {
                                    ...current,
                                    productId: event.target.value,
                                    name: product?.name || current.name,
                                  }
                                : current,
                          ),
                        }))
                      }}
                    >
                      {!products.some(
                        (product) =>
                          productIdForOrder(product) === item.productId,
                      ) && (
                        <option value={item.productId}>
                          {item.name} (sản phẩm cũ)
                        </option>
                      )}
                      {products.map((product, productIndex) => (
                        <option
                          key={`${productIdForOrder(product)}-${productIndex}`}
                          value={productIdForOrder(product)}
                        >
                          {product.name} · {fmt(Number(product.price) || 0)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-[#52617a]">
                    Số lượng
                    <input
                      required
                      type="number"
                      min="1"
                      max="99"
                      className={`${inputClass} mt-1`}
                      value={item.quantity}
                      onChange={(event) =>
                        setOrderEditor((previous: any) => ({
                          ...previous,
                          items: previous.items.map(
                            (current: any, rowIndex: number) =>
                              rowIndex === index
                                ? {
                                    ...current,
                                    quantity: Number(event.target.value),
                                  }
                                : current,
                          ),
                        }))
                      }
                    />
                  </label>
                  <button
                    type="button"
                    disabled={orderEditor.items.length <= 1}
                    onClick={() =>
                      setOrderEditor((previous: any) => ({
                        ...previous,
                        items: previous.items.filter(
                          (_: any, rowIndex: number) => rowIndex !== index,
                        ),
                      }))
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-[#edf0f5] pt-4">
              <button
                type="button"
                disabled={savingOrder}
                onClick={() => setOrderEditor(null)}
                className="rounded-lg border border-[#dfe6f0] px-4 py-2 text-sm disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={savingOrder}
                className="rounded-lg bg-[#1a6fdb] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {savingOrder ? "Đang lưu..." : "Lưu đơn hàng"}
              </button>
            </div>
          </form>
        </div>
      )}
      {orderPrintPreviewOpen &&
        selectedOrder &&
        createPortal(
          <div
            className="order-print-preview-overlay fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-3 sm:p-6"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setOrderPrintPreviewOpen(false)
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-print-preview-title"
              className="order-print-preview-dialog flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#f3f6fb] shadow-2xl"
            >
              <header className="order-print-preview-header flex items-center justify-between gap-3 border-b border-[#e6eaf2] bg-white px-5 py-4">
                <div>
                  <h2 id="order-print-preview-title" className="font-bold">
                    Xem trước đơn hàng
                  </h2>
                  <p className="mt-1 text-xs text-[#71809a]">
                    Kiểm tra nội dung trước khi in
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderPrintPreviewOpen(false)}
                  aria-label="Đóng xem trước"
                  className="text-2xl leading-none text-[#71809a]"
                >
                  ×
                </button>
              </header>
              <div className="order-print-preview-content overflow-y-auto p-4 sm:p-6">
                <article
                  id="order-print-root"
                  className="mx-auto max-w-[210mm] bg-white p-6 text-[#1a2236] shadow-md sm:p-10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#1a2236] pb-5">
                    <div>
                      <p className="text-xl font-extrabold tracking-wide">
                        BIGBANG MOBILE
                      </p>
                      <p className="mt-1 text-xs text-[#6b7a99]">
                        Cảm ơn quý khách đã mua hàng
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-extrabold">HÓA ĐƠN</h3>
                      <p className="mt-1 text-sm font-semibold">
                        Mã đơn: {selectedOrder.orderNumber || selectedOrder._id}
                      </p>
                      <p className="text-xs text-[#6b7a99]">
                        Ngày đặt:{" "}
                        {selectedOrder.createdAt
                          ? new Date(selectedOrder.createdAt).toLocaleString(
                              "vi-VN",
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5 border-b border-[#dfe6f0] py-5 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6b7a99]">
                        Thông tin khách hàng
                      </h4>
                      <p className="font-semibold">
                        {selectedOrder.customer?.name || "—"}
                      </p>
                      <p className="mt-1 text-sm">
                        {selectedOrder.customer?.phone || "—"}
                      </p>
                      {selectedOrder.customer?.email && (
                        <p className="text-sm">
                          {selectedOrder.customer.email}
                        </p>
                      )}
                      <p className="mt-1 text-sm">
                        {selectedOrder.customer?.address || "—"}
                      </p>
                      {selectedOrder.customer?.note && (
                        <p className="mt-2 text-sm">
                          Ghi chú: {selectedOrder.customer.note}
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6b7a99]">
                        Thanh toán
                      </h4>
                      <p className="text-sm">
                        {{
                          cod: "Thanh toán khi nhận hàng",
                          bank: "Chuyển khoản ngân hàng",
                          deposit: "Đặt cọc qua chuyển khoản",
                          card: "Thẻ tín dụng / ghi nợ",
                        }[(selectedOrder.paymentMethod as string)] ||
                          "Thanh toán khi nhận hàng"}
                      </p>
                      <p className="mt-1 text-sm">
                        Trạng thái:{" "}
                        {statuses.find(
                          (item) => item.value === selectedOrder.status,
                        )?.label ||
                          selectedOrder.status ||
                          "—"}
                      </p>
                      {selectedOrder.paymentMethod === "deposit" && (
                        <p className="mt-1 text-sm">
                          Tiền cọc:{" "}
                          {fmt(Number(selectedOrder.depositAmount) || 0)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="py-5">
                    <h4 className="mb-3 font-bold">Chi tiết sản phẩm</h4>
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-y border-[#dfe6f0] bg-[#f7f9fc]">
                          <th className="px-2 py-3">Sản phẩm</th>
                          <th className="px-2 py-3 text-center">SL</th>
                          <th className="px-2 py-3 text-right">Đơn giá</th>
                          <th className="px-2 py-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || []).map(
                          (item: any, index: number) => (
                            <tr
                              key={`${item.productId}-${index}`}
                              className="border-b border-[#edf0f5]"
                            >
                              <td className="px-2 py-3">{item.name}</td>
                              <td className="px-2 py-3 text-center">
                                {item.quantity}
                              </td>
                              <td className="px-2 py-3 text-right">
                                {fmt(Number(item.price) || 0)}
                              </td>
                              <td className="px-2 py-3 text-right font-semibold">
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
                  <div className="ml-auto max-w-xs space-y-2 border-t border-[#dfe6f0] pt-4 text-right text-sm">
                    <p className="flex justify-between gap-6">
                      <span>Tạm tính</span>
                      <span>{fmt(Number(selectedOrder.subtotal) || 0)}</span>
                    </p>
                    {Number(selectedOrder.discount) > 0 && (
                      <p className="flex justify-between gap-6">
                        <span>Giảm giá</span>
                        <span>-{fmt(Number(selectedOrder.discount))}</span>
                      </p>
                    )}
                    <p className="flex justify-between gap-6">
                      <span>Phí vận chuyển</span>
                      <span>{fmt(Number(selectedOrder.shippingFee) || 0)}</span>
                    </p>
                    <p className="flex justify-between gap-6 border-t border-[#dfe6f0] pt-3 text-base font-extrabold">
                      <span>Tổng thanh toán</span>
                      <span>{fmt(Number(selectedOrder.total) || 0)}</span>
                    </p>
                  </div>
                  <p className="mt-10 text-center text-xs text-[#6b7a99]">
                    Cảm ơn quý khách và hẹn gặp lại!
                  </p>
                </article>
              </div>
              <footer className="order-print-preview-actions flex justify-end gap-2 border-t border-[#e6eaf2] bg-white px-5 py-4">
                <button
                  type="button"
                  onClick={() => setOrderPrintPreviewOpen(false)}
                  className="rounded-lg border border-[#dfe6f0] px-4 py-2 text-sm"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-[#1a6fdb] px-5 py-2 text-sm font-semibold text-white"
                >
                  In đơn hàng
                </button>
              </footer>
            </section>
          </div>,
          document.body,
        )}
    </>
  )
}

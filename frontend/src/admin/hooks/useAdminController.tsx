import { useEffect, useState, type FormEvent } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router"
import { API_URL } from "../../shared/api"
import { toSlug, unwrapAdminList, type Category } from "../../shared/catalog"

export function useAdminController() {
  const [refreshVersion, setRefreshVersion] = useState(0)
  const refreshData = () => setRefreshVersion((value) => value + 1)
  const context = useOutletContext<any>()
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [promotions, setPromotions] = useState<any[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerStatusFilter, setCustomerStatusFilter] = useState("all")
  const [customerPage, setCustomerPage] = useState(1)
  const [editor, setEditor] = useState<{
    kind: "product" | "category" | "promotion" | "customer"
    record: any | null
  } | null>(null)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [orderPrintPreviewOpen, setOrderPrintPreviewOpen] = useState(false)
  const [orderEditor, setOrderEditor] = useState<any>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [reportTab, setReportTab] = useState("revenue")
  const [selectedReportDay, setSelectedReportDay] = useState<string | null>(
    null,
  )
  const [settingsTab, setSettingsTab] = useState("store")

  const currentSection = location.pathname.split("/")[2] || "overview"
  const menus = [
    { id: "overview", label: "Tổng quan", icon: "▦", href: "/admin" },
    { id: "products", label: "Sản phẩm", icon: "▣", href: "/admin/products" },
    {
      id: "categories",
      label: "Danh mục",
      icon: "☷",
      href: "/admin/categories",
    },
    { id: "orders", label: "Đơn hàng", icon: "▤", href: "/admin/orders" },
    {
      id: "customers",
      label: "Khách hàng",
      icon: "♧",
      href: "/admin/customers",
    },
    {
      id: "promotions",
      label: "Khuyến mãi",
      icon: "％",
      href: "/admin/promotions",
    },
    { id: "reports", label: "Báo cáo", icon: "▥", href: "/admin/reports" },
    { id: "settings", label: "Cài đặt", icon: "⚙", href: "/admin/settings" },
  ]
  const title =
    menus.find((menu) => menu.id === currentSection)?.label || "Tổng quan"
  const statuses = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "processing", label: "Chờ cửa hàng chuẩn bị" },
    { value: "shipped", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "cancelled", label: "Đã hủy" },
  ]

  useEffect(() => {
    if (!context?.user?.isAdmin) return
    setLoading(true)
    setLoadError("")
    let cancelled = false
    Promise.allSettled([
      fetch(`${API_URL}/products`).then(async (response) => {
        if (!response.ok) throw new Error("Không tải được sản phẩm.")
        return response.json()
      }),
      fetch(`${API_URL}/categories`).then(async (response) => {
        if (!response.ok) throw new Error("Không tải được danh mục.")
        return response.json()
      }),
      fetch(`${API_URL}/orders`).then(async (response) => {
        if (!response.ok) throw new Error("Không tải được đơn hàng.")
        return response.json()
      }),
      fetch(`${API_URL}/promotions`).then(async (response) => {
        if (!response.ok) throw new Error("Không tải được khuyến mãi.")
        return response.json()
      }),
      fetch(`${API_URL}/customers`).then(async (response) => {
        if (!response.ok) throw new Error("Không tải được khách hàng.")
        return response.json()
      }),
    ])
      .then((results) => {
        if (cancelled) return
        const errors: string[] = []
        if (results[0].status === "fulfilled")
          setProducts(unwrapAdminList<any>(results[0].value, "products"))
        else errors.push("Không tải được sản phẩm.")
        if (results[1].status === "fulfilled")
          setCategories(
            unwrapAdminList<Category>(results[1].value, "categories"),
          )
        else errors.push("Không tải được danh mục.")
        if (results[2].status === "fulfilled")
          setOrders(Array.isArray(results[2].value) ? results[2].value : [])
        else errors.push("Không tải được đơn hàng. Hãy khởi động lại backend.")
        if (results[3].status === "fulfilled")
          setPromotions(Array.isArray(results[3].value) ? results[3].value : [])
        else errors.push("Không tải được danh sách khuyến mãi.")
        if (results[4].status === "fulfilled")
          setCustomers(Array.isArray(results[4].value) ? results[4].value : [])
        else errors.push("Không tải được danh sách khách hàng.")
        setLoadError(errors.join(" "))
        const firstOrder =
          results[2].status === "fulfilled" && Array.isArray(results[2].value)
            ? results[2].value[0]
            : null
        if (firstOrder?._id) setSelectedOrderId(String(firstOrder._id))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    try {
      const savedSettings = localStorage.getItem("bbm-admin-settings")
      if (savedSettings) setSettings(JSON.parse(savedSettings))
    } catch {
      if (!cancelled)
        setLoadError((previous) =>
          [previous, "Không đọc được cài đặt đã lưu."]
            .filter(Boolean)
            .join(" "),
        )
    }
    return () => {
      cancelled = true
    }
  }, [context?.user?.isAdmin, refreshVersion])

  useEffect(() => {
    if (!context?.user?.isAdmin) navigate("/login", { replace: true })
  }, [context?.user?.isAdmin, navigate])

  const notify = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage(""), 3000)
  }
  const customerList = customers.map((customer) => ({
    ...customer,
    key: customer._id,
    count: Number(customer.orderCount) || 0,
    spend: Number(customer.totalSpent) || 0,
  }))
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length
  const matching = (value: unknown) =>
    String(value || "")
      .toLocaleLowerCase("vi")
      .includes(search.toLocaleLowerCase("vi"))
  const filteredProducts = products.filter(
    (product) =>
      matching(product.name) &&
      (statusFilter === "all" ||
        (statusFilter === "active"
          ? product.show !== false
          : product.show === false)),
  )
  const filteredCategories = categories.filter(
    (category) =>
      matching(category.name || category.label) &&
      (statusFilter === "all" ||
        (statusFilter === "active"
          ? category.show !== false
          : category.show === false)),
  )
  const filteredOrders = orders.filter(
    (order) =>
      matching(
        `${order.orderNumber} ${order.customer?.name} ${order.customer?.phone} ${order.customer?.email}`,
      ) &&
      (statusFilter === "all" || order.status === statusFilter),
  )
  const filteredCustomers = customerList.filter(
    (customer) =>
      matching(`${customer.name} ${customer.email} ${customer.phone}`) &&
      (customerStatusFilter === "all" ||
        customer.status === customerStatusFilter),
  )
  const customerPageSize = 8
  const customerPageCount = Math.max(
    1,
    Math.ceil(filteredCustomers.length / customerPageSize),
  )
  const pagedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customerPageSize,
    customerPage * customerPageSize,
  )
  const filteredPromotions = promotions.filter(
    (promotion) =>
      matching(`${promotion.code} ${promotion.name}`) &&
      (statusFilter === "all" || promotion.status === statusFilter),
  )
  const selectedOrder =
    orders.find((order) => String(order._id) === selectedOrderId) ||
    filteredOrders[0]
  const orderStateLabel = (status: string) =>
    ({
      unpaid: "Đang chờ thanh toán",
      partial: "Đã thanh toán một phần",
      paid: "Đã thanh toán",
      active: "Còn hàng",
      hidden: "Đang ẩn",
      scheduled: "Sắp diễn ra",
      ended: "Đã kết thúc",
    })[status] ||
    statuses.find((item) => item.value === status)?.label ||
    status ||
    "Chờ xác nhận"
  const statusPill = (status: string) => {
    const colors: Record<string, string> = {
      unpaid: "bg-amber-100 text-amber-700",
      partial: "bg-amber-100 text-amber-700",
      paid: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-violet-100 text-violet-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
      active: "bg-emerald-100 text-emerald-700",
      hidden: "bg-slate-100 text-slate-600",
      scheduled: "bg-amber-100 text-amber-700",
      ended: "bg-slate-100 text-slate-600",
    }
    return (
      <span
        className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${colors[status] || "bg-slate-100 text-slate-600"}`}
      >
        {orderStateLabel(status)}
      </span>
    )
  }
  const updateOrderStatus = async (order: any, status: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Không thể cập nhật đơn hàng.")
      setOrders((previous) =>
        previous.map((item) =>
          String(item._id) === String(order._id) ? data : item,
        ),
      )
      notify("Đã cập nhật trạng thái đơn hàng.")
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Không thể cập nhật đơn hàng.",
      )
    }
  }
  const beginEditOrder = (order: any) => {
    setOrderEditor({
      orderId: order._id,
      customer: {
        name: order.customer?.name || "",
        phone: order.customer?.phone || "",
        email: order.customer?.email || "",
        address: order.customer?.address || "",
        note: order.customer?.note || "",
      },
      items: (order.items || []).map((item: any) => ({
        productId: item.productId,
        name: item.name,
        quantity: Number(item.quantity) || 1,
      })),
    })
  }
  const saveOrderChanges = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!orderEditor) return
    setSavingOrder(true)
    try {
      const response = await fetch(`${API_URL}/orders/${orderEditor.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: orderEditor.customer,
          items: orderEditor.items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
          })),
        }),
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Không thể cập nhật đơn hàng.")
      setOrders((previous) =>
        previous.map((order) =>
          String(order._id) === String(data._id) ? data : order,
        ),
      )
      setOrderEditor(null)
      notify("Đã lưu thay đổi đơn hàng.")
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Không thể cập nhật đơn hàng.",
      )
    } finally {
      setSavingOrder(false)
    }
  }
  const productIdForOrder = (product: any) => {
    const id = String(product?._id || product?.id || toSlug(product?.name))
    return id.startsWith("embedded:") ? toSlug(product?.name) : id
  }
  const beginEdit = (
    kind: "product" | "category" | "promotion" | "customer",
    record: any = null,
  ) => {
    setEditor({ kind, record })
    setForm(
      record
        ? { ...record }
        : kind === "product"
          ? {
              name: "",
              category: categories[0]?.name || "",
              price: "",
              stock: 0,
              img: "",
              description: "",
              show: true,
            }
          : kind === "category"
            ? { name: "", icon: "📦", desc: "", show: true }
            : kind === "promotion"
              ? {
                  code: "",
                  name: "",
                  type: "Giảm giá",
                  value: "",
                  startDate: "",
                  endDate: "",
                  status: "scheduled",
                }
              : {
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  status: "active",
                },
    )
  }
  const saveRecord = async (event: FormEvent) => {
    event.preventDefault()
    if (!editor) return
    setSaving(true)
    const payload = Object.fromEntries(
      Object.entries(form).filter(
        ([key]) => !["_id", "__v", "createdAt", "updatedAt"].includes(key),
      ),
    )
    try {
      if (editor.kind === "customer") {
        const response = await fetch(
          `${API_URL}/customers${
            editor.record?._id ? `/${editor.record._id}` : ""
          }`,
          {
            method: editor.record?._id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              address: payload.address,
              status: payload.status || "active",
            }),
          },
        )
        const data = await response.json()
        if (!response.ok)
          throw new Error(data.message || "Không thể lưu khách hàng.")
        setCustomers((previous) =>
          editor.record?._id
            ? previous.map((item) =>
                String(item._id) === String(editor.record._id) ? data : item,
              )
            : [data, ...previous],
        )
      } else if (editor.kind === "promotion") {
        const response = await fetch(
          `${API_URL}/promotions${
            editor.record?._id ? `/${editor.record._id}` : ""
          }`,
          {
            method: editor.record?._id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        )
        const data = await response.json()
        if (!response.ok)
          throw new Error(data.message || "Không thể lưu khuyến mãi.")
        setPromotions((previous) =>
          editor.record?._id
            ? previous.map((item) =>
                String(item._id) === String(editor.record._id) ? data : item,
              )
            : [data, ...previous],
        )
      } else {
        const path = editor.kind === "product" ? "products" : "categories"
        const method = editor.record?._id ? "PUT" : "POST"
        const endpoint = `${API_URL}/${path}${
          editor.record?._id ? `/${editor.record._id}` : ""
        }`
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await response.json()
        if (!response.ok)
          throw new Error(data.message || "Không thể lưu dữ liệu.")
        if (editor.kind === "product") {
          setProducts((previous) =>
            editor.record?._id
              ? previous.map((item) =>
                  String(item._id) === String(editor.record._id) ? data : item,
                )
              : [data, ...previous],
          )
        } else {
          setCategories((previous) =>
            editor.record?._id
              ? previous.map((item) =>
                  String(item._id) === String(editor.record._id) ? data : item,
                )
              : [data, ...previous],
          )
        }
      }
      setEditor(null)
      notify("Đã lưu thay đổi.")
    } catch (error) {
      notify(error instanceof Error ? error.message : "Không thể lưu dữ liệu.")
    } finally {
      setSaving(false)
    }
  }
  const deleteRecord = async (
    kind: "product" | "category" | "promotion" | "customer",
    record: any,
  ) => {
    if (
      !window.confirm(`Bạn có chắc muốn xóa "${record.name || record.code}"?`)
    )
      return
    try {
      if (kind === "customer") {
        const response = await fetch(
          `${API_URL}/customers/${encodeURIComponent(record._id)}`,
          { method: "DELETE" },
        )
        const data = await response.json()
        if (!response.ok)
          throw new Error(data.message || "Không thể xóa khách hàng.")
        setCustomers((previous) =>
          previous.filter((item) => String(item._id) !== String(record._id)),
        )
      } else if (kind === "promotion") {
        const response = await fetch(`${API_URL}/promotions/${record._id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Không thể xóa khuyến mãi.")
        setPromotions((previous) =>
          previous.filter((item) => String(item._id) !== String(record._id)),
        )
      } else {
        const path = kind === "product" ? "products" : "categories"
        const response = await fetch(`${API_URL}/${path}/${record._id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Không thể xóa dữ liệu.")
        if (String(record._id).startsWith("embedded:")) {
          const refreshedResponse = await fetch(`${API_URL}/${path}`)
          if (!refreshedResponse.ok)
            throw new Error("Đã xóa nhưng không thể tải lại danh sách.")
          const refreshed = await refreshedResponse.json()
          if (kind === "product")
            setProducts(unwrapAdminList<any>(refreshed, "products"))
          else setCategories(unwrapAdminList<Category>(refreshed, "categories"))
        } else if (kind === "product")
          setProducts((previous) =>
            previous.filter((item) => item._id !== record._id),
          )
        else
          setCategories((previous) =>
            previous.filter((item) => item._id !== record._id),
          )
      }
      notify("Đã xóa dữ liệu.")
    } catch (error) {
      notify(error instanceof Error ? error.message : "Không thể xóa dữ liệu.")
    }
  }
  const saveSettings = (event: FormEvent) => {
    event.preventDefault()
    try {
      localStorage.setItem("bbm-admin-settings", JSON.stringify(settings))
      notify("Đã lưu cài đặt trên trình duyệt này.")
    } catch {
      notify("Không thể lưu cài đặt. Vui lòng kiểm tra bộ nhớ trình duyệt.")
    }
  }
  const updateSetting = (key: string, value: string) =>
    setSettings((previous) => ({ ...previous, [key]: value }))
  const reportDays = Array.from({ length: 8 }, (_, index) => {
    const day = new Date()
    day.setDate(day.getDate() - (7 - index))
    const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
    const dayOrders = orders.filter((order) => {
      if (!order.createdAt) return false
      const orderDate = new Date(order.createdAt)
      if (Number.isNaN(orderDate.getTime())) return false
      const orderDateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")}`
      return orderDateKey === dateKey
    })
    return {
      dateKey,
      label: `${String(day.getDate()).padStart(2, "0")}/${String(day.getMonth() + 1).padStart(2, "0")}`,
      revenue: dayOrders
        .filter((order) => order.status !== "cancelled")
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0),
      orders: dayOrders.length,
    }
  })
  const maxBar = Math.max(
    ...reportDays.map((day) =>
      reportTab === "orders" ? day.orders : day.revenue,
    ),
    1,
  )

  const inputClass =
    "w-full rounded-lg border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1a6fdb]"
  const tableHead =
    "bg-[#f7f9fc] text-xs font-semibold uppercase tracking-wide text-[#71809a]"
  const cardClass = "rounded-xl border border-[#e6eaf2] bg-white shadow-sm"
  const emptyState = (text: string) => (
    <p className="p-10 text-center text-sm text-[#71809a]">{text}</p>
  )
  const searchBox = (placeholder: string) => (
    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dfe6f0] bg-white px-3">
      <span className="text-[#6b7a99]">⌕</span>
      <input
        className="w-full py-2.5 text-sm outline-none"
        placeholder={placeholder}
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          if (currentSection === "customers") setCustomerPage(1)
        }}
      />
    </label>
  )
  const filterSelect = (options: Array<{ value: string; label: string }>) => (
    <select
      className="rounded-lg border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm text-[#35415b]"
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
  const primaryButton = (text: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-lg bg-[#1a6fdb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1558b0]"
    >
      {text}
    </button>
  )
  const updateCustomerStatus = async (customer: any) => {
    const nextStatus = customer.status === "blocked" ? "active" : "blocked"
    try {
      const response = await fetch(
        `${API_URL}/customers/${encodeURIComponent(customer._id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
            status: nextStatus,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(
          data.message || "Không thể cập nhật trạng thái khách hàng.",
        )
      setCustomers((previous) =>
        previous.map((item) =>
          String(item._id) === String(customer._id) ? data : item,
        ),
      )
      notify(
        nextStatus === "blocked"
          ? "Đã khóa khách hàng."
          : "Đã mở khóa khách hàng.",
      )
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái khách hàng.",
      )
    }
  }
  const savePromotionStatus = async (promotion: any, status: string) => {
    try {
      const response = await fetch(`${API_URL}/promotions/${promotion._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promotion.code,
          name: promotion.name,
          type: promotion.type,
          value: promotion.value,
          startDate: promotion.startDate,
          endDate: promotion.endDate,
          status,
        }),
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Không thể lưu trạng thái khuyến mãi.")
      setPromotions((previous) =>
        previous.map((item) =>
          String(item._id) === String(promotion._id) ? data : item,
        ),
      )
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Không thể lưu trạng thái khuyến mãi.",
      )
    }
  }

  return {
    refreshData,
    context,
    navigate,
    location,
    products,
    setProducts,
    categories,
    setCategories,
    orders,
    setOrders,
    customers,
    setCustomers,
    promotions,
    setPromotions,
    settings,
    setSettings,
    loading,
    setLoading,
    loadError,
    setLoadError,
    message,
    setMessage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    customerStatusFilter,
    setCustomerStatusFilter,
    customerPage,
    setCustomerPage,
    editor,
    setEditor,
    form,
    setForm,
    saving,
    setSaving,
    selectedOrderId,
    setSelectedOrderId,
    orderPrintPreviewOpen,
    setOrderPrintPreviewOpen,
    orderEditor,
    setOrderEditor,
    savingOrder,
    setSavingOrder,
    reportTab,
    setReportTab,
    selectedReportDay,
    setSelectedReportDay,
    settingsTab,
    setSettingsTab,
    currentSection,
    menus,
    title,
    statuses,
    notify,
    customerList,
    revenue,
    cancelledOrders,
    matching,
    filteredProducts,
    filteredCategories,
    filteredOrders,
    filteredCustomers,
    customerPageSize,
    customerPageCount,
    pagedCustomers,
    filteredPromotions,
    selectedOrder,
    orderStateLabel,
    statusPill,
    updateOrderStatus,
    beginEditOrder,
    saveOrderChanges,
    productIdForOrder,
    beginEdit,
    saveRecord,
    deleteRecord,
    saveSettings,
    updateSetting,
    reportDays,
    maxBar,
    inputClass,
    tableHead,
    cardClass,
    emptyState,
    searchBox,
    filterSelect,
    primaryButton,
    updateCustomerStatus,
    savePromotionStatus,
  }
}

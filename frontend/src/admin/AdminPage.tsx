import { useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router"
import "./admin.css"
import { AdminProvider, useAdmin } from "./AdminContext"
import AdminDialogs from "./components/AdminDialogs"
import { Sidebar, type NavSection } from "./components/Sidebar"
import { TopBar } from "./components/TopBar"
import CategoriesPage from "./pages/CategoriesPage"
import CustomersPage from "./pages/CustomersPage"
import InventoryPage from "./pages/InventoryPage"
import OrdersPage from "./pages/OrdersPage"
import OverviewPage from "./pages/OverviewPage"
import ProductsPage from "./pages/ProductsPage"
import PromotionsPage from "./pages/PromotionsPage"
import ReportsPage from "./pages/ReportsPage"
import SettingsPage from "./pages/SettingsPage"
import ImportsPage from "./pages/ImportsPage"
import StockReportsPage from "./pages/StockReportsPage"
import { useWarehouse } from "./hooks/useWarehouse"

function AdminWorkspace() {
  const state = useAdmin()
  const warehouse = useWarehouse()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    context,
    currentSection,
    products,
    orders,
    loading,
    loadError,
    message,
  } = state
  const active = (
    currentSection === "overview" ? "dashboard" : currentSection
  ) as NavSection
  const admin = {
    id: context.user.id || context.user.email,
    email: context.user.email,
    fullName: context.user.name,
    role: "super_admin" as const,
    phone: "",
    active: true,
    lastLoginAt: "",
    createdAt: "",
  }
  const pending = orders.filter((o) =>
    ["pending", "processing"].includes(o.status),
  ).length
  const lowStock = products.filter(
    (p) => p.show !== false && Number(p.stock) <= 5,
  ).length
  function select(section: NavSection) {
    state.setSearch("")
    state.setStatusFilter("all")
    state.setCustomerPage(1)
    navigate(section === "dashboard" ? "/admin" : `/admin/${section}`)
  }
  const pages: Record<string, React.ReactNode> = {
    overview: <OverviewPage />,
    products: <ProductsPage />,
    categories: <CategoriesPage />,
    orders: <OrdersPage />,
    customers: <CustomersPage />,
    promotions: <PromotionsPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
    inventory: <InventoryPage />,
    imports: <ImportsPage warehouse={warehouse} />,
    "stock-reports": <StockReportsPage warehouse={warehouse} />,
  }
  return (
    <div className="bbm-admin min-h-screen bg-[#F4F6FA] flex text-slate-900">
      <Sidebar
        active={active}
        onSelect={select}
        admin={admin}
        onLogout={() => {
          context.logout?.()
          navigate("/login")
        }}
        pendingOrdersCount={pending}
        lowStockCount={lowStock}
        pendingImportsCount={
          warehouse.receipts.filter((r) =>
            ["pending", "approving"].includes(r.status),
          ).length
        }
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="min-w-0 flex-1 flex flex-col">
        <TopBar
          section={active}
          admin={admin}
          onOpenMobileMenu={() => setMobileOpen(true)}
          sseConnected={!loading && !loadError}
          lastUpdatedAt=""
        />
        <main className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-5">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500 no-print">
            <span>Xin chào, {context.user.name}</span>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  state.refreshData()
                  void warehouse.refresh()
                }}
                className="hover:text-blue-600"
              >
                Làm mới dữ liệu
              </button>
              <Link to="/" className="font-semibold text-blue-600">
                Về cửa hàng →
              </Link>
            </div>
          </div>
          {loadError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {loadError}
            </div>
          )}
          {message && (
            <div
              role="status"
              className="fixed right-5 top-20 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
            >
              {message}
            </div>
          )}
          {loading ? (
            <p className="rounded-2xl bg-white p-10 text-center">
              Đang tải dữ liệu quản trị...
            </p>
          ) : (
            pages[currentSection] || <p>Không tìm thấy trang quản trị.</p>
          )}
        </main>
      </div>
      <AdminDialogs />
    </div>
  )
}

export default function AdminPage() {
  const context = useOutletContext<any>()
  // Use the existing website's login and admin permission. No donor demo accounts.
  if (!context?.user?.isAdmin)
    return (
      <div className="mx-auto max-w-lg p-10 text-center space-y-4">
        <h1 className="text-xl font-bold">Đăng nhập quản trị</h1>
        <p>Vui lòng đăng nhập bằng tài khoản quản trị của website.</p>
        <Link
          to="/login"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Đăng nhập
        </Link>
      </div>
    )
  return (
    <AdminProvider>
      <AdminWorkspace />
    </AdminProvider>
  )
}

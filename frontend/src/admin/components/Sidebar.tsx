import {
  BarChart3,
  Boxes,
  ChevronRight,
  Cpu,
  KeyRound,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Users,
  X,
} from "lucide-react"
import type { AdminUser } from "../types"
import { ROLE_LABEL } from "../utils/format"
import { BrandLogo } from "./BrandLogo"

export type NavSection = "dashboard" | "orders" | "products" | "inventory" | "imports" | "stock-reports" | "categories" | "customers" | "promotions" | "reports" | "settings"

interface SidebarProps {
  active: NavSection
  onSelect: (section: NavSection) => void
  admin: AdminUser
  onLogout: () => void
  pendingOrdersCount: number
  lowStockCount: number
  pendingImportsCount: number
  mobileOpen: boolean
  onCloseMobile: () => void
}

interface NavGroup {
  title: string
  items: {
    id: NavSection
    label: string
    icon: typeof LayoutDashboard
    count?: number
    superAdminOnly?: boolean
  }[]
}

export function Sidebar({
  active,
  onSelect,
  admin,
  onLogout,
  pendingOrdersCount,
  lowStockCount,
  pendingImportsCount,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const isSuperAdmin = admin.role === "super_admin"

  const groups: NavGroup[] = [
    {
      title: "Điều hành",
      items: [
        {
          id: "dashboard",
          label: isSuperAdmin ? "Tổng quan doanh thu" : "Tổng quan tồn kho",
          icon: LayoutDashboard,
        },
        {
          id: "orders",
          label: "Quản lý đơn hàng",
          icon: ShoppingCart,
          count: pendingOrdersCount,
        },
      ],
    },
    {
      title: "Sản phẩm & Kho vận",
      items: [
        { id: "products", label: "Sản phẩm điện tử", icon: Cpu },
        {
          id: "inventory",
          label: "Tồn kho sản phẩm",
          icon: Boxes,
          count: lowStockCount,
        },
        { id: "categories", label: "Danh mục sản phẩm", icon: PackagePlus },
        {
          id: "imports",
          label: "Nhập hàng & NCC",
          icon: PackagePlus,
          count: pendingImportsCount,
        },
      ],
    },
    {
      title: "Báo cáo kho vận",
      items: [
        {
          id: "stock-reports",
          label: "Báo cáo nhập/xuất/tồn",
          icon: BarChart3,
        },
      ],
    },
    {
      title: isSuperAdmin ? "Tăng trưởng & Tài chính" : "Báo cáo kho vận",
      items: [
        {
          id: "customers",
          label: "Khách hàng",
          icon: Users,
          superAdminOnly: true,
        },
        {
          id: "promotions",
          label: "Khuyến mãi",
          icon: Tag,
          superAdminOnly: true,
        },
        {
          id: "reports",
          label: isSuperAdmin ? "Báo cáo bán hàng" : "Báo cáo nhập/xuất/tồn",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Hệ thống",
      items: [
        {
          id: "settings",
          label: isSuperAdmin ? "Cài đặt cửa hàng" : "Hồ sơ & Mật khẩu",
          icon: isSuperAdmin ? Settings : KeyRound,
        },
      ],
    },
  ]

  const visibleGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => !item.superAdminOnly || isSuperAdmin),
    }))
    .filter((g) => g.items.length > 0)

  const sidebarContent = (
    <aside className="w-[268px] h-full bg-[#090F1E] text-slate-300 flex flex-col border-r border-slate-800/90 select-none">
      {/* Top-Left Brand Lockup */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
        <BrandLogo size="md" darkSurface />
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Đóng menu"
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav
        aria-label="Menu điều hướng quản trị"
        className="flex-1 overflow-y-auto px-3 py-5 space-y-6"
      >
        {visibleGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wide text-slate-500">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item.id)
                      onCloseMobile()
                    }}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-white" : "text-slate-400"
                        }`}
                      />
                      <span className="whitespace-nowrap truncate">
                        {item.label}
                      </span>
                    </span>
                    {typeof item.count === "number" && item.count > 0 ? (
                      <span
                        className={`font-mono tabular-nums text-[11px] px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : item.id === "inventory"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {item.count}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin Footer — keeps exact Super Admin / Admin identity */}
      <div className="p-3 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div
            className={`w-9 h-9 rounded-lg text-white flex items-center justify-center shrink-0 ${
              isSuperAdmin ? "bg-blue-600" : "bg-slate-700"
            }`}
          >
            {isSuperAdmin ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-display font-bold text-white truncate">
              {ROLE_LABEL[admin.role]}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {isSuperAdmin ? "Quản trị cửa hàng" : "Quản trị cửa hàng"}
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Đăng xuất"
            aria-label="Đăng xuất tài khoản"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop persistent sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0 no-print">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  )
}

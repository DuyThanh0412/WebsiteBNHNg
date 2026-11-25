import { Menu, Shield, ShieldCheck } from "lucide-react"
import type { AdminUser } from "../types"
import { ROLE_LABEL } from "../utils/format"
import type { NavSection } from "./Sidebar"

interface TopBarProps {
  section: NavSection
  admin: AdminUser
  onOpenMobileMenu: () => void
  sseConnected: boolean
  lastUpdatedAt: string
}

export function TopBar({
  section,
  admin,
  onOpenMobileMenu,
  sseConnected,
  lastUpdatedAt,
}: TopBarProps) {
  const isSuperAdmin = admin.role === "super_admin"

  const sectionTitle: Record<NavSection, string> = {
    dashboard: isSuperAdmin
      ? "Tổng quan cửa hàng"
      : "Tổng quan tồn kho & Nhập xuất kho",
    orders: "Quản lý đơn hàng",
    products: "Danh mục sản phẩm điện tử",
    inventory: "Tồn kho sản phẩm",
    imports: "Nhập hàng & NCC",
    "stock-reports": "Báo cáo nhập/xuất/tồn",
    categories: "Danh mục sản phẩm",
    customers: "Khách hàng",
    promotions: "Khuyến mãi",
    reports: isSuperAdmin
      ? "Báo cáo bán hàng"
      : "Báo cáo nhập / xuất / tồn kho",
    settings: isSuperAdmin ? "Cài đặt cửa hàng" : "Hồ sơ & Đổi mật khẩu",
  }

  return (
    <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 no-print">
      {/* Left: Mobile menu button + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Mở menu điều hướng"
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="font-semibold text-slate-400 whitespace-nowrap shrink-0 hidden sm:inline">
            BigBangMart
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="font-display font-bold text-slate-900 truncate">
            {sectionTitle[section]}
          </h1>
        </div>
      </div>

      {/* Right: SSE status and Role label */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums pr-3 border-r border-slate-200">
          <span
            className={`w-2 h-2 rounded-full ${
              sseConnected ? "bg-emerald-600" : "bg-slate-400"
            }`}
          />
          <span>{sseConnected ? "Đã tải dữ liệu" : "Chưa tải đủ dữ liệu"}</span>
          {lastUpdatedAt && (
            <>
              <span aria-hidden="true">·</span>
              <span>{lastUpdatedAt}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          {isSuperAdmin ? (
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          ) : (
            <Shield className="w-4 h-4 text-slate-500" />
          )}
          <span className="whitespace-nowrap">{ROLE_LABEL[admin.role]}</span>
        </div>
      </div>
    </header>
  )
}

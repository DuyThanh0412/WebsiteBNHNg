import type {
  AdminRole,
  ImportStatus,
  MovementType,
  OrderStatus,
} from "../types"

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

export function formatCompactVND(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(2).replace(".", ",")} Tỷ`
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1).replace(".", ",")} Tr`
  }
  if (abs >= 1_000) {
    return `${sign}${Math.round(abs / 1_000)} K`
  }
  return `${sign}${abs} ₫`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value)
}

export function formatDateTime(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function formatTimeOnly(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d)
}

export const ORDER_STATUS_META: Record<OrderStatus, {
  label: string
  textClass: string
  bgClass: string
  borderClass: string
}> = {
  pending: {
    label: "Chờ xác nhận",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  packing: {
    label: "Đang đóng gói",
    textClass: "text-blue-700",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  shipping: {
    label: "Đang vận chuyển",
    textClass: "text-indigo-700",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200",
  },
  completed: {
    label: "Hoàn thành",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
  cancelled: {
    label: "Đã hủy",
    textClass: "text-red-700",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
  },
  returned: {
    label: "Hoàn trả",
    textClass: "text-slate-700",
    bgClass: "bg-slate-100",
    borderClass: "border-slate-300",
  },
}

export const IMPORT_STATUS_META: Record<ImportStatus, {
  label: string
  textClass: string
  bgClass: string
  borderClass: string
}> = {
  pending: {
    label: "Chờ duyệt nhập",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  approved: {
    label: "Đã nhập kho",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
  cancelled: {
    label: "Đã hủy phiếu",
    textClass: "text-red-700",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
  },
}

export const MOVEMENT_LABEL: Record<MovementType, string> = {
  import: "Nhập hàng NCC",
  sale: "Xuất bán đơn hàng",
  adjust_in: "Kiểm kho (Tăng)",
  adjust_out: "Kiểm kho (Giảm)",
  return: "Hoàn nhập đơn hủy/trả",
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "Quản trị viên",
  admin: "Quản trị viên",
}

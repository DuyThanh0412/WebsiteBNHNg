export type AdminRole = "super_admin" | "admin"

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: AdminRole
  phone: string
  active: boolean
  lastLoginAt: string
  createdAt: string
}

export type ProductCategory = "Điện thoại" | "Laptop & Tablet" | "Âm thanh" | "Phụ kiện & Sạc" | "Thiết bị thông minh"

export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  category: ProductCategory
  sellPrice: number
  costPrice: number
  stock: number
  reservedStock: number
  minStock: number
  warrantyMonths: number
  status: "active" | "inactive"
  updatedAt: string
}

export type SalesChannel = "Website BigBangMart"

export type OrderStatus = "pending" | "packing" | "shipping" | "completed" | "cancelled" | "returned"

export type PaymentMethod = "COD" | "VNPay" | "MoMo" | "Chuyển khoản"

export interface OrderItem {
  productId: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  costPrice: number
}

export interface Order {
  id: string
  code: string
  channel: SalesChannel
  customerId: string
  customerName: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shippingFee: number
  platformFee: number
  totalAmount: number
  paymentMethod: PaymentMethod
  paymentStatus: "paid" | "unpaid" | "refunded"
  status: OrderStatus
  trackingCode: string
  note: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  code: string
  name: string
  contactName: string
  phone: string
  email: string
  address: string
  category: string
}

export type ImportStatus = "pending" | "approved" | "cancelled"

export interface StockImportItem {
  productId: string
  sku: string
  name: string
  quantity: number
  unitCost: number
}

export interface StockImport {
  id: string
  code: string
  supplierId: string
  supplierName: string
  warehouse: string
  items: StockImportItem[]
  totalCost: number
  status: ImportStatus
  note: string
  createdBy: string
  approvedBy?: string
  createdAt: string
  approvedAt?: string
}

export type MovementType = "import" | "sale" | "adjust_in" | "adjust_out" | "return"

export interface InventoryMovement {
  id: string
  productId: string
  sku: string
  productName: string
  type: MovementType
  quantityDelta: number
  stockBefore: number
  stockAfter: number
  referenceCode: string
  reason: string
  actor: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  city: string
  tier: "Thành viên" | "Bạc" | "Vàng" | "Kim cương"
  totalOrders: number
  totalSpent: number
  lastOrderAt: string
}

export interface Voucher {
  id: string
  code: string
  title: string
  channel: string
  discountType: "percent" | "fixed"
  discountValue: number
  minOrderValue: number
  usageCount: number
  usageLimit: number
  active: boolean
  expiresAt: string
}

export interface ChannelConfig {
  id: string
  name: SalesChannel
  shopName: string
  feeRatePercent: number
  autoSyncStock: boolean
  autoConfirmOrder: boolean
  connected: boolean
  lastSyncedAt: string
}

export interface AuditLog {
  id: string
  actorName: string
  actorEmail: string
  action: string
  target: string
  detail: string
  createdAt: string
}

export interface RevenuePoint {
  label: string
  revenue: number
  profit: number
  orders: number
  fees: number
}

export interface DashboardSnapshot {
  kpis: {
    todayRevenue: number
    yesterdayRevenue: number
    todayOrders: number
    pendingOrders: number
    completedOrdersRate: number
    inventoryValuation: number
    totalStockUnits: number
    lowStockCount: number
    grossProfitToday: number
    grossMarginPercent: number
  }
  hourlySeries: RevenuePoint[]
  dailySeries7d: RevenuePoint[]
  dailySeries30d: RevenuePoint[]
  channelBreakdown: {
    channel: SalesChannel
    revenue: number
    orders: number
    fees: number
    sharePercent: number
  }[]
  topProducts: {
    productId: string
    sku: string
    name: string
    category: ProductCategory
    unitsSold: number
    revenue: number
    stock: number
  }[]
  recentOrders: Order[]
  lowStockProducts: Product[]
  liveMode: boolean
  serverTime: string
}

export interface StoreInfo {
  storeName: string
  hotline: string
  email: string
  warehouseAddress: string
  taxCode: string
}

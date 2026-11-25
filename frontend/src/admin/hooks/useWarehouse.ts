import { useCallback, useEffect, useState } from "react"
import { API_URL } from "../../shared/api"

export interface SupplierRecord {
  _id: string
  name: string
  contactName: string
  phone: string
  email: string
  address: string
}
export interface ReceiptRecord {
  supplierId?: string
  approvedAt?: string
  _id: string
  code: string
  supplierName: string
  status: "pending" | "approving" | "approved" | "cancelled"
  items: {
    productId: string
    name: string
    quantity: number
    unitCost: number
  }[]
  totalCost: number
  note: string
  createdAt: string
  warehouse?: string
  createdBy?: string
  approvedBy?: string
}
export async function warehouseApi(
  path: string,
  body?: unknown,
  method = "POST",
) {
  const response = await fetch(
    `${API_URL}${path}`,
    body === undefined
      ? undefined
      : {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
  )
  const data = await response.json()
  if (!response.ok)
    throw new Error(data.message || "Không thể tải dữ liệu kho.")
  return data
}
export function useWarehouse() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([])
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [s, r] = await Promise.all([
        warehouseApi("/suppliers"),
        warehouseApi("/stock-imports"),
      ])
      setSuppliers(s)
      setReceipts(r)
      setError("")
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void refresh()
  }, [refresh])
  return { suppliers, receipts, error, loading, refresh }
}
export type WarehouseState = ReturnType<typeof useWarehouse>

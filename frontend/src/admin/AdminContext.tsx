import { createContext, useContext, type ReactNode } from "react"
import { useAdminController } from "./hooks/useAdminController"
const AdminContext =
  createContext<ReturnType<typeof useAdminController> | null>(null)
export function AdminProvider({ children }: { children: ReactNode }) {
  const state = useAdminController()
  return <AdminContext.Provider value={state}>{children}</AdminContext.Provider>
}
export function useAdmin() {
  const state = useContext(AdminContext)
  if (!state) throw new Error("AdminProvider is required")
  return state
}

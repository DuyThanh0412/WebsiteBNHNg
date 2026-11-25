import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  within,
} from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { MemoryRouter, Routes, Route, Outlet } from "react-router"
import AdminPage from "./AdminPage"
import { buildRevenueSeries } from "./utils/metrics"

const product = {
  _id: "p1",
  name: "Điện thoại kiểm thử",
  category: "Điện thoại",
  price: 100000,
  stock: 3,
  show: true,
}
const order = {
  _id: "o1",
  orderNumber: "TEST-001",
  customer: {
    name: "Khách kiểm thử",
    phone: "0900000000",
    address: "Biên Hòa",
  },
  items: [{ productId: "p1", name: product.name, quantity: 1, price: 100000 }],
  total: 100000,
  subtotal: 100000,
  status: "pending",
  paymentMethod: "cod",
  createdAt: new Date().toISOString(),
}
let fetchMock: ReturnType<typeof vi.fn>
function mount(path = "/admin", isAdmin = true) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          element={
            <Outlet
              context={{
                user: {
                  name: "Quản trị thử",
                  email: "test@example.test",
                  isAdmin,
                },
                logout: vi.fn(),
              }}
            />
          }
        >
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}
beforeEach(() => {
  localStorage.clear()
  fetchMock = vi.fn(async (input: string, options?: RequestInit) => {
    const url = new URL(String(input))
    const path = url.pathname
    const method = options?.method || "GET"
    const data = options?.body ? JSON.parse(String(options.body)) : {}
    let body: any = []
    if (path === "/api/products")
      body = method === "POST" ? { ...data, _id: "p2" } : [product]
    if (path === "/api/products/p1") body = { ...product, ...data }
    if (path === "/api/categories")
      body =
        method === "POST"
          ? { ...data, _id: "c2" }
          : [{ _id: "c1", name: "Điện thoại" }]
    if (path === "/api/orders") body = [order]
    if (path === "/api/orders/o1") body = { ...order, ...data }
    if (path === "/api/suppliers")
      body =
        method === "POST"
          ? { ...data, _id: "s2" }
          : [{ _id: "s1", name: "Nhà cung cấp thử" }]
    if (path === "/api/stock-report")
      body = {
        rows: [
          {
            productId: "p1",
            name: product.name,
            opening: 2,
            incoming: 3,
            outgoing: 2,
            closing: 3,
          },
        ],
        movements: [],
      }
    if (path === "/api/customers")
      body =
        method === "POST"
          ? { ...data, _id: "u2" }
          : [
              {
                _id: "u1",
                name: "Khách kiểm thử",
                status: "active",
                orderCount: 1,
                totalSpent: 100000,
              },
            ]
    if (path === "/api/promotions")
      body =
        method === "POST"
          ? { ...data, _id: "v2" }
          : [
              {
                _id: "v1",
                code: "TEST10",
                name: "Ưu đãi kiểm thử",
                status: "active",
                value: 10,
              },
            ]
    return { ok: true, json: async () => body } as Response
  })
  vi.stubGlobal("fetch", fetchMock)
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("Integrated admin using original MongoDB API contract", () => {
  it("requires the existing website admin permission before fetching", () => {
    mount("/admin", false)
    expect(screen.getByText("Đăng nhập quản trị")).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it("loads actual APIs and refreshes without losing the admin session", async () => {
    mount()
    await screen.findByRole("heading", { level: 2, name: "Tổng quan cửa hàng" })
    expect(screen.getByText("TEST-001")).toBeInTheDocument()
    const count = fetchMock.mock.calls.length
    fireEvent.click(screen.getByText("Làm mới dữ liệu"))
    await waitFor(() => expect(fetchMock.mock.calls.length).toBe(count + 7))
    await screen.findByRole("heading", { level: 2, name: "Tổng quan cửa hàng" })
    expect(
      fetchMock.mock.calls.every(([u]) => !String(u).includes("/api/auth")),
    ).toBe(true)
  })
  it("navigates to products, saves an edit through PUT, and updates the displayed row", async () => {
    mount()
    await screen.findByRole("heading", { level: 2, name: "Tổng quan cửa hàng" })
    fireEvent.click(screen.getByRole("button", { name: "Sản phẩm điện tử" }))
    fireEvent.click(await screen.findByRole("button", { name: "Sửa sản phẩm" }))
    fireEvent.change(screen.getByLabelText("Tên sản phẩm"), {
      target: { value: "Sản phẩm đã sửa" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }))
    await screen.findByText("Sản phẩm đã sửa")
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/products/p1"),
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining("Sản phẩm đã sửa"),
      }),
    )
  })
  it("uses original order status values and preserves the invoice preview", async () => {
    mount("/admin/orders")
    fireEvent.change(
      await screen.findByLabelText("Cập nhật trạng thái đơn hàng"),
      { target: { value: "shipped" } },
    )
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/orders/o1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ status: "shipped" }),
        }),
      ),
    )
    fireEvent.click(screen.getByRole("button", { name: "In đơn hàng" }))
    expect(
      screen.getByRole("dialog", { name: "Xem trước đơn hàng" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Đóng xem trước" }))
    fireEvent.click(screen.getByRole("button", { name: /Chỉnh sửa đơn/ }))
    expect(screen.getByLabelText("Tên khách hàng")).toHaveValue(
      "Khách kiểm thử",
    )
  })
  it.each([
    ["/admin/categories", "Danh mục sản phẩm"],
    ["/admin/customers", "Khách hàng"],
    ["/admin/promotions", "Khuyến mãi"],
    ["/admin/reports", "Báo cáo"],
    ["/admin/settings", "Cài đặt"],
    ["/admin/inventory", "Tồn kho sản phẩm"],
    ["/admin/imports", "Nhập hàng & NCC"],
    ["/admin/stock-reports", "Báo cáo Nhập / Xuất / Tồn kho theo SKU"],
  ])("renders extracted route %s", async (path, title) => {
    mount(path)
    await waitFor(() =>
      expect(
        screen.queryByText("Đang tải dữ liệu quản trị..."),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole("heading", { level: 2, name: title }),
    ).toBeInTheDocument()
  })
  it("opens receipt details with supplier contacts and item price calculations", async () => {
    const original = fetchMock.getMockImplementation() as (url: string, options?: RequestInit) => Promise<Response>
    fetchMock.mockImplementation(async (url: string, options?: RequestInit) => {
      const path = new URL(String(url)).pathname
      if (path === "/api/suppliers")
        return {
          ok: true,
          json: async () => [
            {
              _id: "s1",
              name: "NCC kiểm thử",
              contactName: "Nguyễn An",
              phone: "0900000001",
              email: "supplier@example.com",
              address: "Địa chỉ mẫu",
            },
          ],
        } as Response
      if (path === "/api/stock-imports")
        return {
          ok: true,
          json: async () => [
            {
              _id: "r1",
              code: "PN-TEST-001",
              supplierId: "s1",
              supplierName: "NCC kiểm thử",
              status: "pending",
              warehouse: "Kho thử",
              createdBy: "Quản trị thử",
              createdAt: "2026-11-16T03:00:00Z",
              totalCost: 160000,
              note: "Lô hàng kiểm thử",
              items: [
                {
                  productId: "p1",
                  name: "Điện thoại kiểm thử",
                  quantity: 2,
                  unitCost: 50000,
                },
                {
                  productId: "p2",
                  name: "Sạc kiểm thử",
                  quantity: 3,
                  unitCost: 20000,
                },
              ],
            },
          ],
        } as Response
      return original(url, options)
    })
    mount("/admin/imports")
    fireEvent.click(await screen.findByRole("button", { name: "Xem chi tiết" }))
    const detail = screen.getByRole("region", {
      name: "Chi tiết phiếu nhập PN-TEST-001",
    })
    for (const text of [
      "NCC kiểm thử",
      "Nguyễn An",
      "0900000001",
      "supplier@example.com",
      "Địa chỉ mẫu",
      "Kho thử",
      "5 sản phẩm / 2 mặt hàng",
    ])
      expect(within(detail).getByText(text)).toBeInTheDocument()
    const table = within(detail).getByRole("table")
    expect(within(table).getByText("₫100.000")).toBeInTheDocument()
    expect(within(table).getByText("₫60.000")).toBeInTheDocument()
    expect(within(detail).getByText("₫160.000")).toBeInTheDocument()
    fireEvent.click(
      within(detail).getByRole("button", { name: "Đóng chi tiết phiếu nhập" }),
    )
    expect(
      screen.queryByRole("region", { name: "Chi tiết phiếu nhập PN-TEST-001" }),
    ).not.toBeInTheDocument()
  })
  it("saves a supplier through the warehouse API", async () => {
    mount("/admin/imports")
    fireEvent.click(await screen.findByRole("button", { name: "Nhà cung cấp" }))
    fireEvent.click(
      await screen.findByRole("button", { name: "Thêm nhà cung cấp" }),
    )
    fireEvent.change(screen.getByLabelText("Tên nhà cung cấp *"), {
      target: { value: "NCC mới" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Lưu nhà cung cấp" }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/suppliers"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"name":"NCC mới"'),
        }),
      ),
    )
  })
  it("creates a pending receipt with product quantities and cost", async () => {
    mount("/admin/imports")
    const create = await screen.findByRole("button", { name: "Tạo phiếu nhập" })
    await waitFor(() => expect(create).toBeEnabled())
    fireEvent.click(create)
    fireEvent.change(screen.getByLabelText("Nhà cung cấp *"), {
      target: { value: "s1" },
    })
    fireEvent.change(screen.getByLabelText("Sản phẩm"), {
      target: { value: "p1" },
    })
    fireEvent.change(screen.getByLabelText("Số lượng"), {
      target: { value: "4" },
    })
    fireEvent.change(screen.getByLabelText("Giá nhập (₫)"), {
      target: { value: "50000" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Lưu phiếu chờ duyệt" }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/stock-imports"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            supplierId: "s1",
            items: [{ productId: "p1", quantity: 4, unitCost: 50000 }],
            note: "",
            warehouse: "",
            createdBy: "Quản trị thử",
          }),
        }),
      ),
    )
  })
  it("submits an export with a retry reference when randomUUID is unavailable", async () => {
    vi.stubGlobal("crypto", {
      getRandomValues: crypto.getRandomValues.bind(crypto),
    })
    mount("/admin/stock-reports")
    expect(
      await screen.findByRole("heading", {
        name: "Bảng tổng hợp Nhập – Xuất – Tồn chi tiết theo sản phẩm",
      }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText("Lọc theo ngày & thao tác kho"))
    fireEvent.click(
      screen.getByRole("button", { name: "Ghi nhận xuất / điều chỉnh" }),
    )
    fireEvent.change(screen.getByLabelText("Sản phẩm"), {
      target: { value: "p1" },
    })
    fireEvent.change(screen.getByLabelText("Số lượng"), {
      target: { value: "2" },
    })
    fireEvent.change(screen.getByLabelText("Lý do / mã đơn liên quan *"), {
      target: { value: "Xuất TEST-001" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Lưu giao dịch" }))
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/stock-movements"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"quantity":2'),
        }),
      ),
    )
    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith("/stock-movements"),
    )
    expect(JSON.parse(String(call?.[1]?.body))).toMatchObject({
      productId: "p1",
      type: "export",
      reason: "Xuất TEST-001",
      requestId: expect.stringMatching(
        /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/,
      ),
    })
  })
  it("shows API failures instead of loading donor demo data", async () => {
    fetchMock.mockRejectedValue(new Error("Offline"))
    mount()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Không tải được sản phẩm",
    )
  })
  it("excludes cancelled orders and does not count future dates", () => {
    const now = new Date(2026, 10, 16, 12)
    const result = buildRevenueSeries(
      [
        {
          total: 100,
          status: "delivered",
          createdAt: new Date(2026, 10, 16, 9),
        },
        {
          total: 900,
          status: "cancelled",
          createdAt: new Date(2026, 10, 16, 9),
        },
        {
          total: 800,
          status: "delivered",
          createdAt: new Date(2026, 10, 17, 9),
        },
      ],
      "7d",
      now,
    )
    expect(result.reduce((s, p) => s + p.revenue, 0)).toBe(100)
    expect(result.reduce((s, p) => s + p.orders, 0)).toBe(1)
  })
})

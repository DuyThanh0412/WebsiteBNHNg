# BigBangMart — admin đã tách file và ghép giao diện

## Bản này thay đổi gì?

Website gốc là WebsiteBNHNg-main(2).rar. Đã lấy Sidebar, TopBar, BrandLogo và RevenueChart từ bigbangmart-admin.zip để ghép vào website gốc. Trang tổng quan được nối với danh sách đơn, sản phẩm và khách hàng từ API của website.

Các màn hình nghiệp vụ sản phẩm, danh mục, đơn hàng, khách hàng, khuyến mãi, báo cáo, cài đặt được tách ra từ admin cũ và giữ chức năng hiện có. Đây là bản ghép bố cục mới với nghiệp vụ cũ, không phải chuyển toàn bộ chức năng của admin demo sang MongoDB.

- Các trang admin nằm trong frontend/src/admin/pages/.
- Quản lý state, tải API và thao tác lưu/xóa nằm trong frontend/src/admin/hooks/useAdminController.tsx.
- Menu, thanh tiêu đề, biểu đồ, hộp sửa dữ liệu và hóa đơn nằm trong frontend/src/admin/components/.
- frontend/src/admin/AdminPage.tsx ghép các thành phần và kiểm tra quyền vào giao diện.
- frontend/src/shared/api.ts chứa địa chỉ API; frontend/src/shared/catalog.ts chứa tiện ích dùng chung.
- App.tsx giữ giao diện cửa hàng và khai báo route /admin/*; hai khối admin cũ đã được đưa ra ngoài.
- Trang tồn kho đọc cùng trường stock của sản phẩm. Đã bổ sung phiếu nhập, nhà cung cấp và nhật ký biến động kho trong MongoDB.
- Không dùng server.ts, JSON database hay tài khoản mẫu của admin demo.
- Bổ sung backend kho trong `backend/warehouse.js`; xử lý thanh toán SePay và mật khẩu giữ nguyên.

## Cách mở và chạy trên Windows

1. Giải nén bản ZIP này vào một thư mục mới. Trong VS Code chọn File → Open Folder và mở WebsiteBNHNg-main.
2. Cài Node.js phù hợp với Vite 8 (Node 22.12 trở lên). Kiểm tra bằng `node -v` và `npm -v`.
3. Mở MongoDB mà website cũ đang dùng. Chép backend/.env từ dự án cũ của bạn sang backend/.env của bản này. File .env riêng không được đóng gói lại. Nếu chưa cấu hình, backend mặc định dùng mongodb://127.0.0.1:27017/bigbangmart.
4. Không chạy lại seed/import nếu muốn tiếp tục dùng dữ liệu đã có.

Terminal thứ nhất, bắt đầu tại thư mục WebsiteBNHNg-main:

```powershell
cd backend
npm install
npm start
```

Terminal thứ hai, cũng bắt đầu tại thư mục WebsiteBNHNg-main:

```powershell
cd frontend
npm install
npm run dev
```

Mở địa chỉ Local được Vite in ra, mặc định http://localhost:8443. Đăng nhập bằng tài khoản quản trị hiện tại rồi vào /admin. Backend gốc vẫn hỗ trợ tài khoản thực hành `admin` với mật khẩu `123`. Không dùng tài khoản của bigbangmart-admin.zip.

Nếu API ở máy/cổng khác, tạo frontend/.env.local với VITE_API_URL trỏ tới URL đầy đủ kết thúc bằng /api, rồi khởi động lại Vite. Mặc định frontend gọi cùng hostname, cùng protocol với trình duyệt, cổng 5000.

Nút “Làm mới dữ liệu” trong admin tải lại API mà không tải lại toàn bộ trình duyệt. Phiên đăng nhập gốc vẫn lưu trong state của React; tải lại tab trình duyệt cần đăng nhập lại như dự án ban đầu.

## Tìm file để sửa trong VS Code

| Muốn sửa | File trong frontend/src/ |
| --- | --- |
| Bố cục và chọn trang | admin/AdminPage.tsx |
| Menu | admin/components/Sidebar.tsx |
| Thanh tiêu đề | admin/components/TopBar.tsx |
| Tổng quan | admin/pages/OverviewPage.tsx |
| Sản phẩm | admin/pages/ProductsPage.tsx |
| Danh mục | admin/pages/CategoriesPage.tsx |
| Đơn hàng | admin/pages/OrdersPage.tsx |
| Khách hàng | admin/pages/CustomersPage.tsx |
| Khuyến mãi | admin/pages/PromotionsPage.tsx |
| Tồn kho | admin/pages/InventoryPage.tsx |
| Báo cáo | admin/pages/ReportsPage.tsx |
| Cài đặt | admin/pages/SettingsPage.tsx |
| Form sửa và in hóa đơn | admin/components/AdminDialogs.tsx |
| Tải dữ liệu, lưu, xóa | admin/hooks/useAdminController.tsx |
| Địa chỉ API | shared/api.ts |

## Phạm vi và dữ liệu

- Các API đang dùng: /api/products, /api/categories, /api/orders, /api/customers, /api/promotions trên backend gốc.
- Chỉnh sửa dùng chính POST/PUT/DELETE hiện có. Trạng thái đơn vẫn là pending, processing, shipped, delivered, cancelled; không chuyển sang quy ước khác của demo.
- Danh sách lồng products/categories của dữ liệu cũ vẫn được xử lý qua unwrapAdminList.
- Biểu đồ mới tính giá trị đơn không hủy, không giả lập lợi nhuận khi không có giá vốn. Đây chưa phải tiền thực thu ngân hàng.
- Nhập hàng, nhà cung cấp và báo cáo kho đã được triển khai với dữ liệu MongoDB thực. Website hiện tại dùng cờ isAdmin; không thêm vai trò quản lý kho riêng.
- Cài đặt vẫn lưu localStorage trên trình duyệt như bản gốc. Các ô thanh toán tại đây không thay thế backend/.env hay cấu hình SePay thực tế.
- Chưa thay đổi cơ chế xác thực/phân quyền API backend của dự án gốc.

## Kiểm tra

Tại frontend:

```powershell
npm run typecheck
npm run test:admin
npm run build
```

Bản bàn giao đã vượt kiểm tra TypeScript, build Vite và 12 kiểm tra tích hợp giao diện (API giả lập): quyền truy cập giao diện, tải/làm mới dữ liệu, sửa sản phẩm qua PUT, cập nhật trạng thái đơn, mở hóa đơn và form sửa đơn, các route tách riêng, báo lỗi API và thống kê loại trừ đơn hủy.

Phần kho đã được kiểm tra với MongoDB local bằng cơ sở dữ liệu thử riêng, không sửa dữ liệu cửa hàng. Chưa kiểm thử SePay. Không dùng đơn thật để thử thanh toán.

## Nhập hàng & nhà cung cấp

Dữ liệu mẫu cho hai trang kho có thể thêm bằng `npm run seed:warehouse` trong thư mục `backend`. Lệnh thêm 4 nhà cung cấp có thông tin liên hệ giả, 6 sản phẩm gắn nhãn `[Mẫu]` (ẩn khỏi cửa hàng), 4 phiếu nhập gồm 3 đã duyệt và 1 chờ duyệt, cùng giao dịch xuất/điều chỉnh mẫu. Lệnh dùng cấu hình `MONGO_URI` hiện tại và mã cố định để chạy lại không cộng tồn hoặc tạo dữ liệu trùng; không thay đổi sản phẩm cũ.

Sau khi cập nhật mã nguồn, khởi động lại backend (`npm start` trong thư mục backend) để nạp các API mới. MongoDB hiện tại có thể chạy standalone; không cần seed, migration hay replica set.

1. Mở **Nhập hàng & NCC** → **Nhà cung cấp** → **Thêm nhà cung cấp**. Có thể sửa thông tin liên hệ sau đó.
2. Chọn **Phiếu nhập hàng** → **Tạo phiếu nhập**, chọn nhà cung cấp, thêm các sản phẩm, số lượng và giá nhập. Lưu phiếu chưa làm tăng tồn kho.
3. Chọn **Duyệt nhập kho** để cộng tồn và ghi lịch sử. Có thể hủy phiếu đang chờ duyệt; phiếu đã duyệt không được hủy trực tiếp. Bấm mã phiếu để xem chi tiết.
4. Nếu duyệt nhiều sản phẩm bị gián đoạn, phiếu giữ trạng thái **Đang duyệt — cần tiếp tục**. Bấm **Tiếp tục duyệt**; các dòng đã nhập sẽ không bị cộng lần nữa. Trong lúc này, báo cáo hiển thị các dòng thực tế đã nhập. Dùng điều chỉnh kho nếu cần đảo một giao dịch đã ghi.

## Báo cáo nhập/xuất/tồn

Giao diện đã được cập nhật theo mẫu: bốn thẻ chỉ số và bảng tổng hợp theo SKU, danh mục, tổng nhập, tổng xuất, điều chỉnh, tồn khả dụng, giữ đơn / định mức và tình trạng. Tồn khả dụng bằng tồn hiện tại trừ số lượng trong đơn `pending`/`processing` (không âm); mặc định định mức là 5 nếu sản phẩm chưa có `minStock`. Điều chỉnh được tách khỏi số lượng nhập/xuất. Lọc ngày và nhật ký nằm trong các mục có thể mở rộng bên dưới bảng.

Trang phiếu nhập dùng bảng, có kho nhận, người lập và người duyệt cho phiếu mới. Nút Xóa chỉ ẩn phiếu khỏi danh sách, giữ dữ liệu và nhật ký kho để đối chiếu; không đảo số tồn. Không thể xóa phiếu đang duyệt. Cần khởi động lại backend để nạp API Xóa và các trường mới.

- Đường dẫn: `/admin/stock-reports`. Chọn từ ngày/đến ngày (giờ Việt Nam), xem tồn đầu kỳ, nhập, xuất, tồn cuối kỳ và nhật ký. Có thể xuất bảng tổng hợp ra CSV.
- **Ghi nhận xuất / điều chỉnh**: chọn sản phẩm, loại giao dịch, số lượng nguyên dương và lý do hoặc mã đơn. Không cho phép xuất quá số tồn hiện có.
- Xuất kho được ghi thủ công tại đây; thay đổi trạng thái đơn bán hàng chưa tự động trừ tồn. Không ghi thêm một giao dịch xuất nếu đã điều chỉnh giảm tồn cho cùng đơn tại trang sản phẩm.
- Thay đổi số tồn ở form sản phẩm được ghi thành giao dịch điều chỉnh. Lịch sử trước khi chức năng này được bật không thể khôi phục; tồn cũ là số dư đầu kỳ.
- Sản phẩm đã có phiếu nhập hoặc lịch sử kho cần được ẩn thay vì xóa để giữ tham chiếu. Với dữ liệu sản phẩm lồng kiểu cũ, xóa có thể đổi mã theo vị trí nên bị chặn khi đã có dữ liệu kho.
- Nhà cung cấp lưu trong collection `suppliers`, phiếu nhập trong `stock_receipts`; lịch sử nằm ở `inventoryMovements` cùng bản ghi sản phẩm để số tồn và nhật ký được cập nhật đồng thời.
- File giao diện: `frontend/src/admin/pages/ImportsPage.tsx`, `StockReportsPage.tsx`; API và tải dữ liệu kho: `frontend/src/admin/hooks/useWarehouse.ts`.

Kiểm tra phần kho:

```powershell
cd backend
npx jest warehouse.test.js --runInBand
node warehouse.mongo-check.cjs
```

Lệnh thứ hai cần MongoDB local cổng 27017, tạo cơ sở dữ liệu `warehouse_check_<mã ngẫu nhiên>` rồi xóa đúng cơ sở dữ liệu thử đó sau khi hoàn tất.

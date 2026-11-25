# Đổi và lấy lại mật khẩu

- Sau khi đăng nhập, khách chọn **Đổi mật khẩu** cạnh tên tài khoản, nhập mật khẩu hiện tại và xác nhận mật khẩu mới. Đổi xong cần đăng nhập lại.
- Tại màn hình đăng nhập, chọn **Quên mật khẩu?**, nhập email đã đăng ký. Email chứa liên kết dùng một lần trong 15 phút. Khi đổi mật khẩu, mọi liên kết khôi phục cũ của tài khoản đều bị hủy.
- Mật khẩu mới được băm bằng scrypt. Tài khoản cũ vẫn đăng nhập được và được chuyển sang mật khẩu băm khi đăng nhập thành công.

## Gmail

Điền vào `backend/.env` (không commit file này):

```dotenv
APP_URL=http://192.168.1.9:8443
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM=your-email@gmail.com
```

`APP_URL` là địa chỉ frontend khách hàng truy cập được. Đổi địa chỉ này khi chuyển máy chủ; khi triển khai thật dùng HTTPS. Không lấy địa chỉ này từ dữ liệu người gửi yêu cầu.

Bật xác minh 2 bước cho tài khoản Google gửi thư, sau đó tạo mật khẩu ứng dụng tại https://myaccount.google.com/apppasswords. Điền mật khẩu ứng dụng vào `SMTP_PASS`, không dùng mật khẩu Gmail thông thường. Một số tài khoản tổ chức không cho phép mật khẩu ứng dụng.

Chạy `npm install` trong `backend` nếu chưa có Nodemailer, sau đó khởi động lại backend bằng `npm start`. Nếu cổng 5000 đang được sử dụng, dừng tiến trình backend cũ trước.

Nếu chưa cấu hình email, API báo chức năng chưa sẵn sàng. Không trả liên kết khôi phục hoặc token ra giao diện hay log. Có giới hạn 10 yêu cầu mỗi loại trong 15 phút cho mỗi IP; email khôi phục cùng tài khoản cách nhau ít nhất 60 giây.

## Kiểm tra

Chạy `node --test password-flow.test.cjs` trong `backend`. Bài kiểm tra dùng database riêng tên `bigbangmart_password_test_<pid>`, giả lập gửi email và xóa database thử nghiệm khi hoàn tất. Không gửi email thật và không sửa tài khoản đang dùng.

Tài liệu: https://nodejs.org/api/crypto.html và https://nodemailer.com/smtp

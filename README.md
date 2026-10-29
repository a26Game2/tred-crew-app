# TRED Crew — ứng dụng nhân sự

Chạy `npm install` rồi `npm run dev`. Cấu hình API và cổng giao diện trong `.env` theo `.env.example`. Dev server chuyển tiếp `/api/v1` đến backend; bản build dùng trực tiếp `VITE_API_BASE_URL` và backend cần cho phép CORS tương ứng.

Tài khoản đăng ký phải được admin duyệt và liên kết với hồ sơ nhân sự đang hoạt động trước khi chấm công. Ảnh và vị trí được gửi đến backend khi xác nhận check-in/check-out. Trình duyệt chỉ cho phép lấy vị trí trên HTTPS hoặc localhost; khi mở từ điện thoại qua mạng LAN cần dùng HTTPS.

# Hệ thống Trắc nghiệm Ứng viên

Hệ thống Trắc nghiệm Ứng viên là một ứng dụng web được phát triển để giúp các nhà tuyển dụng đánh giá kỹ năng và kiến thức của ứng viên thông qua các bài kiểm tra trực tuyến. Ứng dụng được xây dựng bằng Next.js, React và sử dụng Mock Service Worker (MSW) để mô phỏng API trong quá trình phát triển.

## Yêu cầu hệ thống

- Node.js (phiên bản 16.x hoặc cao hơn)
- npm (phiên bản 8.x hoặc cao hơn)

## Cài đặt

1. Clone repository từ GitHub:
   ```bash
   git clone <repository-url>
   cd hirebot-ai-app
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   ```

3. Khởi tạo Mock Service Worker:
   ```bash
   npx msw init public
   ```

4. Chạy ứng dụng ở môi trường phát triển:
   ```bash
   npm run dev
   ```

5. Truy cập ứng dụng tại địa chỉ: http://localhost:3000

## Cấu trúc dự án

```
hirebot-ai-app/
├── public/                  # Tài nguyên tĩnh
│   └── mockServiceWorker.js # Service Worker cho MSW
├── src/
│   ├── components/          # Các component React
│   ├── mock/                # Mô phỏng API với MSW
│   │   ├── data/            # Dữ liệu mẫu
│   │   ├── browser.ts       # Cấu hình MSW cho trình duyệt
│   │   └── handlers.ts      # Định nghĩa các API endpoint
│   ├── pages/               # Các trang của ứng dụng (Pages Router)
│   │   ├── admin/           # Trang quản trị
│   │   ├── quiz/            # Trang làm bài thi
│   │   └── index.tsx        # Trang chủ
│   ├── styles/              # CSS và các style
│   └── utils/               # Các hàm tiện ích
├── package.json
└── next.config.js
```

## Tính năng chính

### 1. Dành cho ứng viên

- **Trang chủ**: Ứng viên nhập thông tin cá nhân và mã phiên thi để bắt đầu làm bài.
- **Trang làm bài thi**: Hiển thị các câu hỏi trắc nghiệm và cho phép ứng viên trả lời trong thời gian quy định.
- **Trang kết quả**: Hiển thị điểm số và đánh giá sau khi hoàn thành bài thi.

### 2. Dành cho quản trị viên

- **Đăng nhập**: Quản trị viên đăng nhập vào hệ thống.
- **Quản lý ứng viên**: Xem danh sách, thông tin chi tiết và kết quả của ứng viên.
- **Quản lý câu hỏi**: Thêm, sửa, xóa câu hỏi trắc nghiệm.
- **Tạo phiên thi**: Tạo phiên thi mới với các tham số như ngôn ngữ, cấp độ, số lượng câu hỏi và thời gian làm bài.

## Hướng dẫn sử dụng

### Dành cho ứng viên

1. Truy cập trang chủ tại http://localhost:3000
2. Nhập họ tên, email và mã phiên thi (được cung cấp bởi nhà tuyển dụng)
3. Nhấn "Bắt đầu làm bài" để vào trang làm bài thi
4. Trả lời các câu hỏi trong thời gian quy định
5. Nhấn "Nộp bài" khi hoàn thành
6. Xem kết quả và đánh giá

### Dành cho quản trị viên

1. Truy cập trang đăng nhập tại http://localhost:3000/admin/login
2. Đăng nhập với thông tin:
   - Username: admin
   - Password: password
3. Sau khi đăng nhập, bạn có thể:
   - Xem danh sách ứng viên và kết quả
   - Quản lý câu hỏi trắc nghiệm
   - Tạo phiên thi mới và chia sẻ mã phiên thi cho ứng viên

## API Endpoints (Mock)

Ứng dụng sử dụng Mock Service Worker để mô phỏng các API endpoint sau:

### Xác thực
- `POST /api/login`: Đăng nhập quản trị viên

### Ứng viên
- `GET /api/candidates`: Lấy danh sách ứng viên (hỗ trợ lọc và phân trang)
- `GET /api/candidates/:id`: Lấy thông tin chi tiết của ứng viên
- `GET /api/candidates/:id/results`: Lấy kết quả bài thi của ứng viên

### Câu hỏi
- `GET /api/questions`: Lấy danh sách câu hỏi (hỗ trợ lọc và phân trang)
- `POST /api/questions`: Tạo câu hỏi mới
- `PUT /api/questions/:id`: Cập nhật câu hỏi
- `DELETE /api/questions/:id`: Xóa câu hỏi

### Phiên thi
- `POST /api/sessions`: Tạo phiên thi mới
- `GET /api/sessions/:token`: Lấy thông tin phiên thi theo token
- `GET /api/sessions/:token/questions`: Lấy danh sách câu hỏi cho phiên thi
- `POST /api/sessions/:token/submit`: Nộp bài thi

## Môi trường triển khai

### Phát triển
```bash
npm run dev
```

### Xây dựng
```bash
npm run build
```

### Chạy phiên bản production
```bash
npm run start
```

## Công nghệ sử dụng

- **Next.js**: Framework React cho phát triển ứng dụng web
- **React**: Thư viện JavaScript để xây dựng giao diện người dùng
- **TypeScript**: Ngôn ngữ lập trình mở rộng JavaScript với kiểu dữ liệu tĩnh
- **Tailwind CSS**: Framework CSS tiện ích
- **Mock Service Worker (MSW)**: Thư viện mô phỏng API cho phát triển và kiểm thử

## Lưu ý

- Đây là phiên bản phát triển sử dụng dữ liệu mẫu và API mô phỏng.
- Trong môi trường sản xuất, bạn cần thay thế MSW bằng API thực tế.
- Các tính năng bảo mật như xác thực JWT, mã hóa mật khẩu, và bảo vệ CSRF cần được triển khai đầy đủ trước khi đưa vào sử dụng thực tế.

## Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên repository GitHub hoặc liên hệ với đội phát triển.

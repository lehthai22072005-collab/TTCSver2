# PTIT HR Management System (Hệ thống Quản lý Nhân sự PTIT)

Đây là một dự án Quản lý Nhân sự (Human Resources Management System - HRMS) được xây dựng với kiến trúc Client-Server hiện đại, đáp ứng đầy đủ nghiệp vụ quản lý nhân sự, chấm công, tính lương, quản lý hợp đồng, đánh giá KPI, và kê khai giảng dạy dành cho các cơ sở giáo dục hoặc doanh nghiệp.

---

## 🚀 Tính Năng Nổi Bật

Hệ thống được phân quyền chặt chẽ với nhiều vai trò (Roles) khác nhau, bao gồm:

1. **Quản lý Nhân viên & Phòng ban**: 
   - Thêm, sửa, xóa, tìm kiếm thông tin nhân sự.
   - Quản lý cơ cấu tổ chức phòng ban, khoa, tổ bộ môn.
   - Theo dõi số lượng nhân viên và trưởng phòng mỗi bộ phận.
2. **Quản lý Hợp đồng Lao động**:
   - Theo dõi hợp đồng thử việc, hợp đồng xác định thời hạn, và không xác định thời hạn.
   - Tự động kiểm tra thời hạn hợp đồng khi nhân viên đăng nhập.
3. **Quản lý Chấm công & Nghỉ phép**:
   - Nhân viên chấm công hàng ngày (Check-in/Check-out).
   - Yêu cầu nghỉ phép trực tuyến và quy trình phê duyệt của Quản lý/HR.
4. **Quản lý Lương & Quỹ lương**:
   - Tính toán bảng lương hàng tháng tự động dựa trên chấm công và KPI.
   - Theo dõi lịch sử thanh toán lương và biến động quỹ lương qua biểu đồ trực quan.
   - Xuất bảng lương ra file Excel (Apache POI) và PDF (OpenPDF).
5. **Kê khai Giảng dạy (Dành cho Giảng viên)**:
   - Giảng viên kê khai giờ dạy, giờ nghiên cứu khoa học.
   - Ban giám hiệu hoặc Phòng đào tạo phê duyệt tờ khai giờ giảng.
6. **Đánh giá KPI & Khen thưởng - Kỷ luật**:
   - Thiết lập chỉ tiêu KPI và tự đánh giá/phê duyệt điểm KPI.
   - Ghi nhận các quyết định khen thưởng, kỷ luật nhân viên.
7. **Quản trị Hệ thống & Cấu hình**:
   - Cấp phát tài khoản cho nhân sự tương ứng.
   - Nhật ký hoạt động hệ thống (System Audit Logs) để theo dõi vết hoạt động.
   - Cấu hình SMTP gửi mail thông báo tự động.
   - Chế độ bảo trì hệ thống (Maintenance Mode) - Khi kích hoạt, chỉ Admin được phép đăng nhập, các tài khoản khác sẽ tự động bị đăng xuất với mã HTTP 503.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend (hr-backend)
- **Framework**: Java 17 + Spring Boot 3.2.5
- **Data Access**: Spring Data JPA + Hibernate
- **Database**: MySQL 8.0
- **Exporting**: 
  - Apache POI (Xuất file Excel)
  - OpenPDF / LibrePDF (Xuất file PDF)
- **Mail Service**: Spring Boot Starter Mail (Gửi mail thông báo)
- **Build Tool**: Maven

### Frontend (hr-frontend)
- **Framework**: React 19
- **Routing**: React Router v7
- **HTTP Client**: Axios (Tích hợp interceptors để tự động đính kèm `Role` và `Username` vào Header)
- **Visualizations**: Recharts (Vẽ biểu đồ thống kê)
- **Icons**: Lucide React
- **Exporting**: JSPDF & SheetJS (xlsx) để xử lý file phía client

---

## 👥 Tài Khoản Demo (Xem tại `data.sql`)

Dữ liệu mẫu đã được thiết lập sẵn trong cơ sở dữ liệu khi khởi chạy ứng dụng lần đầu:

| Vai trò (Role) | Username | Password | Mô tả |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Quản trị viên hệ thống cao nhất |
| **HR (Phòng Nhân sự)** | `hr` | `123456` | Quản lý thông tin nhân viên, phòng ban, hợp đồng |
| **Accountant (Kế toán)** | `accountant` | `123456` | Quản lý lương, quỹ lương, lịch sử thanh toán |
| **Director (Ban Giám Hiệu)**| `director` | `123456` | Phê duyệt chung, xem báo cáo thống kê doanh nghiệp |
| **Teacher (Giảng viên)** | `teacher` | `123456` | Kê khai giờ dạy, xem bảng lương, chấm công cá nhân |
| **Staff (Nhân viên)** | `staff` | `123456` | Chấm công, yêu cầu nghỉ phép, xem hợp đồng cá nhân |

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

Có 2 cách để khởi chạy dự án: Sử dụng **Docker Compose** (Khuyến khích) hoặc chạy **Thủ công từng phần**.

### Cách 1: Chạy bằng Docker Compose (Nhanh nhất)

Yêu cầu máy tính đã cài đặt **Docker** và **Docker Compose**.

1. Mở Terminal tại thư mục gốc của dự án (`d:/TTCS2`).
2. Chạy lệnh sau để khởi dựng và chạy toàn bộ dịch vụ (MySQL, Backend, Frontend):
   ```bash
   docker-compose up --build
   ```
3. Sau khi Docker hoàn thành khởi động:
   - **Frontend**: Truy cập tại [http://localhost:3000](http://localhost:3000)
   - **Backend**: Truy cập tại [http://localhost:8080](http://localhost:8080)
   - **Database (MySQL)**: Chạy trên cổng `3307` (được ánh xạ từ `3306` của container).

---

### Cách 2: Khởi chạy thủ công (Local Development)

#### 1. Cấu hình & Khởi chạy Cơ sở dữ liệu (MySQL)
- Tạo một database trống có tên `hr_management` trên MySQL local của bạn.
- Cấu hình tài khoản root và mật khẩu trong file [application.properties](file:///d:/TTCS2/hr-backend/src/main/resources/application.properties):
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/hr_management?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true&useUnicode=true&characterEncoding=UTF-8
  spring.datasource.username=root
  spring.datasource.password=your_password
  ```
- Khi chạy ứng dụng Spring Boot lần đầu tiên, nhờ cấu hình `spring.sql.init.mode=always` và `spring.jpa.defer-datasource-initialization=true`, hệ thống sẽ tự động khởi tạo bảng và import dữ liệu từ file [data.sql](file:///d:/TTCS2/hr-backend/src/main/resources/data.sql).

#### 2. Khởi chạy Backend (Spring Boot)
- Mở terminal tại thư mục `hr-backend`.
- Chạy lệnh compile và khởi chạy dự án:
  ```bash
  # Nếu dùng Maven cài trên máy:
  mvn clean spring-boot:run
  ```
- Backend sẽ chạy tại cổng `8080`.

#### 3. Khởi chạy Frontend (React)
- Mở terminal tại thư mục `hr-frontend`.
- Cài đặt các thư viện cần thiết:
  ```bash
  npm install
  ```
- Khởi chạy ứng dụng:
  ```bash
  npm start
  ```
- Ứng dụng Frontend sẽ chạy tại địa chỉ [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Cơ Chế Xác Thực & Phân Quyền Đặc Thù

Dự án này sử dụng cơ chế xác thực dựa trên Header tùy chỉnh thay cho Spring Security truyền thống:
- Khi đăng nhập thành công, Frontend lưu trữ thông tin `role` và `username` vào `localStorage`.
- Mỗi request gửi từ Frontend đến API Backend thông qua Axios đều được đính kèm Header:
  - `Role`: Vai trò hiện tại.
  - `Username`: Tên tài khoản đang đăng nhập.
- Backend đọc các Header này để kiểm tra quyền hạn thực thi hành động tương ứng.

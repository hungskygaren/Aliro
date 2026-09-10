# Antigravity Workspace Guidelines

## 1. MCP & Browser Tool Usage Rules
- **Chrome DevTools MCP (`chrome-devtools`) & Browser Automation**:
  - **TUYỆT ĐỐI KHÔNG** tự ý gọi các công cụ thuộc `chrome-devtools` (như `navigate_page`, `take_screenshot`, `evaluate_script`, `click`, `lighthouse_audit`, `list_console_messages`...) hoặc khởi chạy `browser_subagent` trong quá trình viết mã, chỉnh sửa CSS, HTML, JavaScript.
  - **CHỈ ĐƯỢC PHÉP sử dụng** khi người dùng yêu cầu trực tiếp và rõ ràng trong tin nhắn (ví dụ: *"hãy test trên trình duyệt"*, *"dùng devtools kiểm tra lỗi"*, *"chụp ảnh màn hình giao diện"*, *"mở browser kiểm tra"*).
  - Khi người dùng chỉ yêu cầu sửa code, thêm tính năng, fix CSS/HTML, hãy hoàn thành chỉnh sửa code tĩnh trực tiếp trên file và trả lời người dùng mà không tự tiện mở browser.

## 2. Code Quality & Formatting
- Giữ nguyên cấu trúc code sạch sẽ, không tự ý xóa bỏ các đoạn code hoặc style không liên quan.
- Sử dụng đường dẫn tương đối hoặc quy chuẩn hiện có của dự án.

**Unit Testing:** JUnit 5 (Backend) + Flutter Widget test (Mobile).

**API Testing:** Playwright API tests.

**Web E2E Testing:** Playwright E2E tests.

**Mobile Testing:** Maestro E2E test chạy trên Emulator.

**Performance Testing:** k6 load testing script.

**Visual Regression Testing:** So sánh pixel ảnh chụp màn hình Playwright.

**AI-Assisted Testing:** Playwright tests sử dụng cơ chế Self-healing (Tự phục hồi selector).

**CI/CD \& Reporting:** GitHub Actions + Allure Report.





**Unit Test:** Cách chạy:

* Chạy qua dòng lệnh (tại thư mục gốc dự án):	mvn test
* Hoặc click trực tiếp nút Run Test ngay cạnh tên Class/Method trong file Java trên VS Code (sau khi tải lại classpath).





**API Test:** Cách chạy:

* Đảm bảo Spring Boot backend đang chạy (mvn spring-boot:run).
* Mở terminal mới ở thư mục gốc và chạy:	npm run test:api





**Web E2E Test:** Cách chạy:

* Đảm bảo Spring Boot backend đang chạy (mvn spring-boot:run).
* Chạy lệnh:	npm run test:e2e		npm run test:e2e -- --headed







**Mobile Widget Test (Flutter Unit):** Cách chạy:

* Chạy từ thư mục gốc dự án:	npm run test:widget
* Hoặc đi vào thư mục flutter\_app/ và chạy:	flutter test





**Mobile E2E Test (Maestro - Mobile App):** Cách chạy:

* Mở máy ảo Android và chạy ứng dụng (cd flutter\_app \&\& flutter run).
* Mở Maestro Studio (Desktop App) lên, chọn máy ảo và Workspace của bạn.
* Chọn file datetime-flow.yaml và bấm Run Test trực tiếp trên giao diện để theo dõi tiến trình chạy cực kỳ trực quan!





**Perfomance Testing:** npm run test:perf





**Visual Regression:** 

* Chạy so sánh giao diện:	npm run test:visual
* (Playwright sẽ chụp ảnh màn hình hiện tại rồi so sánh pixel-by-pixel với ảnh gốc. Nếu có sự sai lệch màu sắc/bố cục, test sẽ báo lỗi và chỉ ra điểm khác biệt).
* Cập nhật lại ảnh chụp gốc khi đổi giao diện: Nếu sau này bạn cố tình thay đổi thiết kế giao diện (CSS, HTML), bạn chỉ cần chạy lệnh sau để Playwright cập nhật lại ảnh mẫu gốc mới:	npm run test:visual:update





**AI-assisted Testing:** 

* Cách chạy kiểm thử AI:	npm run test:ai			npm run test:ai -- --headed
* Kết quả từ log khi chạy:
* AI quét tìm ô nhập cho nhãn "Day" và báo nhận diện thành công: \[AI Agent] Looking for an input field associated with: "Day"... \[AI Agent] \[Self-Healed] Found input via associated label: "Day"
* AI quét tìm nút "Close" (mặc dù nhãn hiển thị thực tế là ký tự nhân \&times;): \[AI Agent] Looking for a button or clickable element containing: "close"... \[AI Agent] \[Self-Healed] Fuzzy matched button by attributes: "close" (Nhận dạng thông qua class name và thuộc tính ID).





**Reporting:** 

* Tạo báo cáo HTML:	npm run allure:generate
* (Lệnh này sẽ biên dịch dữ liệu thô từ allure-results thành trang web báo cáo tĩnh tại thư mục allure-report)
* Mở xem báo cáo trên trình duyệt:	npm run allure:open
* (Mở một local web server để bạn và thầy cô có thể click xem chi tiết từng test case, biểu đồ thời gian)








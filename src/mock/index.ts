/**
 * Khởi tạo Mock Service Worker để giả lập API
 *
 * Hàm này sẽ khởi tạo MSW dựa vào môi trường:
 * - Nếu chạy trên server (SSR): Sử dụng server handler
 * - Nếu chạy trên browser: Sử dụng service worker
 */
async function initMocks() {
  if (typeof window === "undefined") {
    // Môi trường server-side (Node.js)
    const { server } = await import("./server");
    server.listen();
  } else {
    // Môi trường client-side (trình duyệt)
    const { worker } = await import("./browser");
    worker.start({
      onUnhandledRequest: "bypass", // Không cảnh báo về các request không được xử lý
    });
  }
}

export default initMocks;

import '../app/globals.css';
import '../app/tailwind.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Component chính của ứng dụng Next.js
 * 
 * Khởi tạo:
 * - SessionProvider cho NextAuth.js
 * - Mock Service Worker cho môi trường development
 */
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Khởi tạo Mock Service Worker
  useEffect(() => {
    // Chỉ khởi tạo MSW trong môi trường development
    if (process.env.NODE_ENV === 'development') {
      const initMocks = async () => {
        const { default: mocks } = await import('@/mock');
        await mocks();
      };
      initMocks();
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <>
        <Component {...pageProps} />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    </SessionProvider>
  );
}
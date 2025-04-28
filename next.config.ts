import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  
  // Configure rewrites for development to proxy API requests to the Node.js backend
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Only apply proxy in development mode
    if (isDevelopment) {
      // Get API URL from environment variable or use default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`, // Proxy to Node.js backend
        },
      ];
    }
    
    return [];
  },
};

export default nextConfig;

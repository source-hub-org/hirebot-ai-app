# API Proxy Setup Guide

This guide explains how to configure the API proxy for development to avoid CORS issues when communicating with the backend server.

## Environment Variables

Create a `.env.local` file in the root of your project with the following variable:

```
# API URL for both development proxy and production (default: http://localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## How It Works

1. In development mode:
   - API requests from the frontend use relative URLs (e.g., `/api/users`)
   - Next.js proxy intercepts these requests and forwards them to your backend server
   - The proxy uses the `NEXT_PUBLIC_API_URL` environment variable to determine where to send requests

2. In production mode:
   - API requests use the same `NEXT_PUBLIC_API_URL` environment variable
   - If not specified, they default to relative URLs (`/api`)

## Making API Requests

Use the configured axios instance for all API requests:

```javascript
import axiosInstance from '@/lib/axios';

// This will be automatically proxied to your backend in development
const response = await axiosInstance.get('/users');

// POST request example
const data = await axiosInstance.post('/auth/login', { 
  email: 'user@example.com', 
  password: 'password' 
});
```

## Troubleshooting

If you encounter issues:

1. Verify your backend server is running on the URL specified in `NEXT_PUBLIC_API_URL`
2. Check that your API endpoints start with `/api/` as configured in the proxy
3. Restart your Next.js development server after changing environment variables
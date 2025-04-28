import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // In a real app, we would call the API
      // Mock login - in production this would be a real API call
      if (username === "admin" && password === "password") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store token in localStorage or cookies
        localStorage.setItem("adminToken", "mock-jwt-token");

        // Redirect to admin dashboard
        router.push("/admin/candidates");
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      {/* Wave pattern background */}
      <div className="wave-pattern"></div>

      <div className="container mx-auto max-w-md">
        <div className="quiz-card text-center">
          <h1 className="text-2xl font-bold mb-6">Đăng Nhập Quản Trị</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-left text-sm font-medium mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-left text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-light to-primary text-white py-3 px-6 rounded-lg font-bold hover:opacity-90 transition"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-6 text-sm">
            <Link href="/" className="text-primary hover:underline">
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useRouter } from 'next/router';


export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !sessionToken) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    // In a real app, we would validate the session token with the server
    router.push(`/quiz/${sessionToken}`);
  };
  
  return (
    <div className="min-h-screen py-10 px-4">
      {/* Wave pattern background */}
      <div className="wave-pattern"></div>
      
      <div className="container mx-auto">
        <div className="quiz-card text-center">
          <h1 className="text-3xl font-bold mb-2">Hệ Thống Trắc Nghiệm Ứng Viên</h1>
          <p className="text-gray-600 mb-8">Vui lòng nhập thông tin của bạn để bắt đầu bài thi</p>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-left text-sm font-medium mb-2">Họ và tên</label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-left text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-left text-sm font-medium mb-2">Mã phiên thi</label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={sessionToken}
                onChange={(e) => setSessionToken(e.target.value)}
                placeholder="Nhập mã phiên thi được cung cấp"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary-light to-primary text-white py-3 px-6 rounded-lg font-bold hover:opacity-90 transition"
            >
              Bắt đầu làm bài
            </button>
          </form>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Bạn là quản trị viên? <a href="/admin/login" className="text-primary hover:underline">Đăng nhập</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
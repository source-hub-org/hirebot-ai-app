import React from 'react';

export default function NewSession() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo Phiên Thi Mới</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
            <select className="w-full p-2 border rounded">
              <option value="">Chọn ngôn ngữ</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cấp độ</label>
            <select className="w-full p-2 border rounded">
              <option value="">Chọn cấp độ</option>
              <option value="junior">Junior</option>
              <option value="middle">Middle</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Số lượng câu hỏi</label>
            <input type="number" min="5" max="50" className="w-full p-2 border rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Thời gian làm bài (phút)</label>
            <input type="number" min="15" max="120" className="w-full p-2 border rounded" />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary-light to-primary text-white py-2 px-4 rounded hover:opacity-90"
          >
            Tạo Phiên Thi
          </button>
        </form>
      </div>
    </div>
  );
}
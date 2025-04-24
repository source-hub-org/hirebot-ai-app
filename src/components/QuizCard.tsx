import React, { ReactNode } from 'react';

interface QuizCardProps {
  children: ReactNode;
}

/**
 * QuizCard - Thành phần chính chứa nội dung bài thi
 * 
 * Đây là container chính cho giao diện bài thi, với thiết kế theo theme Quizo
 * Bao gồm border gradient bên trái và các style từ Tailwind CSS
 */
export default function QuizCard({ children }: QuizCardProps) {
  return (
    <div className="quiz-card">
      {/* Border pattern bên trái - tạo điểm nhấn thiết kế */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary-light to-primary rounded-l-2xl"></div>
      
      {children}
    </div>
  );
}
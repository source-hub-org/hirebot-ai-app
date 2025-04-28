import React from 'react';
// import { useRouter } from 'next/router'; // Will be used in real implementation
import Link from 'next/link';

export default function Result() {
  // Router will be used in a real implementation for navigation
  // const router = useRouter();
  // Token will be used in a real implementation for API calls
  // const { token } = router.query;
  
  // Mock result data - would be fetched from API in real implementation
  const result = {
    candidateName: 'Nguyễn Văn A',
    language: 'JavaScript',
    level: 'Senior',
    totalQuestions: 20,
    correctAnswers: 16,
    score: 80,
    passingScore: 70,
    status: 'PASS',
    timeSpent: '25:30',
    feedback: 'Bạn đã thể hiện kiến thức tốt về JavaScript. Tuy nhiên, cần cải thiện thêm về các khái niệm nâng cao như closure và promise chaining.',
    strengths: ['ES6 Features', 'Array Methods', 'DOM Manipulation'],
    weaknesses: ['Closures', 'Async/Await', 'Performance Optimization']
  };
  
  // Calculate score percentage for circular progress
  const scorePercentage = result.score;
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;
  
  return (
    <div className="min-h-screen py-10 px-4">
      {/* Wave pattern background */}
      <div className="wave-pattern"></div>
      
      <div className="container mx-auto">
        <div className="quiz-card text-center">
          <h1 className="text-3xl font-bold mb-2">Kết Quả Bài Thi</h1>
          <p className="text-gray-600 mb-8">Cảm ơn bạn đã hoàn thành bài thi!</p>
          
          {/* Score circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="45" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className="text-primary" 
                  strokeWidth="8" 
                  stroke="url(#gradient)" 
                  fill="transparent" 
                  r="45" 
                  cx="50" 
                  cy="50" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4DD4F4" />
                    <stop offset="100%" stopColor="#4067F4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-3xl font-bold">{result.score}%</div>
                  <div className="text-sm text-gray-500">Điểm số</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="mb-8">
            <span className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
              result.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {result.status}
            </span>
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto text-left">
            <div>
              <p className="text-gray-600">Ứng viên:</p>
              <p className="font-medium">{result.candidateName}</p>
            </div>
            <div>
              <p className="text-gray-600">Ngôn ngữ:</p>
              <p className="font-medium">{result.language}</p>
            </div>
            <div>
              <p className="text-gray-600">Cấp độ:</p>
              <p className="font-medium">{result.level}</p>
            </div>
            <div>
              <p className="text-gray-600">Thời gian làm bài:</p>
              <p className="font-medium">{result.timeSpent}</p>
            </div>
            <div>
              <p className="text-gray-600">Câu trả lời đúng:</p>
              <p className="font-medium">{result.correctAnswers}/{result.totalQuestions}</p>
            </div>
            <div>
              <p className="text-gray-600">Điểm đạt:</p>
              <p className="font-medium">{result.passingScore}%</p>
            </div>
          </div>
          
          {/* Feedback */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-left">Nhận xét</h2>
            <p className="bg-gray-50 p-4 rounded text-left">{result.feedback}</p>
          </div>
          
          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-left">Điểm mạnh</h2>
              <ul className="bg-green-50 p-4 rounded text-left">
                {result.strengths.map((item, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 text-left">Cần cải thiện</h2>
              <ul className="bg-red-50 p-4 rounded text-left">
                {result.weaknesses.map((item, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Back to home button */}
          <Link href="/">
            <button className="bg-gradient-to-r from-primary-light to-primary text-white py-3 px-8 rounded-full font-bold hover:opacity-90 transition">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
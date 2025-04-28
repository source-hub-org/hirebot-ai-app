import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

// Components - Các thành phần UI
import QuizCard from '@/components/QuizCard';
import QuizOption from '@/components/QuizOption';
import TimerBadge from '@/components/TimerBadge';
import NextButton from '@/components/NextButton';

// Mock data - Dữ liệu mẫu cho câu hỏi trắc nghiệm
const mockQuestions = [
  {
    id: 1,
    question: 'JavaScript là ngôn ngữ lập trình thuộc loại nào?',
    options: [
      { id: 'a', text: 'Compiled Language' },
      { id: 'b', text: 'Interpreted Language' },
      { id: 'c', text: 'Both Compiled & Interpreted' },
      { id: 'd', text: 'Neither Compiled nor Interpreted' },
    ],
    correctAnswer: 'b'
  },
  {
    id: 2,
    question: 'Đâu KHÔNG phải là kiểu dữ liệu nguyên thủy trong JavaScript?',
    options: [
      { id: 'a', text: 'String' },
      { id: 'b', text: 'Number' },
      { id: 'c', text: 'Object' },
      { id: 'd', text: 'Boolean' },
    ],
    correctAnswer: 'c'
  },
  {
    id: 3,
    question: 'Phương thức nào được sử dụng để thêm một phần tử vào cuối mảng trong JavaScript?',
    options: [
      { id: 'a', text: 'push()' },
      { id: 'b', text: 'append()' },
      { id: 'c', text: 'addToEnd()' },
      { id: 'd', text: 'insert()' },
    ],
    correctAnswer: 'a'
  },
  {
    id: 4,
    question: 'Cách khai báo biến nào có phạm vi block scope trong JavaScript?',
    options: [
      { id: 'a', text: 'var' },
      { id: 'b', text: 'let' },
      { id: 'c', text: 'const' },
      { id: 'd', text: 'Cả B và C' },
    ],
    correctAnswer: 'd'
  },
  {
    id: 5,
    question: 'Đâu là cách chính xác để kiểm tra xem "x" có phải là một đối tượng không?',
    options: [
      { id: 'a', text: 'typeof(x) === "object"' },
      { id: 'b', text: 'x instanceof Object' },
      { id: 'c', text: 'x.constructor === Object' },
      { id: 'd', text: 'Tất cả đều đúng trong một số trường hợp' },
    ],
    correctAnswer: 'd'
  }
];

export default function Quiz() {
  const router = useRouter();
  const { token } = router.query; // Lấy token từ URL
  
  // Các state quản lý trạng thái bài thi
  const [currentQuestion, setCurrentQuestion] = useState(0); // Câu hỏi hiện tại
  const [selectedOption, setSelectedOption] = useState(''); // Lựa chọn đã chọn
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Lưu trữ câu trả lời
  const [timeLeft, setTimeLeft] = useState(1800); // 30 phút tính bằng giây
  
  // Submit quiz - wrapped in useCallback to prevent recreation on each render
  const submitQuiz = useCallback(() => {
    // In a real app, we would send answers to the server
    console.log('Submitting answers:', answers);
    
    // Redirect to results page
    router.push(`/result/${token}`);
  }, [answers, router, token]);
  
  // Xử lý đồng hồ đếm ngược
  useEffect(() => {
    // Nếu hết thời gian, tự động nộp bài
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    
    // Tạo interval giảm thời gian mỗi giây
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    // Dọn dẹp interval khi component unmount
    return () => clearInterval(timer);
  }, [timeLeft, submitQuiz]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: selectedOption
    }));
    
    // Move to next question or submit if last question
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption('');
    } else {
      submitQuiz();
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + 1) / mockQuestions.length) * 100;
  
  return (
    <div className="min-h-screen py-10 px-4">
      {/* Wave pattern background */}
      <div className="wave-pattern"></div>
      
      <div className="container mx-auto">
        <QuizCard>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">
                Quizo Template
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <TimerBadge time={formatTime(timeLeft)} />
              <div className="font-bold text-sm">
                QUESTION {currentQuestion + 1}/{mockQuestions.length}
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="progress-bar mb-8">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {mockQuestions[currentQuestion].question}
            </h2>
            <p className="text-gray-600">
              Chọn một đáp án phù hợp nhất.
            </p>
          </div>
          
          {/* Options */}
          <div className="space-y-4 mb-16">
            {mockQuestions[currentQuestion].options.map(option => (
              <QuizOption
                key={option.id}
                id={option.id}
                text={option.text}
                isSelected={selectedOption === option.id}
                onSelect={handleOptionSelect}
              />
            ))}
          </div>
        </QuizCard>
        
        {/* Next button */}
        <NextButton 
          onClick={handleNextQuestion} 
          disabled={!selectedOption}
          isLastQuestion={currentQuestion === mockQuestions.length - 1}
        />
      </div>
    </div>
  );
}
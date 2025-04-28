'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import Head from 'next/head';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Candidate as CandidateType, Answer, CandidateDetail } from '@/types/candidate';
import apiClient from '@/services/apiClient';

const InterviewPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Lấy thông tin ứng viên từ Redux store
  const candidate = useSelector((state: RootState) => state.candidateDetail.candidate) as CandidateDetail;
  const answers = useSelector((state: RootState) => state.candidateDetail.candidate?.answers || []) as Answer[];
  
  // Log thông tin ứng viên để debug
  console.log('Initial candidate data:', candidate);
  console.log('Initial answers data:', answers);
  
  // State để lưu câu trả lời của ứng viên
  const [candidateAnswers, setCandidateAnswers] = useState<Answer[]>([]);
  
  // State để lưu câu hỏi tự luận
  const [essay, setEssay] = useState({
    question: 'Hãy mô tả một dự án bạn đã làm và những thách thức bạn đã gặp phải?',
    answer: '',
    is_skip: 0
  });
  
  // State để lưu review
  const [review, setReview] = useState({
    comment: '',
    status: 'true'
  });
  
  // State để lọc câu hỏi
  const [filters, setFilters] = useState({
    difficulty: 'all',
    topic: 'all',
    answered: 'all'
  });
  
  useEffect(() => {
    setIsClient(true);
    
    // Kiểm tra xác thực
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.log('Interview - No token found, redirecting to login');
          router.push('/admin/login');
        } else {
          console.log('Interview - Token found, user is authenticated');
          console.log('Candidate from Redux:', candidate);
          console.log('Candidate _id:', candidate?._id);
          setIsAuthenticated(true);
          
          // Nếu có câu trả lời, cập nhật state
          if (answers && answers.length > 0) {
            console.log('Answers from Redux:', answers);
            
            // Đảm bảo rằng mỗi câu hỏi có đầy đủ thông tin và ID duy nhất
            const processedAnswers = answers.map((answer, index) => {
              console.log(`Processing answer ${index}:`, answer);
              
              // Nếu câu hỏi không có content, sử dụng question.content nếu có
              if (!answer.content && answer.question?.content) {
                const processedAnswer = {
                  ...answer,
                  __id: answer._id  || answer.questionId || `question_${index}`, // Đảm bảo mỗi câu hỏi có ID duy nhất
                  content: answer.question.content,
                  options: answer.options || answer.question?.options || [],
                  correctAnswer: answer.correctAnswer || 0
                };
                console.log(`Processed answer ${index} with question content:`, processedAnswer);
                return processedAnswer;
              }
              
              // Nếu câu hỏi không có options, tạo options mặc định
              if (!answer.options || answer.options.length === 0) {
                const processedAnswer = {
                  ...answer,
                  __id: answer._id || answer.questionId || `question_${index}`, // Đảm bảo mỗi câu hỏi có ID duy nhất
                  options: ['Option A', 'Option B', 'Option C', 'Option D']
                };
                console.log(`Processed answer ${index} with default options:`, processedAnswer);
                return processedAnswer;
              }
              
              const processedAnswer = {
                ...answer,
                _id: answer._id || answer.id || answer.questionId || `question_${index}` // Đảm bảo mỗi câu hỏi có ID duy nhất
              };
              console.log(`Processed answer ${index} without changes:`, processedAnswer);
              return processedAnswer;
            });
            
            console.log('Setting processed answers:', processedAnswers);
            setCandidateAnswers(processedAnswers);
          } else {
            console.log('No answers found in Redux store');
            
            // Nếu không có câu trả lời, tạo dữ liệu mẫu để test
            // Luôn tạo dữ liệu mẫu để đảm bảo có câu hỏi hiển thị
            {
              const mockAnswers: Answer[] = [
                {
                  _id: '1',
                  content: 'Trong PHP, cấu trúc dữ liệu nào phù hợp nhất để lưu trữ danh sách các sản phẩm, nơi bạn cần truy cập sản phẩm theo ID một cách nhanh chóng?',
                  options: [
                    'Mảng tuần tự',
                    'Mảng kết hợp (associative array)',
                    'SplFixedArray',
                    'SplObjectStorage'
                  ],
                  correctAnswer: 1,
                  language: 'PHP',
                  level: 'Junior',
                  category: 'Data Structures',
                  explanation: 'Mảng kết hợp (associative array) cho phép bạn sử dụng ID sản phẩm làm khóa (key), giúp truy cập sản phẩm một cách nhanh chóng với độ phức tạp O(1) trung bình.',
                  difficulty: 'easy',
                  topic: 'Data Structures'
                },
                {
                  _id: '2',
                  content: 'Cho đoạn code PHP sau: `$queue = new SplQueue(); $queue->enqueue(\'A\'); $queue->enqueue(\'B\'); echo $queue->dequeue();`. Kết quả in ra màn hình là gì?',
                  options: [
                    'B',
                    'A',
                    'NULL',
                    'Lỗi'
                  ],
                  correctAnswer: 1,
                  language: 'PHP',
                  level: 'Junior',
                  category: 'Data Structures',
                  explanation: 'SplQueue là một hàng đợi FIFO (First-In-First-Out). Phần tử \'A\' được thêm vào trước, nên khi dequeue, \'A\' sẽ được lấy ra đầu tiên.',
                  difficulty: 'easy',
                  topic: 'Data Structures'
                }
              ];
              console.log('Setting mock answers:', mockAnswers);
              setCandidateAnswers(mockAnswers);
            }
          }
          
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Interview - Error checking authentication:', error);
      router.push('/admin/login');
    }
  }, [router, answers]);
  
  // Hàm xử lý khi chọn câu trả lời
  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    console.log(`Selecting answer for question ${questionId}: option ${optionIndex}`);
    
    setCandidateAnswers(prev => {
      const newAnswers = prev.map(q => {
        if (q._id === questionId) {
          console.log(`Found question with id ${q._id}, updating selectedAnswer to ${optionIndex}`);
          return { ...q, selectedAnswer: optionIndex };
        }
        return q;
      });
      
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
  };
  
  // Hàm xử lý khi nhập câu trả lời khác
  const handleOtherAnswer = (questionId: string, text: string) => {
    console.log(`Setting other answer for question ${questionId}: "${text}"`);
    
    setCandidateAnswers(prev => {
      const newAnswers = prev.map(q => {
        if (q._id === questionId) {
          console.log(`Found question with id ${q._id}, updating otherAnswer`);
          return { ...q, otherAnswer: text };
        }
        return q;
      });
      
      console.log('Updated answers with other answer:', newAnswers);
      return newAnswers;
    });
  };
  
  // Hàm xử lý khi bỏ qua câu hỏi
  const handleSkipQuestion = (questionId: string, isSkipped: boolean) => {
    console.log(`${isSkipped ? 'Skipping' : 'Unskipping'} question ${questionId}`);
    
    setCandidateAnswers(prev => {
      const newAnswers = prev.map(q => {
        if (q._id === questionId) {
          console.log(`Found question with id ${q._id}, updating is_skip to ${isSkipped ? 1 : 0}`);
          return { 
            ...q, 
            is_skip: isSkipped ? 1 : 0,
            // Nếu bỏ qua, xóa câu trả lời đã chọn
            selectedAnswer: isSkipped ? undefined : q.selectedAnswer
          };
        }
        return q;
      });
      
      console.log('Updated answers with skip status:', newAnswers);
      return newAnswers;
    });
  };
  
  // Log candidateAnswers để kiểm tra
  console.log('candidateAnswers before filtering:', candidateAnswers);
  
  // Hàm lọc câu hỏi
  const filteredQuestions = candidateAnswers.filter(question => {
    // Kiểm tra xem câu hỏi có hợp lệ không
    if (!question || !question._id) {
      console.log('Invalid question:', question);
      return false;
    }
    
    // Lọc theo độ khó
    if (filters.difficulty !== 'all' && question.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Lọc theo chủ đề
    if (filters.topic !== 'all' && question.topic !== filters.topic) {
      return false;
    }
    
    // Lọc theo trạng thái trả lời
    if (filters.answered === 'answered' && question.selectedAnswer === undefined) {
      return false;
    }
    
    if (filters.answered === 'unanswered' && question.selectedAnswer !== undefined) {
      return false;
    }
    
    return true;
  });
  
  // Log filteredQuestions để kiểm tra
  console.log('filteredQuestions after filtering:', filteredQuestions);
  
  // Hàm lưu phiên phỏng vấn
  const handleSaveInterview = async () => {
    try {
      setSaving(true);
      
      // Kiểm tra xem đã chọn câu trả lời cho tất cả câu hỏi chưa
      const unansweredQuestions = candidateAnswers.filter(q => q.selectedAnswer === undefined);
      
      if (unansweredQuestions.length > 0) {
        if (!confirm(`Còn ${unansweredQuestions.length} câu hỏi chưa được trả lời. Bạn có muốn tiếp tục lưu không?`)) {
          setSaving(false);
          return;
        }
      }
      
      // Log thông tin ứng viên trước khi lưu
      console.log('Candidate before saving:', candidate);
      
      // Chuẩn bị dữ liệu để gửi lên API
      const formattedAnswers = candidateAnswers.map(q => ({
        question_id: q._id || q.questionId, // Ưu tiên sử dụng _id cho MongoDB, fallback sang questionId hoặc id
        answer: q.selectedAnswer !== undefined ? q.selectedAnswer : null,
        other: q.otherAnswer || '',
        is_skip: q.is_skip === 1 ? 1 : (q.selectedAnswer === undefined ? 1 : 0) // Ưu tiên sử dụng is_skip nếu đã đặt
      }));
      
      const submissionData = {
        candidate_id: candidate?._id || '',
        answers: formattedAnswers,
        essay: {
          question: essay.question,
          answer: essay.answer,
          is_skip: essay.answer.trim() === '' ? 1 : 0
        },
        review: {
          comment: review.comment,
          status: review.status
        }
      };
      
      console.log('Submission data:', submissionData);
      
      // Gửi dữ liệu lên API sử dụng apiClient
      try {
        const response = await apiClient.post('/api/submissions', submissionData);
        
        console.log('API response:', response.data);
        toast.success('Đã lưu phiên phỏng vấn thành công!');
        
        // Tạo dữ liệu phiên phỏng vấn cho localStorage (để tương thích với code cũ)
        const sessionId = `session_${Date.now()}`;
        const interviewSession = {
          _id: sessionId,
          token: sessionId,
          candidate_id: candidate?._id || 'unknown',
          candidateName: candidate?.full_name || 'Ứng viên',
          interviewerName: 'Admin',
          language: candidate?.skills?.[0] || '',
          level: candidate?.interview_level || 'Junior',
          questionCount: candidateAnswers.length,
          questions: candidateAnswers,
          essay: essay,
          review: review,
          createdAt: new Date().toISOString()
        };
        
        // Lưu vào localStorage
        localStorage.setItem(sessionId, JSON.stringify(interviewSession));
        console.log('Saved session to localStorage:', interviewSession);
        
        // Chuyển đến trang danh sách ứng viên
        router.push('/admin/candidates');
      } catch (apiError) {
        console.error('API call error:', apiError);
        toast.error(apiError.message || 'Có lỗi xảy ra khi lưu phiên phỏng vấn!');
      }
    } catch (error) {
      console.error('Error saving interview:', error);
      toast.error('Có lỗi xảy ra khi lưu phiên phỏng vấn!');
    } finally {
      setSaving(false);
    }
  };
  
  // Hiển thị màn hình loading khi chưa xác thực hoặc đang tải dữ liệu
  if (!isAuthenticated || loading || !isClient) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary bg-white p-2"></div>
      </div>
    );
  }
  
  // Hiển thị thông báo lỗi nếu không có câu hỏi
  if ((!candidateAnswers || candidateAnswers.length === 0) && !loading) {
    // Log thông tin ứng viên để debug
    console.log('Candidate data in error state:', candidate);
    console.log('Candidate ID in error state:', candidate?._id);
    console.log('Answers in error state:', answers);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Không có câu hỏi</h1>
            <p className="text-gray-600 mb-6">Không tìm thấy câu hỏi nào cho ứng viên này. Vui lòng quay lại và tạo câu hỏi.</p>
            <div className="flex justify-center space-x-4">
              <Link href="/admin/sessions" className="bg-primary text-white px-4 py-2 rounded-lg">
                Quay lại danh sách
              </Link>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Quizo Admin | Phỏng vấn ứng viên</title>
        <meta name="description" content="Phỏng vấn ứng viên Quizo" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Phỏng vấn ứng viên</h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveInterview}
                  disabled={saving}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
                >
                  {saving ? (
                    <span className="mr-2 animate-spin">⟳</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                  {saving ? 'Đang lưu...' : 'Lưu phỏng vấn'}
                </button>
                
                <Link href={`/admin/sessions/${candidate?._id}`} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Quay lại
                </Link>
              </div>
            </div>
            
            {/* Thông tin ứng viên */}
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tên ứng viên:</p>
                  <p className="font-medium">{candidate?.full_name || 'Chưa có thông tin'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email:</p>
                  <p className="font-medium">{candidate?.email || 'Chưa có thông tin'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại:</p>
                  <p className="font-medium">{candidate?.phone_number || 'Chưa có thông tin'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kỹ năng:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate?.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Chưa có thông tin</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cấp độ:</p>
                  <p className="font-medium">{candidate?.interview_level || 'Chưa có thông tin'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số câu hỏi:</p>
                  <p className="font-medium">{candidateAnswers.length}</p>
                </div>
              </div>
            </div>
            
            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="all">Tất cả độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
              
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.topic}
                onChange={(e) => setFilters({...filters, topic: e.target.value})}
              >
                <option value="all">Tất cả chủ đề</option>
                {Array.from(new Set(candidateAnswers.map(q => q.topic))).map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.answered}
                onChange={(e) => setFilters({...filters, answered: e.target.value})}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="answered">Đã trả lời</option>
                <option value="unanswered">Chưa trả lời</option>
              </select>
              
              <div className="ml-auto">
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredQuestions.length} / {candidateAnswers.length} câu hỏi
                </span>
              </div>
            </div>
          </div>
          
          {/* Danh sách câu hỏi */}
          <div className="space-y-6">
            {filteredQuestions && filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => {
                console.log(`Rendering question ${index} with id ${question._id}`);
                return (
                  <div 
                    key={question._id} 
                    className="border border-gray-200 rounded-lg p-4"
                    data-question-id={question._id}
                  >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <h3 className="font-bold text-lg mb-2 mr-3">Câu {index + 1}</h3>
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() => handleSkipQuestion(question._id, !question.is_skip)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          question.is_skip 
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {question.is_skip ? 'Đã bỏ qua' : 'Bỏ qua câu hỏi'}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="mr-3">Ngôn ngữ: {question.language}</span>
                    <span className="mr-3">Cấp độ: {question.level}</span>
                    <span className="mr-3">Danh mục: {question.category}</span>
                    {question.difficulty && (
                      <span className="mr-3">
                        Độ khó: 
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                          question.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-800' 
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty === 'easy' 
                            ? 'Dễ' 
                            : question.difficulty === 'medium' 
                            ? 'Trung bình' 
                            : 'Khó'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {question.question || question.question?.question || 'Không có nội dung câu hỏi'}
                  </p>
                  {question.question && question.question.includes('```') && (
                    <div className="mt-2 p-3 bg-gray-800 text-white rounded-md overflow-x-auto">
                      <pre>{question.question.split('```').filter((_, i) => i % 2 === 1).join('\n')}</pre>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex} 
                      className={`p-3 rounded-lg ${question.is_skip ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${
                        question.selectedAnswer === optionIndex
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (!question.is_skip) {
                          console.log(`Clicked option ${optionIndex} for question with id ${question._id}`);
                          handleSelectAnswer(question._id, optionIndex);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          question.selectedAnswer === optionIndex
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <div className="flex-1">
                          {option}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Câu trả lời khác */}
                  <div className="mt-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-yellow-200 text-yellow-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Câu trả lời khác:</p>
                        <textarea
                          className={`w-full border border-gray-300 rounded-lg p-2 min-h-[80px] ${question.is_skip ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="Nhập câu trả lời khác của ứng viên..."
                          value={question.otherAnswer || ''}
                          onChange={(e) => {
                            if (!question.is_skip) {
                              console.log(`Changing other answer for question with id ${question._id}`);
                              handleOtherAnswer(question._id, e.target.value);
                            }
                          }}
                          disabled={question.is_skip === 1}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hiển thị giải thích */}
                  {question.explanation && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="font-bold text-blue-800">Giải thích:</p>
                      <p className="text-blue-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
              );
              })
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Không có câu hỏi</h3>
                <p className="text-gray-600">Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.</p>
              </div>
            )}
          </div>
          
          {/* Phần câu hỏi tự luận */}
          <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi tự luận</h2>
            
            <div className="mb-4">
              <label htmlFor="essay-question" className="block text-sm font-medium text-gray-700 mb-1">
                Câu hỏi:
              </label>
              <input
                id="essay-question"
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={essay.question}
                onChange={(e) => setEssay({...essay, question: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="essay-answer" className="block text-sm font-medium text-gray-700 mb-1">
                Câu trả lời:
              </label>
              <textarea
                id="essay-answer"
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[200px]"
                placeholder="Nhập câu trả lời tự luận của ứng viên..."
                value={essay.answer}
                onChange={(e) => setEssay({...essay, answer: e.target.value})}
              />
            </div>
          </div>
          
          {/* Phần review */}
          <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-blue-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đánh giá</h2>
            
            <div className="mb-4">
              <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
                Nhận xét:
              </label>
              <textarea
                id="review-comment"
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                placeholder="Nhập nhận xét về ứng viên..."
                value={review.comment}
                onChange={(e) => setReview({...review, comment: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái:
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    name="review-status"
                    value="true"
                    checked={review.status === 'true'}
                    onChange={() => setReview({...review, status: 'true'})}
                  />
                  <span className="ml-2 text-gray-700">Đạt</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-red-600"
                    name="review-status"
                    value="false"
                    checked={review.status === 'false'}
                    onChange={() => setReview({...review, status: 'false'})}
                  />
                  <span className="ml-2 text-gray-700">Không đạt</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Nút lưu phỏng vấn ở cuối trang */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveInterview}
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-lg flex items-center"
            >
              {saving ? (
                <span className="mr-2 animate-spin">⟳</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              {saving ? 'Đang lưu...' : 'Lưu phỏng vấn'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
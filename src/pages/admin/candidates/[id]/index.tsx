import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useCandidateSubmissions } from "@/hooks/useCandidateSubmissions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CandidateDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  console.log('Candidate ID from router:', id);
  
  const { submissions, loading, error } = useCandidateSubmissions(id);
  const [activeTab, setActiveTab] = useState<"mcq" | "essay">("mcq");
  
  // Log the submissions data
  console.log('Submissions data in component:', submissions);
  
  // Get the first submission (if any)
  const submission = submissions.length > 0 ? submissions[0] : null;
  const candidate = submission?.candidate;
  
  // Calculate MCQ score and statistics
  const calculateMcqStats = () => {
    if (!submission || !submission.answers || submission.answers.length === 0) {
      return { 
        score: 0, 
        total: 0, 
        percentage: 0,
        skipped: 0,
        correct: 0,
        incorrect: 0,
        byDifficulty: {
          easy: { total: 0, correct: 0, percentage: 0 },
          medium: { total: 0, correct: 0, percentage: 0 },
          hard: { total: 0, correct: 0, percentage: 0 }
        },
        byCategory: {}
      };
    }
    
    const total = submission.answers.length;
    const skipped = submission.answers.filter(answer => answer.is_skip).length;
    const answered = total - skipped;
    
    const correct = submission.answers.filter(
      answer => !answer.is_skip && answer.answer !== null && answer.answer === answer.question.correctAnswer
    ).length;
    
    const incorrect = answered - correct;
    const percentage = answered > 0 ? Math.round((correct / total) * 100) : 0;
    
    // Define difficulty types
    type DifficultyLevel = 'easy' | 'medium' | 'hard';
    type DifficultyStats = {
      [key in DifficultyLevel]: { total: number; correct: number; percentage: number; }
    };
    
    // Calculate stats by difficulty
    const byDifficulty: DifficultyStats = {
      easy: { total: 0, correct: 0, percentage: 0 },
      medium: { total: 0, correct: 0, percentage: 0 },
      hard: { total: 0, correct: 0, percentage: 0 }
    };
    
    // Calculate stats by category
    const byCategory: Record<string, { total: number; correct: number; percentage: number; }> = {};
    
    submission.answers.forEach(answer => {
      const difficultyValue = answer.question?.difficulty?.toLowerCase() || 'medium';
      // Ensure difficulty is one of the allowed values
      const difficulty = (
        difficultyValue === 'easy' || 
        difficultyValue === 'medium' || 
        difficultyValue === 'hard'
      ) ? difficultyValue as DifficultyLevel : 'medium';
      
      const category = answer.question?.category || 'Không phân loại';
      
      // Update difficulty stats
      byDifficulty[difficulty].total++;
      if (!answer.is_skip && answer.answer !== null && answer.answer === answer.question.correctAnswer) {
        byDifficulty[difficulty].correct++;
      }
      
      // Update category stats
      if (!byCategory[category]) {
        byCategory[category] = { total: 0, correct: 0, percentage: 0 };
      }
      
      byCategory[category].total++;
      if (!answer.is_skip && answer.answer !== null && answer.answer === answer.question.correctAnswer) {
        byCategory[category].correct++;
      }
    });
    
    // Calculate percentages for each difficulty
    Object.keys(byDifficulty).forEach(difficultyKey => {
      const difficulty = difficultyKey as DifficultyLevel;
      const { total, correct } = byDifficulty[difficulty];
      byDifficulty[difficulty].percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    });
    
    // Calculate percentages for each category
    Object.keys(byCategory).forEach(category => {
      const { total, correct } = byCategory[category];
      byCategory[category].percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    });
    
    return { 
      score: correct, 
      total, 
      percentage,
      skipped,
      correct,
      incorrect,
      byDifficulty,
      byCategory
    };
  };
  
  const mcqStats = calculateMcqStats();
  const mcqScore = { 
    score: mcqStats.score, 
    total: mcqStats.total, 
    percentage: mcqStats.percentage 
  };


  return (
    <React.Fragment>
      <Head>
        <title>Quizo Admin | Chi tiết ứng viên</title>
        <meta name="description" content="Chi tiết ứng viên Quizo" />
      </Head>

      {loading && <LoadingSpinner />}

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-primary-light to-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">Quizo Admin</div>
            <div className="flex items-center gap-6">
              <Link href="/admin/candidates">
                <span className="hover:underline">Ứng viên</span>
              </Link>
              <Link href="/admin/questions">
                <span className="hover:underline">Câu hỏi</span>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  router.push("/admin/login");
                }}
                className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {!loading && !submission && !error && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-center text-gray-500">Không tìm thấy dữ liệu bài thi của ứng viên này</p>
              <div className="flex justify-center mt-4">
                <Link href="/admin/candidates">
                  <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                    Quay lại danh sách
                  </button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Debug section - only visible in development */}
          {submission && candidate && (
            <React.Fragment>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  Chi tiết kết quả: {candidate.full_name}
                </h1>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Kỹ năng:</p>
                    <p className="font-medium">{candidate.skills?.join(", ") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cấp độ:</p>
                    <p className="font-medium">{candidate.interview_level}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số điện thoại:</p>
                    <p className="font-medium">{candidate.phone_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Trạng thái:</p>
                    <p className={`font-medium ${candidate.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                      {candidate.status === "completed" ? "Đã hoàn thành" : "Đang chờ"}
                    </p>
                  </div>
                </div>

                {/* Tab navigation */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab("mcq")}
                      className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                        activeTab === "mcq"
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Câu hỏi trắc nghiệm
                    </button>
                    <button
                      onClick={() => setActiveTab("essay")}
                      className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                        activeTab === "essay"
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Câu hỏi tự luận
                    </button>
                  </nav>
                </div>
                
                {/* Score summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-gray-600 text-sm">Điểm trắc nghiệm:</p>
                    <div className="flex items-end">
                      <p className="text-2xl font-bold text-blue-600">{mcqScore.score}</p>
                      <p className="text-gray-500 ml-1">/{mcqScore.total}</p>
                    </div>
                    <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full" 
                        style={{ width: `${mcqScore.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{mcqScore.percentage}%</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-gray-600 text-sm">Đánh giá tự luận:</p>
                    <div className="flex items-center mt-2">
                      {submission.review && submission.review.status === "pass" ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">Đạt</span>
                      ) : submission.review && submission.review.status === "fail" ? (
                        <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">Không đạt</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500 text-white text-sm rounded-full">Chưa đánh giá</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-gray-600 text-sm">Kết quả tổng thể:</p>
                    <div className="flex items-center mt-2">
                      {mcqScore.percentage >= 70 && submission.review && submission.review.status === "pass" ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">Đạt</span>
                      ) : mcqScore.percentage < 50 || (submission.review && submission.review.status === "fail") ? (
                        <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">Không đạt</span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">Cần xem xét thêm</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* MCQ Tab Content */}
                {activeTab === "mcq" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Chi tiết câu trả lời trắc nghiệm</h2>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Điểm: {mcqScore.score}/{mcqScore.total} ({mcqScore.percentage}%)
                      </div>
                    </div>
                    
                    {/* MCQ Statistics */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">Thống kê kết quả</h3>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Tổng số câu</p>
                          <p className="text-xl font-bold text-blue-600">{mcqStats.total}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Đúng</p>
                          <p className="text-xl font-bold text-green-600">{mcqStats.correct}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Sai</p>
                          <p className="text-xl font-bold text-red-600">{mcqStats.incorrect}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Bỏ qua</p>
                          <p className="text-xl font-bold text-gray-600">{mcqStats.skipped}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {submission.answers.map((item, index) => (
                        <div
                          key={index}
                          className={`p-5 rounded-lg border ${
                            item.is_skip
                              ? "bg-gray-50 border-gray-200"
                              : item.answer === item.question.correctAnswer
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex space-x-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                item.question?.difficulty?.toLowerCase() === 'easy' 
                                  ? 'bg-green-100 text-green-800' 
                                  : item.question?.difficulty?.toLowerCase() === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.question?.difficulty?.toLowerCase() === 'easy' 
                                  ? 'Dễ' 
                                  : item.question?.difficulty?.toLowerCase() === 'medium'
                                  ? 'Trung bình'
                                  : 'Khó'}
                              </span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                                {item.question?.category || 'Không phân loại'}
                              </span>
                              {item.question?.topic && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                                  {item.question.topic}
                                </span>
                              )}
                            </div>
                            <div>
                              {item.is_skip ? (
                                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                                  Bỏ qua
                                </span>
                              ) : item.answer !== null && item.answer === item.question.correctAnswer ? (
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                  Đúng
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
                                  Sai
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="font-medium text-lg mb-3">
                            {index + 1}. {item.question.question}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            {item.question.options && item.question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`p-3 rounded ${
                                  item.answer === optIndex 
                                    ? item.answer === item.question.correctAnswer
                                      ? "bg-green-100 border border-green-300"
                                      : "bg-red-100 border border-red-300"
                                    : item.question.correctAnswer === optIndex
                                      ? "bg-green-100 border border-green-300"
                                      : "bg-white border border-gray-200"
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="mr-2 font-medium">{String.fromCharCode(65 + optIndex)}.</div>
                                  <div>{option}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 text-sm">
                            {item.is_skip ? (
                              <p className="text-gray-600">Ứng viên đã bỏ qua câu hỏi này</p>
                            ) : item.answer !== null && item.answer === item.question.correctAnswer ? (
                              <p className="text-green-600">Đúng</p>
                            ) : (
                              <p className="text-red-600">
                                Sai. Đáp án đúng: {String.fromCharCode(65 + item.question.correctAnswer)}
                              </p>
                            )}
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Essay Tab Content */}
                {activeTab === "essay" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Câu hỏi tự luận</h2>
                    <div className="p-5 rounded-lg border bg-white border-gray-200">
                      <p className="font-medium text-lg mb-3">{submission.essay?.question || "Không có câu hỏi tự luận"}</p>
                      
                      {submission.essay?.is_skip ? (
                        <p className="text-gray-600 italic">Ứng viên đã bỏ qua câu hỏi này</p>
                      ) : submission.essay?.answer ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                          {submission.essay.answer}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">Ứng viên chưa trả lời câu hỏi này</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-2">Nhận xét của người phỏng vấn</h3>
                      {submission.review && submission.review.status && submission.review.status !== "false" ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p>{submission.review.comment || "Chưa có nhận xét"}</p>
                          <div className="mt-2">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${
                              submission.review.status === "pass" ? "bg-green-500" : "bg-red-500"
                            }`}>
                              {submission.review.status === "pass" ? "Đạt" : "Không đạt"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-600 italic">Chưa có nhận xét</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

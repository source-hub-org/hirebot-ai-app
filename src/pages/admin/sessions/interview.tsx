"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import Head from "next/head";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Answer, CandidateDetail } from "@/types/candidate";
import apiClient from "@/services/apiClient";

const InterviewPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lấy thông tin ứng viên từ Redux store
  const candidate = useSelector(
    (state: RootState) => state.candidateDetail.candidate,
  ) as CandidateDetail;
  const answers = useSelector(
    (state: RootState) => state.candidateDetail.candidate?.answers || [],
  ) as Answer[];

  // Log thông tin ứng viên để debug
  console.log("Initial candidate data:", candidate);
  console.log("Initial answers data:", answers);

  // State để lưu câu trả lời của ứng viên
  const [candidateAnswers, setCandidateAnswers] = useState<Answer[]>([]);

  // State để lưu câu hỏi tự luận
  const [essay, setEssay] = useState({
    question:
      "Hãy mô tả một dự án bạn đã làm và những thách thức bạn đã gặp phải?",
    answer: "",
    is_skip: 0,
  });

  // State để lưu review
  const [review, setReview] = useState({
    candidateComment: "", // Nhận xét ứng viên
    personalIntro: "", // Giới thiệu cá nhân + nguyện vọng
    status: "true",
  });

  // State để lọc câu hỏi
  const [filters, setFilters] = useState({
    difficulty: "all",
    topic: "all",
    answered: "all",
  });

  // Thêm state mới
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // State để quản lý hiển thị explanation cho từng câu hỏi
  const [visibleExplanations, setVisibleExplanations] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setIsClient(true);

    // Kiểm tra xác thực
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          console.log("Interview - No token found, redirecting to login");
          router.push("/admin/login");
        } else {
          console.log("Interview - Token found, user is authenticated");
          console.log("Candidate from Redux:", candidate);
          console.log("Candidate _id:", candidate?._id);
          setIsAuthenticated(true);

          // Nếu có câu trả lời, cập nhật state
          if (answers && answers.length > 0) {
            console.log("Answers from Redux:", answers);

            // Đảm bảo rằng mỗi câu hỏi có đầy đủ thông tin và ID duy nhất
            const processedAnswers = answers.map((answer, index) => {
              console.log(`Processing answer ${index}:`, answer);
              console.log(`Answer ${index} has question:`, !!answer.question);
              console.log(
                `Answer ${index} has questionText:`,
                !!answer.questionText,
              );

              // Tính điểm dựa trên độ khó
              const calculateInitialPoint = (difficulty: string) => {
                switch (difficulty?.toLowerCase()) {
                  case "hard":
                    return 3;
                  case "medium":
                    return 2;
                  case "easy":
                  default:
                    return 1;
                }
              };

              // Lấy điểm ban đầu dựa trên độ khó
              const initialPoint = calculateInitialPoint(
                answer.difficulty || "easy",
              );

              // Nếu câu hỏi không có question hoặc question là chuỗi rỗng, sử dụng questionText thay thế
              if (!answer.question || answer.question === "") {
                const processedAnswer = {
                  ...answer,
                  _id: answer._id || answer.questionId || `question_${index}`, // Đảm bảo mỗi câu hỏi có ID duy nhất
                  question: answer.questionText || "", // Sử dụng questionText làm nội dung câu hỏi
                  options: answer.options || [],
                  correctAnswer: answer.correctAnswer || 0,
                  point: answer.point || initialPoint, // Sử dụng điểm có sẵn hoặc tính dựa trên độ khó
                  customPoint: answer.point || initialPoint, // Khởi tạo điểm tự chấm
                };
                console.log(
                  `Processed answer ${index} with question content:`,
                  processedAnswer,
                );
                return processedAnswer;
              }

              // Nếu câu hỏi không có options, tạo options mặc định
              if (!answer.options || answer.options.length === 0) {
                const processedAnswer = {
                  ...answer,
                  _id: answer._id || answer.questionId || `question_${index}`, // Đảm bảo mỗi câu hỏi có ID duy nhất
                  options: ["Option A", "Option B", "Option C", "Option D"],
                  point: answer.point || initialPoint, // Sử dụng điểm có sẵn hoặc tính dựa trên độ khó
                  customPoint: answer.point || initialPoint, // Khởi tạo điểm tự chấm
                };
                console.log(
                  `Processed answer ${index} with default options:`,
                  processedAnswer,
                );
                return processedAnswer;
              }

              const processedAnswer = {
                ...answer,
                _id:
                  answer._id ||
                  answer.id ||
                  answer.questionId ||
                  `question_${index}`, // Đảm bảo mỗi câu hỏi có ID duy nhất
                point: answer.point || initialPoint, // Sử dụng điểm có sẵn hoặc tính dựa trên độ khó
                customPoint: answer.point || initialPoint, // Khởi tạo điểm tự chấm
              };
              console.log(
                `Processed answer ${index} without changes:`,
                processedAnswer,
              );
              return processedAnswer;
            });

            console.log("Setting processed answers:", processedAnswers);
            setCandidateAnswers(processedAnswers);
          } else {
            console.log("No answers found in Redux store");
            // Không sử dụng dữ liệu mẫu, lấy dữ liệu từ storage
            setCandidateAnswers([]);
          }

          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Interview - Error checking authentication:", error);
      router.push("/admin/login");
    }
  }, [router, answers, candidate]);

  // Hàm xử lý khi chọn câu trả lời
  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    console.log(
      `Selecting answer for question ${questionId}: option ${optionIndex}`,
    );

    setCandidateAnswers((prev) => {
      const newAnswers = prev.map((q) => {
        if (q._id === questionId) {
          console.log(
            `Found question with id ${q._id}, updating selectedAnswer to ${optionIndex}`,
          );

          // Nếu câu hỏi bị bỏ qua, điểm luôn là 0
          if (q.is_skip === 1) {
            return {
              ...q,
              selectedAnswer: optionIndex,
              point: 0,
            };
          }

          // Tính điểm dựa trên độ khó của câu hỏi
          const difficultyPoint = calculatePointsByDifficulty(
            q.difficulty || "easy",
          );

          // Kiểm tra xem đáp án có đúng không
          const isCorrect = q.correctAnswer === optionIndex;

          // Nếu đã có điểm tự chấm (customPoint), sử dụng điểm đó
          // Nếu không, tính điểm dựa trên độ khó và tính đúng sai
          const calculatedPoint = isCorrect ? difficultyPoint : 0;
          const pointToUse =
            q.customPoint !== undefined ? q.customPoint : calculatedPoint;

          return {
            ...q,
            selectedAnswer: optionIndex,
            // Cập nhật điểm dựa trên tính đúng sai và độ khó
            point: pointToUse,
          };
        }
        return q;
      });

      console.log("Updated answers:", newAnswers);
      return newAnswers;
    });
  };

  // Hàm xử lý khi nhập câu trả lời khác
  const handleOtherAnswer = (questionId: string, text: string) => {
    console.log(`Setting other answer for question ${questionId}: "${text}"`);

    setCandidateAnswers((prev) => {
      const newAnswers = prev.map((q) => {
        if (q._id === questionId) {
          console.log(`Found question with id ${q._id}, updating otherAnswer`);
          return { ...q, otherAnswer: text };
        }
        return q;
      });

      console.log("Updated answers with other answer:", newAnswers);
      return newAnswers;
    });
  };

  // Hàm xử lý khi tự chấm điểm cho câu hỏi
  const handleCustomPoint = (questionId: string, point: number) => {
    console.log(`Setting custom point for question ${questionId}: ${point}`);

    setCandidateAnswers((prev) => {
      const newAnswers = prev.map((q) => {
        if (q._id === questionId) {
          console.log(
            `Found question with id ${q._id}, updating customPoint to ${point}`,
          );

          // Nếu câu hỏi bị bỏ qua, điểm luôn là 0 bất kể điểm tự chấm
          if (q.is_skip === 1) {
            return {
              ...q,
              customPoint: point, // Vẫn lưu điểm tự chấm để hiển thị
              point: 0, // Nhưng điểm thực tế vẫn là 0
            };
          }

          // Nếu không có câu trả lời đã chọn, điểm cũng là 0
          if (q.selectedAnswer === undefined) {
            return {
              ...q,
              customPoint: point, // Vẫn lưu điểm tự chấm để hiển thị
              point: 0, // Nhưng điểm thực tế vẫn là 0
            };
          }

          // Cập nhật điểm tự chấm và điểm thực tế
          // Không so sánh với đáp án đúng
          return {
            ...q,
            customPoint: point,
            point: point, // Luôn cập nhật điểm thực tế theo điểm tự chấm
          };
        }
        return q;
      });

      console.log("Updated answers with custom point:", newAnswers);
      return newAnswers;
    });
  };

  // Hàm tính điểm dựa trên độ khó của câu hỏi
  const calculatePointsByDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "hard":
        return 3;
      case "medium":
        return 2;
      case "easy":
        return 1;
      default:
        return 1; // Mặc định là 1 điểm
    }
  };

  // Hàm xử lý khi bỏ qua câu hỏi
  const handleSkipQuestion = (questionId: string, isSkipped: boolean) => {
    console.log(
      `${isSkipped ? "Skipping" : "Unskipping"} question ${questionId}`,
    );

    setCandidateAnswers((prev) => {
      const newAnswers = prev.map((q) => {
        if (q._id === questionId) {
          console.log(
            `Found question with id ${q._id}, updating is_skip to ${isSkipped ? 1 : 0}`,
          );
          return {
            ...q,
            is_skip: isSkipped ? 1 : 0,
            // Nếu bỏ qua, xóa câu trả lời đã chọn
            selectedAnswer: isSkipped ? undefined : q.selectedAnswer,
            // Nếu bỏ qua, điểm sẽ là 0
            point: isSkipped ? 0 : q.point,
          };
        }
        return q;
      });

      console.log("Updated answers with skip status:", newAnswers);
      return newAnswers;
    });
  };

  // Log candidateAnswers để kiểm tra
  console.log("candidateAnswers before filtering:", candidateAnswers);

  // Hàm lọc câu hỏi
  const filteredQuestions = candidateAnswers.filter((question) => {
    // Kiểm tra xem câu hỏi có hợp lệ không
    if (!question || !question._id) {
      console.log("Invalid question:", question);
      return false;
    }

    // Lọc theo độ khó
    if (
      filters.difficulty !== "all" &&
      question.difficulty !== filters.difficulty
    ) {
      return false;
    }

    // Lọc theo chủ đề
    if (filters.topic !== "all" && question.topic !== filters.topic) {
      return false;
    }

    // Lọc theo trạng thái trả lời
    if (
      filters.answered === "answered" &&
      question.selectedAnswer === undefined
    ) {
      return false;
    }

    if (
      filters.answered === "unanswered" &&
      question.selectedAnswer !== undefined
    ) {
      return false;
    }

    // Lọc theo ngôn ngữ
    if (selectedLanguage !== "all" && question.language !== selectedLanguage) {
      return false;
    }

    // Lọc theo cấp độ
    if (selectedLevel !== "all" && question.position !== selectedLevel) {
      return false;
    }

    return true;
  });

  // Log filteredQuestions để kiểm tra
  console.log("filteredQuestions after filtering:", filteredQuestions);

  // Hàm lưu phiên phỏng vấn
  const handleSaveInterview = async () => {
    try {
      setSaving(true);

      // Kiểm tra xem đã chọn câu trả lời cho tất cả câu hỏi chưa
      const unansweredQuestions = candidateAnswers.filter(
        (q) => q.selectedAnswer === undefined,
      );

      if (unansweredQuestions.length > 0) {
        if (
          !confirm(
            `Còn ${unansweredQuestions.length} câu hỏi chưa được trả lời. Bạn có muốn tiếp tục lưu không?`,
          )
        ) {
          setSaving(false);
          return;
        }
      }

      // Log thông tin ứng viên trước khi lưu
      console.log("Candidate before saving:", candidate);

      // Log điểm của từng câu hỏi trước khi gửi
      console.log(
        "Points before submission:",
        candidateAnswers.map((q) => ({
          id: q._id,
          point: q.point,
          customPoint: q.customPoint,
          difficulty: q.difficulty,
        })),
      );

      // Chuẩn bị dữ liệu để gửi lên API
      const formattedAnswers = candidateAnswers
        .filter((q) => q.filter_fe?.type === "questions")
        .map((q) => {
          // Đảm bảo điểm được tính đúng
          let pointValue = 0; // Mặc định là 0

          // Nếu câu hỏi bị bỏ qua hoặc không có câu trả lời, điểm là 0
          if (q.is_skip === 1 || q.selectedAnswer === undefined) {
            pointValue = 0;
          }
          // Kiểm tra xem đáp án có đúng không
          else if (q.selectedAnswer !== q.correctAnswer) {
            // Nếu đáp án không đúng, điểm luôn là 0
            pointValue = 0;
          }
          // Nếu có điểm tự chấm, sử dụng điểm đó
          else if (q.customPoint !== undefined) {
            pointValue = q.customPoint;
          }
          // Nếu có điểm được tính sẵn, sử dụng điểm đó
          else if (q.point !== undefined) {
            pointValue = q.point;
          }
          // Nếu không có điểm nào, tính dựa trên đáp án đúng/sai
          else {
            pointValue =
              q.selectedAnswer === q.correctAnswer
                ? calculatePointsByDifficulty(q.difficulty || "easy")
                : 0;
          }

          return {
            question_id: q._id || q.questionId, // Ưu tiên sử dụng _id cho MongoDB, fallback sang questionId hoặc id
            answer: q.selectedAnswer !== undefined ? q.selectedAnswer : null,
            other: q.otherAnswer || "",
            is_skip:
              q.is_skip === 1 ? 1 : q.selectedAnswer === undefined ? 1 : 0, // Ưu tiên sử dụng is_skip nếu đã đặt
            point: pointValue, // Đảm bảo điểm được gửi đi
          };
        });

      // Tạo mảng instruments cho câu hỏi có type = "scale"
      const instruments = candidateAnswers
        .filter((q) => q.filter_fe?.type === "instruments")
        .map((q) => {
          // Đảm bảo điểm được tính đúng
          let pointValue = 0; // Mặc định là 0

          // Nếu câu hỏi bị bỏ qua hoặc không có câu trả lời, điểm là 0
          if (q.is_skip === 1 || q.selectedAnswer === undefined) {
            pointValue = 0;
          }
          // Nếu có điểm tự chấm, sử dụng điểm đó
          else if (q.customPoint !== undefined) {
            pointValue = q.customPoint;
          }
          // Nếu có điểm được tính sẵn, sử dụng điểm đó
          else if (q.point !== undefined) {
            pointValue = q.point;
          }
          // Nếu không có điểm nào, tính dựa trên việc có câu trả lời hay không
          else {
            pointValue = q.selectedAnswer !== undefined ? 1 : 0;
          }

          return {
            instrument_id: q._id || q.questionId,
            answer: q.selectedAnswer !== undefined ? q.selectedAnswer : null,
            other: q.otherAnswer || "",
            point: pointValue, // Đảm bảo điểm được gửi đi
            is_skip:
              q.is_skip === 1 ? 1 : q.selectedAnswer === undefined ? 1 : 0,
          };
        });

      // Tạo mảng logic_questions cho câu hỏi có type = "multiple_choice"
      const logic_questions = candidateAnswers
        .filter((q) => q.filter_fe?.type === "logic")
        .map((q) => {
          // Đảm bảo điểm được tính đúng
          let pointValue = 0; // Mặc định là 0

          // Nếu câu hỏi bị bỏ qua hoặc không có câu trả lời, điểm là 0
          if (q.is_skip === 1 || q.selectedAnswer === undefined) {
            pointValue = 0;
          }
          // Kiểm tra xem đáp án có đúng không
          else if (q.selectedAnswer !== q.correctAnswer) {
            // Nếu đáp án không đúng, điểm luôn là 0
            pointValue = 0;
          }
          // Nếu có điểm tự chấm, sử dụng điểm đó
          else if (q.customPoint !== undefined) {
            pointValue = q.customPoint;
          }
          // Nếu có điểm được tính sẵn, sử dụng điểm đó
          else if (q.point !== undefined) {
            pointValue = q.point;
          }
          // Nếu không có điểm nào và đáp án đúng, tính dựa trên độ khó
          else if (q.selectedAnswer === q.correctAnswer) {
            pointValue = calculatePointsByDifficulty(q.difficulty || "easy");
          }

          return {
            logic_question_id: q._id || q.questionId,
            answer:
              q.selectedAnswer !== undefined ? q.selectedAnswer.toString() : "",
            other: q.otherAnswer || "",
            point: pointValue, // Đảm bảo điểm được gửi đi
            is_skip:
              q.is_skip === 1 ? 1 : q.selectedAnswer === undefined ? 1 : 0,
          };
        });

      const submissionData = {
        candidate_id: candidate?._id || "",
        answers: formattedAnswers,
        instruments: instruments,
        logic_questions: logic_questions,
        essay: {
          question: essay.question,
          answer: essay.answer,
          is_skip: essay.answer.trim() === "" ? 1 : 0,
        },
        review: {
          comment: `Nhận xét của người phỏng vấn: ${review.candidateComment}\n\nNguyện vọng và giới thiệu cá nhân của ứng viên: ${review.personalIntro}`,
          status: review.status,
        },
      };

      console.log("Submission data:", submissionData);

      // Gửi dữ liệu lên API sử dụng apiClient
      try {
        const response = await apiClient.post(
          "/api/submissions",
          submissionData,
        );

        console.log("API response:", response.data);
        toast.success("Đã lưu phiên phỏng vấn thành công!");

        // Tạo dữ liệu phiên phỏng vấn cho localStorage (để tương thích với code cũ)
        const sessionId = `session_${Date.now()}`;
        const interviewSession = {
          _id: sessionId,
          token: sessionId,
          candidate_id: candidate?._id || "unknown",
          candidateName: candidate?.full_name || "Ứng viên",
          interviewerName: "Admin",
          language: candidate?.skills?.[0] || "",
          level: candidate?.interview_level || "Junior",
          questionCount: candidateAnswers.length,
          questions: candidateAnswers,
          essay: essay,
          review: review,
          createdAt: new Date().toISOString(),
        };

        // Lưu vào localStorage
        localStorage.setItem(sessionId, JSON.stringify(interviewSession));
        console.log("Saved session to localStorage:", interviewSession);

        // Chuyển đến trang danh sách ứng viên
        router.push("/admin/candidates");
      } catch (apiError: unknown) {
        console.error("API call error:", apiError);
        toast.error(
          apiError instanceof Error
            ? apiError.message
            : "Có lỗi xảy ra khi lưu phiên phỏng vấn!",
        );
      }
    } catch (error: unknown) {
      console.error("Error saving interview:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lưu phiên phỏng vấn!",
      );
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
    console.log("Candidate data in error state:", candidate);
    console.log("Candidate ID in error state:", candidate?._id);
    console.log("Answers in error state:", answers);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Không có câu hỏi
            </h1>
            <p className="text-gray-600 mb-6">
              Không tìm thấy câu hỏi nào cho ứng viên này. Vui lòng quay lại và
              tạo câu hỏi.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/admin/sessions"
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
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

  // Tạo mảng positions từ answers
  const uniquePositions = Array.from(
    new Set(
      answers.map((answer) => answer?.position).filter((position) => position),
    ),
  );

  const uniqueLanguge = Array.from(
    new Set(
      answers.map((answer) => answer?.language).filter((language) => language),
    ),
  );

  // Thêm options cho select
  const LANGUAGE_OPTIONS = [
    { value: "all", label: "Tất cả ngôn ngữ" },
    ...(uniqueLanguge.map((language) => ({
      value: language,
      label: language,
    })) || []),
  ];

  const LEVEL_OPTIONS = [
    { value: "all", label: "Tất cả cấp độ" },
    ...(uniquePositions.map((position) => ({
      value: position,
      label: position,
    })) || []),
  ];

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
              <h1 className="text-2xl font-bold text-gray-800">
                Phỏng vấn ứng viên
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveInterview}
                  disabled={saving}
                  className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
                >
                  {saving ? (
                    <span className="mr-2 animate-spin">⟳</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                  )}
                  {saving ? "Đang lưu..." : "Lưu phỏng vấn"}
                </button>

                <Link
                  href={`/admin/sessions/${candidate?._id}`}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
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
                  <p className="font-medium">
                    {candidate?.full_name || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email:</p>
                  <p className="font-medium">
                    {candidate?.email || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại:</p>
                  <p className="font-medium">
                    {candidate?.phone_number || "Chưa có thông tin"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kỹ năng:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate?.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
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
                  <p className="font-medium">
                    {candidate?.interview_level || "Chưa có thông tin"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số câu hỏi:</p>
                  <p className="font-medium">{candidateAnswers.length}</p>
                </div>
              </div>

              {/* Tổng điểm */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">
                  Tổng điểm hiện tại
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Câu hỏi trắc nghiệm:
                    </p>
                    <p className="font-medium text-blue-700">
                      {candidateAnswers
                        .filter((q) => q.filter_fe?.type === "questions")
                        .reduce((sum, q) => sum + (q.point || 0), 0)}{" "}
                      điểm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kỹ năng mềm:</p>
                    <p className="font-medium text-purple-700">
                      {candidateAnswers
                        .filter((q) => q.filter_fe?.type === "instruments")
                        .reduce((sum, q) => sum + (q.point || 0), 0)}{" "}
                      điểm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Câu hỏi logic:</p>
                    <p className="font-medium text-indigo-700">
                      {candidateAnswers
                        .filter((q) => q.filter_fe?.type === "logic")
                        .reduce((sum, q) => sum + (q.point || 0), 0)}{" "}
                      điểm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.topic}
                onChange={(e) =>
                  setFilters({ ...filters, topic: e.target.value })
                }
              >
                <option value="all">Tất cả chủ đề</option>
                {Array.from(new Set(candidateAnswers.map((q) => q.topic))).map(
                  (topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ),
                )}
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
              >
                <option value="all">Tất cả độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.answered}
                onChange={(e) =>
                  setFilters({ ...filters, answered: e.target.value })
                }
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="answered">Đã trả lời</option>
                <option value="unanswered">Chưa trả lời</option>
              </select>

              <div className="ml-auto">
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredQuestions.length} /{" "}
                  {candidateAnswers.length} câu hỏi
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách câu hỏi */}
          <div className="space-y-6">
            {filteredQuestions && filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => {
                console.log(
                  `Rendering question ${index} with id ${question._id}`,
                );
                console.log(
                  `Question ${index} has question:`,
                  !!question.question,
                );
                console.log(
                  `Question ${index} has questionText:`,
                  !!question.questionText,
                );
                console.log(
                  `Question ${index} content:`,
                  question.question || question.questionText || "No content",
                );
                return (
                  <div
                    key={question._id}
                    className="border border-gray-200 rounded-lg p-4"
                    data-question-id={question._id}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg mb-2 mr-3">
                          Câu {index + 1}
                        </h3>
                        <div className="mb-2 flex items-center">
                          {/* Hiển thị điểm hiện tại */}
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-2">
                            Điểm:{" "}
                            {question.point !== undefined ? question.point : 0}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleSkipQuestion(
                                question._id ||
                                  question.questionId ||
                                  `question_${index}`,
                                !question.is_skip,
                              )
                            }
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              question.is_skip
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            }`}
                          >
                            {question.is_skip ? "Đã bỏ qua" : "Bỏ qua câu hỏi"}
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="mr-3">
                          Ngôn ngữ: {question.language}
                        </span>
                        <span className="mr-3">
                          Cấp độ: {question.position}
                        </span>
                        <span className="mr-3">
                          Danh mục: {question.category}
                        </span>
                        {question.difficulty && (
                          <span className="mr-3">
                            Độ khó:
                            <span
                              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                question.difficulty === "easy"
                                  ? "bg-green-100 text-green-800"
                                  : question.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {question.difficulty === "easy"
                                ? "Dễ"
                                : question.difficulty === "medium"
                                  ? "Trung bình"
                                  : "Khó"}
                            </span>
                          </span>
                        )}

                        {/* Removed scoring section and result display from here */}
                      </div>
                    </div>

                    <div className="mb-4">
                      {/* Debug info moved outside of JSX rendering */}
                      {/* 
                        Debug info:
                        Question content for ${question._id}:
                        question: question.question,
                        questionText: question.questionText
                      */}
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {question.question && question.question !== ""
                          ? question.question
                          : question.questionText &&
                              question.questionText !== ""
                            ? question.questionText
                            : "Không có nội dung câu hỏi"}
                      </p>
                      {/* Check for code blocks in question or questionText */}
                      {((question.question &&
                        question.question !== "" &&
                        question.question.includes("```")) ||
                        (question.questionText &&
                          question.questionText !== "" &&
                          question.questionText.includes("```"))) && (
                        <div className="mt-2 p-3 bg-gray-800 text-white rounded-md overflow-x-auto">
                          <pre>
                            {(question.question && question.question !== ""
                              ? question.question
                              : question.questionText &&
                                  question.questionText !== ""
                                ? question.questionText
                                : ""
                            )
                              .split("```")
                              .filter((_, i) => i % 2 === 1)
                              .join("\n")}
                          </pre>
                        </div>
                      )}

                      {/* Removed scoring section from here */}
                    </div>
                    {/* Show choices if question type is multiple_choice and choices exist */}
                    {question.type === "multiple_choice" &&
                    question.choices &&
                    question.choices.length > 0 ? (
                      <div className="space-y-2">
                        {question.choices.map((choice, choiceIndex) => (
                          <div
                            key={choiceIndex}
                            className={`p-3 rounded-lg ${question.is_skip ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${
                              question.selectedAnswer === choiceIndex
                                ? "bg-blue-100 border border-blue-300"
                                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              if (!question.is_skip) {
                                console.log(
                                  `Clicked choice ${choiceIndex} for question with id ${question._id}`,
                                );
                                // Use _id if available, otherwise fall back to questionId or a generated ID
                                const questionId =
                                  question._id ||
                                  question.questionId ||
                                  `question_${choiceIndex}`;
                                handleSelectAnswer(questionId, choiceIndex);
                              }
                            }}
                          >
                            <div className="flex items-start">
                              <div
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                  question.selectedAnswer === choiceIndex
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {String.fromCharCode(65 + choiceIndex)}
                              </div>
                              <div className="flex-1">{choice.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Show options for other question types if they exist */
                      question.options &&
                      question.options.length > 0 && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg ${question.is_skip ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${
                                question.selectedAnswer === optionIndex
                                  ? "bg-blue-100 border border-blue-300"
                                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                if (!question.is_skip) {
                                  console.log(
                                    `Clicked option ${optionIndex} for question with id ${question._id}`,
                                  );
                                  // Use _id if available, otherwise fall back to questionId or a generated ID
                                  const questionId =
                                    question._id ||
                                    question.questionId ||
                                    `question_${optionIndex}`;
                                  handleSelectAnswer(questionId, optionIndex);
                                }
                              }}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                    question.selectedAnswer === optionIndex
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <div className="flex-1">{option}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}

                    {/* Câu trả lời khác */}
                    <div className="mt-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-yellow-200 text-yellow-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">Câu trả lời khác:</p>
                          <textarea
                            className={`w-full border border-gray-300 rounded-lg p-2 min-h-[80px] ${question.is_skip ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            placeholder="Nhập câu trả lời khác của ứng viên..."
                            value={question.otherAnswer || ""}
                            onChange={(e) => {
                              if (!question.is_skip) {
                                console.log(
                                  `Changing other answer for question with id ${question._id}`,
                                );
                                // Add null check and fallback to ensure we always pass a string
                                handleOtherAnswer(
                                  question._id ||
                                    question.id ||
                                    question.questionId ||
                                    "",
                                  e.target.value,
                                );
                              }
                            }}
                            disabled={question.is_skip === 1}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Nút bật/tắt giải thích */}
                    {(question.explanation || question.answer_explanation) && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            // Toggle explanation visibility for this specific question
                            const questionId = question._id || "";
                            setVisibleExplanations((prev) => ({
                              ...prev,
                              [questionId]: !prev[questionId],
                            }));
                          }}
                          className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          {visibleExplanations[question._id || ""]
                            ? "Ẩn giải thích"
                            : "Hiển thị giải thích"}
                        </button>

                        {/* Hiển thị giải thích chỉ cho câu hỏi được chọn */}
                        {visibleExplanations[question._id || ""] && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-bold text-blue-800">
                              Giải thích:
                            </p>
                            <p className="text-blue-700">
                              {question.explanation ||
                                question.answer_explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Khu vực chấm điểm - đặt dưới phần câu trả lời và làm nổi bật */}
                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-sm">
                      <h3 className="text-lg font-bold text-yellow-800 mb-2">
                        Chấm điểm
                      </h3>
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center mr-6 mb-2">
                          <span className="font-medium mr-3 text-yellow-700">
                            Điểm số:
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            className="w-24 px-3 py-2 text-lg font-bold border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                            value={
                              question.customPoint !== undefined
                                ? question.customPoint
                                : calculatePointsByDifficulty(
                                    question.difficulty || "easy",
                                  )
                            }
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0 && question._id) {
                                handleCustomPoint(question._id, value);
                              }
                            }}
                          />
                          <span className="ml-2 text-yellow-700 font-medium">
                            điểm
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            Điểm hiện tại:
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                            {question.point !== undefined ? question.point : 0}
                          </span>

                          {question.difficulty && (
                            <>
                              <span className="text-sm text-gray-600 mx-2">
                                Độ khó:
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full font-medium text-sm ${
                                  question.difficulty.toLowerCase() === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : question.difficulty.toLowerCase() ===
                                        "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {question.difficulty.toLowerCase() === "easy"
                                  ? "Dễ (1đ)"
                                  : question.difficulty.toLowerCase() ===
                                      "medium"
                                    ? "TB (2đ)"
                                    : "Khó (3đ)"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Không có câu hỏi
                </h3>
                <p className="text-gray-600">
                  Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            )}
          </div>

          {/* Phần câu hỏi tự luận */}
          <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Câu hỏi tự luận
            </h2>

            <div className="mb-4">
              <label
                htmlFor="essay-question"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Câu hỏi:
              </label>
              <input
                id="essay-question"
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={essay.question}
                onChange={(e) =>
                  setEssay({ ...essay, question: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="essay-answer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Câu trả lời:
              </label>
              <textarea
                id="essay-answer"
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[200px]"
                placeholder="Nhập câu trả lời tự luận của ứng viên..."
                value={essay.answer}
                onChange={(e) => setEssay({ ...essay, answer: e.target.value })}
              />
            </div>
          </div>

          {/* Phần review */}
          <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-blue-50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đánh giá</h2>

            <div className="mb-4">
              <label
                htmlFor="review-candidate-comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nhận xét ứng viên:
              </label>
              <textarea
                id="review-candidate-comment"
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                placeholder="Nhập nhận xét về ứng viên"
                value={review.candidateComment}
                onChange={(e) =>
                  setReview({ ...review, candidateComment: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="review-personal-intro"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Giới thiệu cá nhân và nguyện vọng:
              </label>
              <textarea
                id="review-personal-intro"
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                placeholder="Nhập thông tin giới thiệu cá nhân và nguyện vọng của ứng viên"
                value={review.personalIntro}
                onChange={(e) =>
                  setReview({ ...review, personalIntro: e.target.value })
                }
              />
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              )}
              {saving ? "Đang lưu..." : "Lưu phỏng vấn"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewPage;

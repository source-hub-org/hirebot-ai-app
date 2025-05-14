import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useCandidateSubmissions } from "@/hooks/useCandidateSubmissions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import candidateService from "@/services/candidateService";

export default function CandidateDetail() {
  const router = useRouter();
  const { id } = router.query;

  console.log("Candidate ID from router:", id);

  const { submissions, loading, error } = useCandidateSubmissions(id);
  const [activeTab, setActiveTab] = useState<
    "mcq" | "essay" | "instruments" | "logic_questions"
  >("mcq");
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);

  // Log the submissions data
  console.log("Submissions data in component:", submissions);
  console.log("Total submissions:", submissions.length);

  // Log instruments and logic_questions data specifically
  if (submissions.length > 0) {
    console.log("Instruments data:", submissions[0].instruments);
    console.log("Logic questions data:", submissions[0].logic_questions);
  }

  // Get the selected submission (if any)
  const submission =
    submissions.length > 0 ? submissions[selectedSubmissionIndex] : null;
  const candidate = submission?.candidate;

  // Log detailed submission data
  console.log("Submission object:", submission);
  console.log("Instruments in submission:", submission?.instruments);
  console.log("Logic questions in submission:", submission?.logic_questions);

  // Calculate MCQ score and statistics for the selected submission
  const calculateMcqStats = () => {
    const currentSubmission = submissions[selectedSubmissionIndex];
    if (
      !currentSubmission ||
      !currentSubmission.answers ||
      currentSubmission.answers.length === 0
    ) {
      return {
        score: 0,
        total: 0,
        percentage: 0,
        skipped: 0,
        correct: 0,
        incorrect: 0,
        totalPoints: 0,
        byDifficulty: {
          easy: { total: 0, correct: 0, percentage: 0 },
          medium: { total: 0, correct: 0, percentage: 0 },
          hard: { total: 0, correct: 0, percentage: 0 },
        },
        byCategory: {},
      };
    }

    const total = currentSubmission.answers.length;
    const skipped = currentSubmission.answers.filter(
      (answer) => answer.is_skip,
    ).length;
    const answered = total - skipped;

    const correct = currentSubmission.answers.filter(
      (answer) =>
        !answer.is_skip &&
        answer.answer !== null &&
        answer.answer === answer.question.correctAnswer,
    ).length;

    const incorrect = answered - correct;
    const percentage = answered > 0 ? Math.round((correct / total) * 100) : 0;

    // Calculate total points
    const totalPoints = currentSubmission.answers.reduce((sum, answer) => {
      // Log each answer's point value for debugging
      console.log(
        `Answer point for question ${answer.question_id}:`,
        answer.point,
      );
      return sum + (answer.point || 0);
    }, 0);

    // Define difficulty types
    type DifficultyLevel = "easy" | "medium" | "hard";
    type DifficultyStats = {
      [key in DifficultyLevel]: {
        total: number;
        correct: number;
        percentage: number;
      };
    };

    // Calculate stats by difficulty
    const byDifficulty: DifficultyStats = {
      easy: { total: 0, correct: 0, percentage: 0 },
      medium: { total: 0, correct: 0, percentage: 0 },
      hard: { total: 0, correct: 0, percentage: 0 },
    };

    // Calculate stats by category
    const byCategory: Record<
      string,
      { total: number; correct: number; percentage: number; points: number }
    > = {};

    currentSubmission.answers.forEach((answer) => {
      const difficultyValue =
        answer.question?.difficulty?.toLowerCase() || "medium";
      // Ensure difficulty is one of the allowed values
      const difficulty =
        difficultyValue === "easy" ||
        difficultyValue === "medium" ||
        difficultyValue === "hard"
          ? (difficultyValue as DifficultyLevel)
          : "medium";

      const category = answer.question?.category || "Không phân loại";

      // Update difficulty stats
      byDifficulty[difficulty].total++;
      if (
        !answer.is_skip &&
        answer.answer !== null &&
        answer.answer === answer.question.correctAnswer
      ) {
        byDifficulty[difficulty].correct++;
      }

      // Update category stats
      if (!byCategory[category]) {
        byCategory[category] = {
          total: 0,
          correct: 0,
          percentage: 0,
          points: 0,
        };
      }

      byCategory[category].total++;
      if (
        !answer.is_skip &&
        answer.answer !== null &&
        answer.answer === answer.question.correctAnswer
      ) {
        byCategory[category].correct++;
      }

      // Add points to category stats
      byCategory[category].points =
        (byCategory[category].points || 0) + (answer.point || 0);
    });

    // Calculate percentages for each difficulty
    Object.keys(byDifficulty).forEach((difficultyKey) => {
      const difficulty = difficultyKey as DifficultyLevel;
      const { total, correct } = byDifficulty[difficulty];
      byDifficulty[difficulty].percentage =
        total > 0 ? Math.round((correct / total) * 100) : 0;
    });

    // Calculate percentages for each category
    Object.keys(byCategory).forEach((category) => {
      const { total, correct } = byCategory[category];
      byCategory[category].percentage =
        total > 0 ? Math.round((correct / total) * 100) : 0;
    });

    return {
      score: correct,
      total,
      percentage,
      skipped,
      correct,
      incorrect,
      totalPoints,
      byDifficulty,
      byCategory,
    };
  };

  // Calculate Instruments (soft skills) score
  const calculateInstrumentsStats = () => {
    const currentSubmission = submissions[selectedSubmissionIndex];
    if (
      !currentSubmission ||
      !currentSubmission.instruments ||
      currentSubmission.instruments.length === 0
    ) {
      return {
        total: 0,
        answered: 0,
        skipped: 0,
        percentage: 0,
        totalPoints: 0,
      };
    }

    const total = currentSubmission.instruments.length;
    const skipped = currentSubmission.instruments.filter(
      (item) => item.is_skip,
    ).length;
    const answered = total - skipped;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    // Calculate total points
    const totalPoints = currentSubmission.instruments.reduce((sum, item) => {
      // Log each instrument's point value for debugging
      console.log(`Instrument point for ${item.instrument_id}:`, item.point);
      return sum + (item.point || 0);
    }, 0);

    return {
      total,
      answered,
      skipped,
      percentage,
      totalPoints,
    };
  };

  // Calculate Logic Questions score
  const calculateLogicStats = () => {
    const currentSubmission = submissions[selectedSubmissionIndex];
    if (
      !currentSubmission ||
      !currentSubmission.logic_questions ||
      currentSubmission.logic_questions.length === 0
    ) {
      return {
        total: 0,
        answered: 0,
        skipped: 0,
        percentage: 0,
        totalPoints: 0,
      };
    }

    const total = currentSubmission.logic_questions.length;
    const skipped = currentSubmission.logic_questions.filter(
      (item) => item.is_skip,
    ).length;
    const answered = total - skipped;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    // Calculate total points
    const totalPoints = currentSubmission.logic_questions.reduce(
      (sum, item) => {
        // Log each logic question's point value for debugging
        console.log(
          `Logic question point for ${item.logic_question_id}:`,
          item.point,
        );
        return sum + (item.point || 0);
      },
      0,
    );

    return {
      total,
      answered,
      skipped,
      percentage,
      totalPoints,
    };
  };

  // Calculate total weighted score based on the new rule:
  // MCQ: 70%, Soft Skills: 20%, Logic: 10%
  const calculateTotalScore = () => {
    const mcqStats = calculateMcqStats();
    const instrumentsStats = calculateInstrumentsStats();
    const logicStats = calculateLogicStats();

    const mcqWeight = 0.7;
    const instrumentsWeight = 0.2;
    const logicWeight = 0.1;

    const mcqContribution = mcqStats.percentage * mcqWeight;
    const instrumentsContribution =
      instrumentsStats.percentage * instrumentsWeight;
    const logicContribution = logicStats.percentage * logicWeight;

    const totalScore =
      mcqContribution + instrumentsContribution + logicContribution;

    // Calculate total points from all question types
    console.log("MCQ points:", mcqStats.totalPoints);
    console.log("Instruments points:", instrumentsStats.totalPoints);
    console.log("Logic points:", logicStats.totalPoints);

    const totalPoints =
      (mcqStats.totalPoints || 0) +
      (instrumentsStats.totalPoints || 0) +
      (logicStats.totalPoints || 0);
    console.log("Total points calculated:", totalPoints);

    return {
      totalScore: Math.round(totalScore),
      mcqScore: mcqStats.percentage,
      instrumentsScore: instrumentsStats.percentage,
      logicScore: logicStats.percentage,
      mcqContribution,
      instrumentsContribution,
      logicContribution,
      totalPoints,
      mcqPoints: mcqStats.totalPoints,
      instrumentsPoints: instrumentsStats.totalPoints,
      logicPoints: logicStats.totalPoints,
    };
  };

  const mcqStats = calculateMcqStats();
  console.log("MCQ Stats:", mcqStats);
  console.log("Total Points from mcqStats:", mcqStats.totalPoints);

  const mcqScore = {
    score: mcqStats.score,
    total: mcqStats.total,
    percentage: mcqStats.percentage,
    totalPoints: mcqStats.totalPoints || 0, // Ensure it's never undefined
  };

  const instrumentsStats = calculateInstrumentsStats();
  const logicStats = calculateLogicStats();
  const totalScoreData = calculateTotalScore();

  // State for tracking status update
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null,
  );
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(
    null,
  );

  // Function to update candidate status
  const updateCandidateStatus = async (status: "passed" | "rejected") => {
    if (!candidate?._id) {
      setStatusUpdateError("Không tìm thấy ID của ứng viên");
      return;
    }

    try {
      setStatusUpdateLoading(true);
      setStatusUpdateError(null);
      setStatusUpdateSuccess(null);

      await candidateService.updateCandidate(candidate._id, { status });

      // Show success message
      setStatusUpdateSuccess(
        status === "passed"
          ? "Đã cập nhật trạng thái: Đậu phỏng vấn vòng 1"
          : "Đã cập nhật trạng thái: Trượt phỏng vấn",
      );

      // Refresh the page after a short delay to show updated status
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      setStatusUpdateError("Có lỗi xảy ra khi cập nhật trạng thái ứng viên");
    } finally {
      setStatusUpdateLoading(false);
    }
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

          {!loading && submissions.length === 0 && !error && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <p className="text-center text-gray-500">
                Không tìm thấy dữ liệu bài thi của ứng viên này
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/admin/candidates">
                  <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                    Quay lại danh sách
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Main content section */}
          {submissions.length > 0 && submissions[0]?.candidate && (
            <React.Fragment>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  Chi tiết kết quả: {submissions[0].candidate.full_name}
                </h1>
              </div>

              {/* Submissions selector */}
              {submissions.length > 1 && (
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Lần phỏng vấn ({submissions.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {submissions.map((sub, index) => (
                      <div
                        key={sub._id || index}
                        onClick={() => setSelectedSubmissionIndex(index)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSubmissionIndex === index
                            ? "border-primary bg-primary-light text-white"
                            : "border-gray-200 hover:border-primary-light"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Lần {index + 1}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-white text-primary">
                            {new Date(
                              sub.createdAt || sub.created_at || Date.now(),
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex justify-between">
                            <span>Technical:</span>
                            <span className="font-medium">
                              {sub.answers?.filter(
                                (a) =>
                                  !a.is_skip &&
                                  a.answer === a.question.correctAnswer,
                              ).length || 0}
                              /{sub.answers?.length || 0}
                              <span className="ml-1 text-blue-600">
                                (
                                {sub.answers?.reduce(
                                  (sum, a) => sum + (a.point || 0),
                                  0,
                                ) || 0}
                                đ)
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Kỹ năng mềm:</span>
                            <span className="font-medium">
                              {sub.instruments?.filter((i) => !i.is_skip)
                                .length || 0}
                              /{sub.instruments?.length || 0}
                              <span className="ml-1 text-purple-600">
                                (
                                {sub.instruments?.reduce(
                                  (sum, i) => sum + (i.point || 0),
                                  0,
                                ) || 0}
                                đ)
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Câu hỏi logic:</span>
                            <span className="font-medium">
                              {sub.logic_questions?.filter((q) => !q.is_skip)
                                .length || 0}
                              /{sub.logic_questions?.length || 0}
                              <span className="ml-1 text-indigo-600">
                                (
                                {sub.logic_questions?.reduce(
                                  (sum, q) => sum + (q.point || 0),
                                  0,
                                ) || 0}
                                đ)
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                            <span className="font-medium">Tổng điểm:</span>
                            <span className="font-bold text-green-600">
                              {(sub.answers?.reduce(
                                (sum, a) => sum + (a.point || 0),
                                0,
                              ) || 0) +
                                (sub.instruments?.reduce(
                                  (sum, i) => sum + (i.point || 0),
                                  0,
                                ) || 0) +
                                (sub.logic_questions?.reduce(
                                  (sum, q) => sum + (q.point || 0),
                                  0,
                                ) || 0)}
                              đ
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-primary">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Thông tin ứng viên
                    </h2>
                  </div>
                  {submission && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      Phỏng vấn lần {selectedSubmissionIndex + 1}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">Email:</p>
                    </div>
                    <p className="font-medium text-gray-800 pl-6">
                      {candidate?.email || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">Kỹ năng:</p>
                    </div>
                    <div className="pl-6">
                      {candidate?.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium mr-2 mb-2"
                        >
                          {skill}
                        </span>
                      )) || "N/A"}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">Cấp độ:</p>
                    </div>
                    <p className="font-medium text-gray-800 pl-6">
                      {candidate?.interview_level || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">
                        Số điện thoại:
                      </p>
                    </div>
                    <p className="font-medium text-gray-800 pl-6">
                      {candidate?.phone_number || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md md:col-span-2">
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">Trạng thái:</p>
                    </div>
                    <div className="flex flex-col space-y-3 pl-6">
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            candidate?.status === "passed"
                              ? "bg-green-100 text-green-800"
                              : candidate?.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {candidate?.status === "passed"
                            ? "Đậu phỏng vấn vòng 1"
                            : candidate?.status === "rejected"
                              ? "Trượt phỏng vấn"
                              : "Đang chờ"}
                        </span>
                      </div>

                      <div className="flex space-x-3 mt-2">
                        <button
                          onClick={() => updateCandidateStatus("passed")}
                          disabled={
                            statusUpdateLoading ||
                            candidate?.status === "passed"
                          }
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            candidate?.status === "passed"
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {statusUpdateLoading && candidate?.status !== "passed"
                            ? "Đang cập nhật..."
                            : "Đậu phỏng vấn"}
                        </button>

                        <button
                          onClick={() => updateCandidateStatus("rejected")}
                          disabled={
                            statusUpdateLoading ||
                            candidate?.status === "rejected"
                          }
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            candidate?.status === "rejected"
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          {statusUpdateLoading &&
                          candidate?.status !== "rejected"
                            ? "Đang cập nhật..."
                            : "Trượt phỏng vấn"}
                        </button>
                      </div>

                      {statusUpdateError && (
                        <p className="text-sm text-red-500 flex items-center mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {statusUpdateError}
                        </p>
                      )}

                      {statusUpdateSuccess && (
                        <p className="text-sm text-green-500 flex items-center mt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {statusUpdateSuccess}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6 p-1">
                  <nav className="flex flex-wrap justify-start items-center w-full">
                    <button
                      onClick={() => setActiveTab("mcq")}
                      className={`py-3 px-6 text-center font-medium text-sm transition-all duration-200 rounded-lg mr-2 ${
                        activeTab === "mcq"
                          ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Câu hỏi Technical
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("instruments")}
                      className={`py-3 px-6 text-center font-medium text-sm transition-all duration-200 rounded-lg mr-2 ${
                        activeTab === "instruments"
                          ? "bg-purple-100 text-purple-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Câu hỏi kỹ năng mềm
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("logic_questions")}
                      className={`py-3 px-6 text-center font-medium text-sm transition-all duration-200 rounded-lg mr-2 ${
                        activeTab === "logic_questions"
                          ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        Câu hỏi logic
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("essay")}
                      className={`py-3 px-6 text-center font-medium text-sm transition-all duration-200 rounded-lg ${
                        activeTab === "essay"
                          ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Câu hỏi tự luận
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Score summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-600 text-sm">
                        Kỹ năng Technical:
                      </p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                        {mcqScore.totalPoints !== undefined &&
                        mcqScore.totalPoints !== null
                          ? `${mcqScore.totalPoints}đ`
                          : "0đ"}
                      </span>
                    </div>
                    <div className="flex items-end mt-1">
                      <p className="text-2xl font-bold text-blue-600">
                        {mcqScore.score}
                      </p>
                      <p className="text-gray-500 ml-1">/{mcqScore.total}</p>
                    </div>
                    <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${mcqScore.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {mcqScore.percentage}% đúng
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-gray-600 text-sm">
                      Kỹ năng mềm & Logic:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-xs text-gray-600">Kỹ năng mềm:</p>
                          <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full font-medium">
                            {instrumentsStats.totalPoints !== undefined
                              ? `${instrumentsStats.totalPoints}đ`
                              : "0đ"}
                          </span>
                        </div>
                        <div className="flex items-end">
                          <p className="text-lg font-bold text-purple-600">
                            {instrumentsStats.answered}
                          </p>
                          <p className="text-gray-500 ml-1 text-xs">
                            /{instrumentsStats.total}
                          </p>
                        </div>
                        <div className="mt-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full"
                            style={{ width: `${instrumentsStats.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {instrumentsStats.percentage}% hoàn thành
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-xs text-gray-600">Tư duy logic:</p>
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full font-medium">
                            {logicStats.totalPoints !== undefined
                              ? `${logicStats.totalPoints}đ`
                              : "0đ"}
                          </span>
                        </div>
                        <div className="flex items-end">
                          <p className="text-lg font-bold text-indigo-600">
                            {logicStats.answered}
                          </p>
                          <p className="text-gray-500 ml-1 text-xs">
                            /{logicStats.total}
                          </p>
                        </div>
                        <div className="mt-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full"
                            style={{ width: `${logicStats.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {logicStats.percentage}% hoàn thành
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-600 text-sm">Tổng điểm:</p>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                        {totalScoreData.totalPoints !== undefined &&
                        totalScoreData.totalPoints !== null
                          ? `${totalScoreData.totalPoints}đ`
                          : "0đ"}
                      </span>
                    </div>
                    <div className="flex items-end mb-2">
                      <p className="text-2xl font-bold text-green-600">
                        {totalScoreData.totalScore}
                      </p>
                      <p className="text-gray-500 ml-1">/100</p>
                    </div>
                    <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${totalScoreData.totalScore}%` }}
                      ></div>
                    </div>

                    {/* Phần đóng góp điểm từng loại câu hỏi */}
                    <div className="mt-3 text-xs text-gray-600">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="w-20">Technical:</span>
                          <div className="ml-1 w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-full"
                              style={{ width: `${mcqScore.percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-1">{mcqScore.percentage}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">×0.7 =</span>
                          <span className="font-medium">
                            {Math.round(totalScoreData.mcqContribution)}đ
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <span className="w-20">Kỹ năng mềm:</span>
                          <div className="ml-1 w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-500 h-full"
                              style={{
                                width: `${instrumentsStats.percentage}%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-1">
                            {instrumentsStats.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">×0.2 =</span>
                          <span className="font-medium">
                            {Math.round(totalScoreData.instrumentsContribution)}
                            đ
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="w-20">Tư duy logic:</span>
                          <div className="ml-1 w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full"
                              style={{ width: `${logicStats.percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-1">{logicStats.percentage}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">×0.1 =</span>
                          <span className="font-medium">
                            {Math.round(totalScoreData.logicContribution)}đ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-green-200">
                      <p className="text-sm text-gray-600">
                        {submission?.review?.status === "passed"
                          ? "Đánh giá: Đạt"
                          : submission?.review?.status === "rejected"
                            ? "Đánh giá: Không đạt"
                            : "Chưa có đánh giá"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tổng điểm thô và Công thức tính điểm - Hiển thị song song */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Tổng điểm thô */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Tổng điểm thô
                      </h2>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Tổng: {totalScoreData.totalPoints}đ
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="flex flex-col items-center bg-blue-50 rounded-lg p-3 border border-blue-100 transition-all hover:shadow-md">
                        <span className="text-gray-700 font-medium mb-1">
                          Technical
                        </span>
                        <span className="font-bold text-blue-600 text-lg">
                          {mcqScore.totalPoints !== undefined
                            ? mcqScore.totalPoints
                            : 0}
                          đ
                        </span>
                      </div>
                      <div className="flex flex-col items-center bg-purple-50 rounded-lg p-3 border border-purple-100 transition-all hover:shadow-md">
                        <span className="text-gray-700 font-medium mb-1">
                          Kỹ năng mềm
                        </span>
                        <span className="font-bold text-purple-600 text-lg">
                          {instrumentsStats.totalPoints !== undefined
                            ? instrumentsStats.totalPoints
                            : 0}
                          đ
                        </span>
                      </div>
                      <div className="flex flex-col items-center bg-indigo-50 rounded-lg p-3 border border-indigo-100 transition-all hover:shadow-md">
                        <span className="text-gray-700 font-medium mb-1">
                          Tư duy logic
                        </span>
                        <span className="font-bold text-indigo-600 text-lg">
                          {logicStats.totalPoints !== undefined
                            ? logicStats.totalPoints
                            : 0}
                          đ
                        </span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="font-medium text-yellow-800 mb-2 text-sm">
                        Về điểm thô:
                      </p>
                      <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
                        <li>
                          Điểm thô phản ánh số điểm thực tế đạt được dựa trên độ
                          khó của câu hỏi
                        </li>
                        <li>
                          Câu hỏi Technical: Dễ (1đ), Trung bình (2đ), Khó (3đ)
                        </li>
                        <li>
                          Điểm thô giúp phân biệt ứng viên có cùng tỷ lệ % nhưng
                          trả lời các câu hỏi có độ khó khác nhau
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Công thức tính điểm */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Công thức tính điểm
                      </h2>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Kết quả: {totalScoreData.totalScore}đ
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-100 mb-4">
                      <p className="text-gray-800 font-medium mb-3 text-sm">
                        Công thức tính điểm tổng hợp:
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="mb-3 text-sm font-medium text-gray-700">
                          Điểm tổng hợp = (Điểm Technical × 0.7) + (Điểm Kỹ năng
                          mềm × 0.2) + (Điểm Tư duy logic × 0.1)
                        </p>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-blue-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-600">Technical</p>
                            <p className="font-medium text-blue-700">
                              {mcqScore.percentage}%
                            </p>
                            <p className="text-xs text-gray-500">× 0.7</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-600">Kỹ năng mềm</p>
                            <p className="font-medium text-purple-700">
                              {instrumentsStats.percentage}%
                            </p>
                            <p className="text-xs text-gray-500">× 0.2</p>
                          </div>
                          <div className="bg-indigo-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-600">
                              Tư duy logic
                            </p>
                            <p className="font-medium text-indigo-700">
                              {logicStats.percentage}%
                            </p>
                            <p className="text-xs text-gray-500">× 0.1</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-800 mb-2">
                          <span className="bg-blue-100 px-2 py-1 rounded">
                            {Math.round(totalScoreData.mcqContribution)}
                          </span>
                          <span>+</span>
                          <span className="bg-purple-100 px-2 py-1 rounded">
                            {Math.round(totalScoreData.instrumentsContribution)}
                          </span>
                          <span>+</span>
                          <span className="bg-indigo-100 px-2 py-1 rounded">
                            {Math.round(totalScoreData.logicContribution)}
                          </span>
                          <span>=</span>
                          <span className="bg-green-100 px-3 py-1 rounded-lg font-bold">
                            {totalScoreData.totalScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
                      <p className="font-medium text-green-800">
                        Lưu ý về cách tính điểm:
                      </p>
                      <p className="text-gray-700 mt-1">
                        Điểm tổng hợp được tính dựa trên tỷ lệ phần trăm của
                        từng loại câu hỏi, với trọng số khác nhau cho mỗi loại.
                      </p>
                    </div>
                  </div>
                </div>

                {/* MCQ Tab Content */}
                {activeTab === "mcq" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Chi tiết câu trả lời Technical
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Đúng: {mcqScore.score}/{mcqScore.total} (
                          {mcqScore.percentage}%)
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Điểm:{" "}
                          {mcqScore.totalPoints !== undefined &&
                          mcqScore.totalPoints !== null
                            ? `${mcqScore.totalPoints}đ`
                            : "0đ"}
                        </div>
                      </div>
                    </div>

                    {/* MCQ Statistics */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">
                        Thống kê kết quả
                      </h3>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Tổng số câu</p>
                          <p className="text-xl font-bold text-blue-600">
                            {mcqStats.total}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Đúng</p>
                          <p className="text-xl font-bold text-green-600">
                            {mcqStats.correct}
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Sai</p>
                          <p className="text-xl font-bold text-red-600">
                            {mcqStats.incorrect}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Bỏ qua</p>
                          <p className="text-xl font-bold text-gray-600">
                            {mcqStats.skipped}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {submissions[selectedSubmissionIndex].answers.map(
                        (item, index) => (
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
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    item.question?.difficulty?.toLowerCase() ===
                                    "easy"
                                      ? "bg-green-100 text-green-800"
                                      : item.question?.difficulty?.toLowerCase() ===
                                          "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.question?.difficulty?.toLowerCase() ===
                                  "easy"
                                    ? "Dễ"
                                    : item.question?.difficulty?.toLowerCase() ===
                                        "medium"
                                      ? "Trung bình"
                                      : "Khó"}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                                  {item.question?.category || "Không phân loại"}
                                </span>
                                {item.question?.topic && (
                                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                                    {item.question.topic}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {/* Score display */}
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                                  Điểm:{" "}
                                  {item.is_skip
                                    ? 0
                                    : item.answer !== null &&
                                        item.answer ===
                                          item.question.correctAnswer
                                      ? 1
                                      : 0}
                                </span>
                                {item.is_skip ? (
                                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                                    Bỏ qua
                                  </span>
                                ) : item.answer !== null &&
                                  item.answer ===
                                    item.question.correctAnswer ? (
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
                              {item.question.options &&
                                item.question.options.map(
                                  (option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`p-3 rounded ${
                                        item.answer === optIndex
                                          ? item.answer ===
                                            item.question.correctAnswer
                                            ? "bg-green-100 border border-green-300"
                                            : "bg-red-100 border border-red-300"
                                          : item.question.correctAnswer ===
                                              optIndex
                                            ? "bg-green-100 border border-green-300"
                                            : "bg-white border border-gray-200"
                                      }`}
                                    >
                                      <div className="flex items-start">
                                        <div className="mr-2 font-medium">
                                          {String.fromCharCode(65 + optIndex)}.
                                        </div>
                                        <div>{option}</div>
                                      </div>
                                    </div>
                                  ),
                                )}
                            </div>

                            <div className="mt-3 text-sm">
                              {item.is_skip ? (
                                <p className="text-gray-600">
                                  Ứng viên đã bỏ qua câu hỏi này
                                </p>
                              ) : item.answer !== null &&
                                item.answer === item.question.correctAnswer ? (
                                <p className="text-green-600">Đúng</p>
                              ) : (
                                <p className="text-red-600">
                                  Sai. Đáp án đúng:{" "}
                                  {String.fromCharCode(
                                    65 + item.question.correctAnswer,
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Instruments Tab Content */}
                {activeTab === "instruments" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Chi tiết câu trả lời kỹ năng mềm
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          Hoàn thành: {instrumentsStats.answered}/
                          {instrumentsStats.total} (
                          {instrumentsStats.percentage}%)
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Điểm: {instrumentsStats.totalPoints}đ
                        </div>
                      </div>
                    </div>

                    {/* Debug information */}

                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">
                        Thống kê kết quả
                      </h3>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Tổng số câu</p>
                          <p className="text-xl font-bold text-blue-600">
                            {submissions[selectedSubmissionIndex]?.instruments
                              ?.length || 0}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Đã trả lời</p>
                          <p className="text-xl font-bold text-green-600">
                            {submissions[
                              selectedSubmissionIndex
                            ]?.instruments?.filter((item) => !item.is_skip)
                              .length || 0}
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Bỏ qua</p>
                          <p className="text-xl font-bold text-red-600">
                            {submissions[
                              selectedSubmissionIndex
                            ]?.instruments?.filter((item) => item.is_skip)
                              .length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-medium text-lg mb-3">
                      Chi tiết câu hỏi
                    </h3>
                    <div className="space-y-6">
                      {submissions[selectedSubmissionIndex]?.instruments &&
                      submissions[selectedSubmissionIndex].instruments.length >
                        0 ? (
                        submissions[selectedSubmissionIndex].instruments.map(
                          (item, index) => (
                            <div
                              key={item.instrument_id || index}
                              className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium">Câu {index + 1}</h3>
                                <div className="flex items-center space-x-2">
                                  {/* Score display for instruments */}
                                  {!item.is_skip && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded font-medium">
                                      Điểm: {item.answer !== null ? 1 : 0}/1
                                    </span>
                                  )}
                                  {item.is_skip ? (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                      Bỏ qua
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                                      Đã trả lời
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="mb-4">
                                {item.instrument?.questionText ||
                                  "Không có nội dung câu hỏi"}
                              </p>

                              <div className="space-y-2 mb-4">
                                {item.instrument?.options &&
                                  item.instrument.options.map(
                                    (option, optIndex) => (
                                      <div
                                        key={optIndex}
                                        className={`p-3 rounded ${
                                          item.answer === optIndex
                                            ? "bg-blue-100 border border-blue-300"
                                            : "bg-white border border-gray-200"
                                        }`}
                                      >
                                        <div className="flex items-start">
                                          <div className="mr-2 font-medium">
                                            {optIndex + 1}.
                                          </div>
                                          <div>{option}</div>
                                        </div>
                                      </div>
                                    ),
                                  )}
                              </div>

                              {!item.is_skip &&
                                item.answer !== null &&
                                item.instrument?.options && (
                                  <p className="text-sm text-blue-600">
                                    Đã chọn:{" "}
                                    {item.instrument.options[item.answer] ||
                                      `Lựa chọn ${item.answer}`}
                                  </p>
                                )}
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-gray-500">
                            Không có dữ liệu câu hỏi kỹ năng mềm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Logic Questions Tab Content */}
                {activeTab === "logic_questions" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Chi tiết câu trả lời logic
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          Hoàn thành: {logicStats.answered}/{logicStats.total} (
                          {logicStats.percentage}%)
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Điểm: {logicStats.totalPoints}đ
                        </div>
                      </div>
                    </div>

                    {/* Debug information */}

                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">
                        Thống kê kết quả
                      </h3>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Tổng số câu</p>
                          <p className="text-xl font-bold text-blue-600">
                            {submissions[selectedSubmissionIndex]
                              ?.logic_questions?.length || 0}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Đã trả lời</p>
                          <p className="text-xl font-bold text-green-600">
                            {submissions[
                              selectedSubmissionIndex
                            ]?.logic_questions?.filter((item) => !item.is_skip)
                              .length || 0}
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Bỏ qua</p>
                          <p className="text-xl font-bold text-red-600">
                            {submissions[
                              selectedSubmissionIndex
                            ]?.logic_questions?.filter((item) => item.is_skip)
                              .length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-medium text-lg mb-3">
                      Chi tiết câu hỏi
                    </h3>
                    <div className="space-y-6">
                      {submissions[selectedSubmissionIndex]?.logic_questions &&
                      submissions[selectedSubmissionIndex].logic_questions
                        .length > 0 ? (
                        submissions[
                          selectedSubmissionIndex
                        ].logic_questions.map((item, index) => (
                          <div
                            key={item.logic_question_id || index}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">Câu {index + 1}</h3>
                              <div className="flex items-center space-x-2">
                                {/* Score display for logic questions */}
                                {!item.is_skip && (
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded font-medium">
                                    Điểm:{" "}
                                    {item.answer !== "" &&
                                    item.logic_question?.choices &&
                                    item.logic_question.choices[
                                      parseInt(item.answer)
                                    ]?.is_correct
                                      ? 1
                                      : 0}
                                    /1
                                  </span>
                                )}
                                {item.is_skip ? (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    Bỏ qua
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                                    Đã trả lời
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="mb-4">
                              {item.logic_question?.question ||
                                "Không có nội dung câu hỏi"}
                            </p>

                            <div className="space-y-2 mb-4">
                              {item.logic_question?.choices &&
                                item.logic_question.choices.map(
                                  (choice, choiceIndex) => (
                                    <div
                                      key={choiceIndex}
                                      className={`p-3 rounded ${
                                        item.answer === choiceIndex.toString()
                                          ? choice.is_correct
                                            ? "bg-green-100 border border-green-300"
                                            : "bg-red-100 border border-red-300"
                                          : choice.is_correct
                                            ? "bg-green-100 border border-green-300"
                                            : "bg-white border border-gray-200"
                                      }`}
                                    >
                                      <div className="flex items-start">
                                        <div className="mr-2 font-medium">
                                          {String.fromCharCode(
                                            65 + choiceIndex,
                                          )}
                                          .
                                        </div>
                                        <div>{choice.text}</div>
                                      </div>
                                    </div>
                                  ),
                                )}
                            </div>

                            {!item.is_skip && item.answer !== "" && (
                              <p className="text-sm text-blue-600">
                                Đã chọn:{" "}
                                {String.fromCharCode(
                                  65 + parseInt(item.answer),
                                )}
                              </p>
                            )}

                            {item.logic_question?.answer_explanation && (
                              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                                <h4 className="font-medium mb-2">
                                  Giải thích:
                                </h4>
                                <p className="text-sm whitespace-pre-wrap">
                                  {item.logic_question.answer_explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-gray-500">
                            Không có dữ liệu câu hỏi logic
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Essay Tab Content */}
                {activeTab === "essay" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Câu hỏi tự luận</h2>
                      {submission?.essay && !submission?.essay.is_skip && (
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Điểm: {submission.essay.answer ? 1 : 0}/1
                        </div>
                      )}
                    </div>
                    <div className="p-5 rounded-lg border bg-white border-gray-200">
                      <p className="font-medium text-lg mb-3">
                        {submission?.essay?.question ||
                          "Không có câu hỏi tự luận"}
                      </p>

                      {submission?.essay?.is_skip ? (
                        <p className="text-gray-600 italic">
                          Ứng viên đã bỏ qua câu hỏi này
                        </p>
                      ) : submission?.essay?.answer ? (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                          {submission?.essay.answer}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">
                          Ứng viên chưa trả lời câu hỏi này
                        </p>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-2">
                        Nhận xét của người phỏng vấn và nguyện vọng của ứng viên
                      </h3>
                      {submission?.review ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p>
                            {submission.review.comment || "Chưa có nhận xét"}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-600 italic">
                            Chưa có nhận xét
                          </p>
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

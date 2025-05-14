import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Services
import questionService from "@/services/questionService";
import candidateService from "@/services/candidateService";

// Types
import { Topic } from "@/types/candidate";
import { Question } from "@/types/question";

import EditQuestionModal from "@/components/modals/EditQuestionModal";
import { Select } from "@/components/ui";
import { TYPES } from "@/constants/candidate";
import instrumentService from "@/services/instrumentService";
import logicService from "@/services/logicService";
import { ApiResponse } from "@/types/common";
import { Answer } from "@/types/candidate";
import EditQuestLogic from "@/components/modals/EditQuestLogic";
import EditQuestInstruments from "@/components/modals/EditQuestInstruments";
import { useQuestion } from "@/hooks/useQuestion";
import Head from "next/head";

export default function QuestionsList() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    editQuestion,
    showEditModal,
    setShowEditModal,
    handleEditQuestion,
    deleteQuestion,
    deleteQuestionInstriment,
    deleteQuestionLogic,
  } = useQuestion();
  const handleDeleteQuestion = (questionId: string) => {
    switch (filters.type) {
      case TYPES[0].value:
        deleteQuestion(questionId);
        break;
      case TYPES[1].value:
        deleteQuestionInstriment(questionId);
        break;
      case TYPES[2].value:
        deleteQuestionLogic(questionId);
        break;
    }
    if (currentPage > 1 && questions.length === 1) {
      setCurrentPage((prev) => prev - 1);
    }
    if (questions.length > 1 || currentPage === 1) {
      fetchQuestions();
    }
  };

  const handlerChangeQuestion = (data: Question) => {
    setShowEditModal(false);
    setQuestions((prev) => prev.map((q) => (q._id === data._id ? data : q)));
  };
  // Filters
  const [filters, setFilters] = useState({
    type: TYPES[0].value,
    topic: "",
    language: "JavaScript",
    position: "junior",
    sort_by: "createdAt",
    sort_direction: "desc",
    mode: "full",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "MCQ",
    language: "JavaScript",
    level: "junior",
    topic: "",
    options: [
      { id: "a", text: "", correct: false },
      { id: "b", text: "", correct: false },
      { id: "c", text: "", correct: false },
      { id: "d", text: "", correct: false },
    ],
  });

  // Check if user is authenticated
  useEffect(() => {
    // Use try-catch to handle localStorage errors in SSR
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
      } else {
        // Fetch topics when component mounts
        console.log("Calling fetchTopics from useEffect");
        fetchTopics();
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [router]);

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      console.log("Fetching topics...");

      // Try to get topics from API
      const response = await candidateService.getTopics();
      console.log("Topics API response:", response);

      if (response.data && response.data.length > 0) {
        console.log("Setting topics from API:", response.data);
        setTopics(response.data);

        // Set the first topic as default
        const firstTopic = response.data[0].title;
        console.log("Setting first topic as default:", firstTopic);

        setFilters((prev) => ({
          ...prev,
          topic: firstTopic,
        }));

        setNewQuestion((prev) => ({
          ...prev,
          topic: firstTopic,
        }));
      } else {
        console.log("API returned no topics, using fallback data");

        // Fallback: Use hardcoded topics if API fails
        const fallbackTopics: Topic[] = [
          {
            title: "JavaScript Basics",
            difficulty: 1,
            popularity: "high",
            suitable_level: "junior",
            description: "Basic JavaScript concepts",
          },
          {
            title: "React",
            difficulty: 2,
            popularity: "high",
            suitable_level: "middle",
            description: "React framework",
          },
          {
            title: "Node.js",
            difficulty: 2,
            popularity: "high",
            suitable_level: "middle",
            description: "Node.js runtime",
          },
          {
            title: "TypeScript",
            difficulty: 3,
            popularity: "medium",
            suitable_level: "senior",
            description: "TypeScript language",
          },
          {
            title: "Data Structures",
            difficulty: 3,
            popularity: "medium",
            suitable_level: "senior",
            description: "Common data structures",
          },
        ];

        console.log("Setting fallback topics:", fallbackTopics);
        setTopics(fallbackTopics);

        // Set the first fallback topic as default
        const firstTopic = fallbackTopics[0].title;
        setFilters((prev) => ({
          ...prev,
          topic: firstTopic,
        }));

        setNewQuestion((prev) => ({
          ...prev,
          topic: firstTopic,
        }));
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to load topics. Please try again.");

      // Fallback: Use hardcoded topics if API fails
      const fallbackTopics: Topic[] = [
        {
          title: "JavaScript Basics",
          difficulty: 1,
          popularity: "high",
          suitable_level: "junior",
          description: "Basic JavaScript concepts",
        },
        {
          title: "React",
          difficulty: 2,
          popularity: "high",
          suitable_level: "middle",
          description: "React framework",
        },
        {
          title: "Node.js",
          difficulty: 2,
          popularity: "high",
          suitable_level: "middle",
          description: "Node.js runtime",
        },
        {
          title: "TypeScript",
          difficulty: 3,
          popularity: "medium",
          suitable_level: "senior",
          description: "TypeScript language",
        },
        {
          title: "Data Structures",
          difficulty: 3,
          popularity: "medium",
          suitable_level: "senior",
          description: "Common data structures",
        },
      ];

      console.log("Setting fallback topics after error:", fallbackTopics);
      setTopics(fallbackTopics);

      // Set the first fallback topic as default
      const firstTopic = fallbackTopics[0].title;
      setFilters((prev) => ({
        ...prev,
        topic: firstTopic,
      }));

      setNewQuestion((prev) => ({
        ...prev,
        topic: firstTopic,
      }));
    }
  };

  // Fetch questions from API
  const fetchQuestions = async () => {
    if (!filters.topic) return;

    setLoading(true);
    try {
      let response: ApiResponse<Answer[]> | null = null;
      if (filters.type === TYPES[0].value) {
        response = await questionService.searchQuestions({
          topic: filters.topic,
          language: filters.language,
          position: filters.position,
          page: currentPage,
          page_size: itemsPerPage,
          mode: filters.mode,
          sort_by: filters.sort_by,
          sort_direction: filters.sort_direction,
        });
      }
      if (filters.type === TYPES[1].value) {
        response = await instrumentService.get({
          page: currentPage,
          page_size: itemsPerPage,
          mode: filters.mode,
          sort_by: filters.sort_by,
          sort_direction: filters.sort_direction,
        });
      }
      if (filters.type === TYPES[2].value) {
        response = await logicService.get({
          page: currentPage,
          page_size: itemsPerPage,
          mode: filters.mode,
          sort_by: filters.sort_by,
          sort_direction: filters.sort_direction,
        });
      }
      console.log("API response:", response);

      // Kiểm tra cả hai trường hợp: response.success || response.status === "success") hoặc response.status === "success"
      if (response?.data) {
        // Transform API response to match our UI needs
        const formattedQuestions = response.data.map(
          (q: Partial<Question>) => ({
            ...q,
            _id: q._id || "", // Ensure _id is always a string
            // Không cần map 'question' field vì chúng ta đã sử dụng trực tiếp trong UI
            type: q.options && q.options.length > 0 ? "MCQ" : "Essay",
            typeFe: q.type,
            level: q.position || "", // Map position to level for UI compatibility
            levelFe: q.level,
          }),
        ) as Question[];

        console.log("Formatted questions:", formattedQuestions);
        setQuestions(formattedQuestions);

        // Set pagination data
        if (response.pagination) {
          console.log("Pagination data:", response.pagination);
          setTotalQuestions(response.pagination.total);
          setTotalPages(response.pagination.total_pages || 1);
        } else {
          // Nếu không có thông tin phân trang, tính toán dựa trên số lượng câu hỏi
          const calculatedTotalPages = Math.ceil(
            formattedQuestions.length / itemsPerPage,
          );
          console.log("Calculated total pages:", calculatedTotalPages);
          setTotalQuestions(formattedQuestions.length);
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        }

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
      setLoading(false);
    }
  };

  // Fetch questions when filters or pagination changes
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage, itemsPerPage]);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  // Handle new question form change
  const handleNewQuestionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle option change
  const handleOptionChange = (
    optionId: string,
    field: "text" | "correct",
    value: string | boolean,
  ) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId ? { ...option, [field]: value } : option,
      ),
    }));
  };

  // Handle add question
  const handleAddQuestion = async () => {
    // Validate form
    if (!newQuestion.question) {
      alert("Vui lòng nhập câu hỏi");
      return;
    }

    if (newQuestion.type === "MCQ") {
      // Check if all options have text
      const emptyOption = newQuestion.options.find((option) => !option.text);
      if (emptyOption) {
        alert("Vui lòng nhập đầy đủ các lựa chọn");
        return;
      }

      // Check if at least one option is marked as correct
      const hasCorrectOption = newQuestion.options.some(
        (option) => option.correct,
      );
      if (!hasCorrectOption) {
        alert("Vui lòng chọn ít nhất một đáp án đúng");
        return;
      }
    }

    try {
      // Get the index of the correct answer
      const correctAnswerIndex = newQuestion.options.findIndex(
        (opt) => opt.correct,
      );

      // Call the API to add the question
      const response = await questionService.addQuestion({
        content: newQuestion.question,
        topic: newQuestion.topic,
        language: newQuestion.language,
        position: newQuestion.level.toLowerCase(), // Convert level to position
        options: newQuestion.options.map((opt) => opt.text),
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      });

      if (response.success) {
        alert("Thêm câu hỏi thành công!");
        setShowAddModal(false);
        fetchQuestions(); // Refresh the question list
      } else {
        alert(
          "Lỗi khi thêm câu hỏi: " + (response.message || "Vui lòng thử lại"),
        );
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert(`Đã xảy ra lỗi khi thêm câu hỏi: ${error}`);
    }
  };

  // Pagination handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Head>
        <title>Quizo Admin | Quản lý câu hỏi</title>
        <meta name="description" content="Danh sách câu hỏi" />
      </Head>
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
                onClick={handleLogout}
                className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Quản lý câu hỏi</h1>
              <div className="flex gap-2"></div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div>
                <Select
                  name="type"
                  label="Kỹ năng phỏng vấn"
                  value={filters.type}
                  onChange={handleFilterChange}
                  options={TYPES}
                />
              </div>

              <div
                className={
                  filters.type !== TYPES[0].value
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <label className="block text-sm font-medium mb-2">
                  Ngôn ngữ
                </label>
                <select
                  name="language"
                  className="w-full p-2 border rounded"
                  value={filters.language}
                  onChange={handleFilterChange}
                  disabled={filters.type !== TYPES[0].value}
                >
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="C#">C#</option>
                  <option value="C++">C++</option>
                  <option value="C">C</option>
                  <option value="Golang">Golang</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="PHP">PHP</option>
                  <option value="Kotlin">Kotlin</option>
                  <option value="Swift">Swift</option>
                  <option value="Rust">Rust</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Dart">Dart</option>
                  <option value="SQL">SQL</option>
                  <option value="Shell">Shell (Bash)</option>
                  <option value="R">R </option>
                  <option value="Scala">Scala</option>
                </select>
              </div>

              <div
                className={
                  filters.type !== TYPES[0].value
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <label className="block text-sm font-medium mb-2">Cấp độ</label>
                <select
                  name="position"
                  className="w-full p-2 border rounded"
                  value={filters.position}
                  onChange={handleFilterChange}
                  disabled={filters.type !== TYPES[0].value}
                >
                  <option value="intern">Intern</option>
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div
                className={
                  filters.type !== TYPES[0].value
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <label className="block text-sm font-medium mb-2">Chủ đề</label>
                <select
                  name="topic"
                  className="w-full p-2 border rounded"
                  value={filters.topic}
                  onChange={handleFilterChange}
                  disabled={filters.type !== TYPES[0].value}
                >
                  {topics && topics.length > 0 ? (
                    topics.map((topic) => (
                      <option key={topic.title} value={topic.title}>
                        {topic.title}
                      </option>
                    ))
                  ) : (
                    <option value="">No topics available</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sắp xếp theo
                </label>
                <select
                  name="sort_by"
                  className="w-full p-2 border rounded"
                  value={filters.sort_by}
                  onChange={handleFilterChange}
                >
                  <option value="question">Câu hỏi</option>
                  <option value="category">Danh mục</option>
                  <option value="createdAt">Ngày tạo</option>
                </select>
              </div>
            </div>

            {/* Sort direction */}
            <div className="flex justify-end items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Thứ tự:</span>
                <select
                  name="sort_direction"
                  className="p-1 border rounded"
                  value={filters.sort_direction}
                  onChange={handleFilterChange}
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error message */}
            {error && !loading && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
                <button
                  onClick={fetchQuestions}
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div className="grid grid-cols-1 gap-6">
                {/* Edit Question Modal */}
                {filters?.type === TYPES[0].value && (
                  <EditQuestionModal
                    editQuestion={editQuestion}
                    showEditModal={showEditModal}
                    setShowEditModal={setShowEditModal}
                    changeQuestion={handlerChangeQuestion}
                  />
                )}
                {filters?.type === TYPES[1].value && (
                  <EditQuestInstruments
                    editQuestion={editQuestion}
                    showEditModal={showEditModal}
                    setShowEditModal={setShowEditModal}
                    changeQuestion={handlerChangeQuestion}
                  />
                )}
                {filters?.type === TYPES[2].value && (
                  <EditQuestLogic
                    editQuestion={editQuestion}
                    showEditModal={showEditModal}
                    setShowEditModal={setShowEditModal}
                    changeQuestion={handlerChangeQuestion}
                  />
                )}
                {questions.map((question) => (
                  <div
                    key={question._id}
                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {question.type == TYPES[0].value && (
                          <>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                              {question.topic}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                              {question.language}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {question.position}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                          ID: {question._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">
                      {question.question}
                    </h3>
                    <h3 className="text-lg font-semibold mb-4">
                      {question.questionText}
                    </h3>

                    {question.options && question.options.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Đáp án:
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md ${
                                index === question.correctAnswer
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                    index === question.correctAnswer
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-300 text-gray-700"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${
                                      index === question.correctAnswer
                                        ? "text-green-800 font-medium"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {option}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.choices && question.choices.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Đáp án:
                        </p>
                        <div className="space-y-2">
                          {question.choices.map((choices, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md ${
                                choices.is_correct
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                    choices.is_correct
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-300 text-gray-700"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${
                                      choices.is_correct
                                        ? "text-green-800 font-medium"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {choices.text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          Giải thích:
                        </p>
                        <p className="text-sm text-blue-700">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                    {question.answer_explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          Giải thích:
                        </p>
                        <p className="text-sm text-blue-700">
                          {question.answer_explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {questions.length === 0 && !loading && (
                  <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
                    Không có dữ liệu
                  </div>
                )}
              </div>
            )}

            {/* Pagination - Always show */}
            {!loading && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    Hiển thị{" "}
                    <span className="text-primary font-bold">
                      {questions.length}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="text-primary font-bold">
                      {totalQuestions}
                    </span>{" "}
                    câu hỏi
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <label className="text-sm text-gray-600 mr-2">
                        Số mục mỗi trang:
                      </label>
                      <select
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </div>

                    <nav aria-label="Phân trang">
                      <ul className="flex items-center">
                        <li>
                          <button
                            onClick={() =>
                              paginate(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-9 h-9 rounded-l-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Trang trước"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                              />
                            </svg>
                          </button>
                        </li>

                        {/* Show limited page numbers with ellipsis for large page counts */}
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            // For many pages, show first, last, current and neighbors
                            let pageNum;
                            if (totalPages <= 5) {
                              // Show all pages if 5 or fewer
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              // Near start
                              pageNum = i + 1;
                              if (i === 4) pageNum = totalPages;
                            } else if (currentPage >= totalPages - 2) {
                              // Near end
                              if (i === 0) pageNum = 1;
                              else pageNum = totalPages - (4 - i);
                            } else {
                              // Middle
                              if (i === 0) pageNum = 1;
                              else if (i === 4) pageNum = totalPages;
                              else pageNum = currentPage + (i - 2);
                            }

                            // Add ellipsis
                            if (
                              (i === 1 && pageNum !== 2) ||
                              (i === 3 && pageNum !== totalPages - 1)
                            ) {
                              return (
                                <li key={`ellipsis-${i}`}>
                                  <span className="flex items-center justify-center w-9 h-9 border-t border-b">
                                    ...
                                  </span>
                                </li>
                              );
                            }

                            return (
                              <li key={pageNum}>
                                <button
                                  onClick={() => paginate(pageNum)}
                                  className={`flex items-center justify-center w-9 h-9 border-t border-b hover:bg-gray-50 ${
                                    currentPage === pageNum
                                      ? "bg-primary text-white hover:bg-primary-dark"
                                      : "text-gray-700"
                                  }`}
                                  aria-label={`Trang ${pageNum}`}
                                  aria-current={
                                    currentPage === pageNum ? "page" : undefined
                                  }
                                >
                                  {pageNum}
                                </button>
                              </li>
                            );
                          },
                        )}

                        <li>
                          <button
                            onClick={() =>
                              paginate(Math.min(totalPages, currentPage + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-9 h-9 rounded-r-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Trang sau"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                              />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Question Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Thêm câu hỏi mới</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Câu hỏi
                  </label>
                  <textarea
                    name="question"
                    rows={3}
                    className="w-full p-2 border rounded"
                    value={newQuestion.question}
                    onChange={handleNewQuestionChange}
                    placeholder="Nhập câu hỏi..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Chủ đề
                    </label>
                    <select
                      name="topic"
                      className="w-full p-2 border rounded"
                      value={newQuestion.topic}
                      onChange={handleNewQuestionChange}
                    >
                      {topics.map((topic) => (
                        <option key={topic.title} value={topic.title}>
                          {topic.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Loại câu hỏi
                    </label>
                    <select
                      name="type"
                      className="w-full p-2 border rounded"
                      value={newQuestion.type}
                      onChange={handleNewQuestionChange}
                    >
                      <option value="MCQ">Trắc nghiệm</option>
                      <option value="Essay">Tự luận</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ngôn ngữ
                    </label>
                    <select
                      name="language"
                      className="w-full p-2 border rounded"
                      value={newQuestion.language}
                      onChange={handleNewQuestionChange}
                    >
                      <option value="Python">
                        Python - Dễ học, dùng trong AI, web, data science
                      </option>
                      <option value="JavaScript">
                        JavaScript - Chủ yếu cho web front-end, back-end
                        (Node.js)
                      </option>
                      <option value="Java">
                        Java - Ứng dụng doanh nghiệp, Android
                      </option>
                      <option value="C#">
                        C# - Web (ASP.NET), game (Unity)
                      </option>
                      <option value="C++">
                        C++ - Game, hệ thống nhúng, phần mềm hiệu năng cao
                      </option>
                      <option value="C">
                        C - Hệ điều hành, nhúng, hệ thống
                      </option>
                      <option value="Golang">
                        Golang - Cloud, server-side, microservices
                      </option>
                      <option value="TypeScript">
                        TypeScript - JavaScript có kiểm tra kiểu, phổ biến trong
                        web
                      </option>
                      <option value="PHP">
                        PHP - Web server-side (WordPress, Laravel)
                      </option>
                      <option value="Kotlin">
                        Kotlin - Android development thay thế Java
                      </option>
                      <option value="Swift">
                        Swift - Phát triển ứng dụng iOS, macOS
                      </option>
                      <option value="Rust">
                        Rust - Hệ thống hiệu suất cao, thay thế C++
                      </option>
                      <option value="Ruby">
                        Ruby - Web development (Ruby on Rails)
                      </option>
                      <option value="Dart">
                        Dart - App đa nền tảng (Flutter)
                      </option>
                      <option value="SQL">
                        SQL - Ngôn ngữ truy vấn cơ sở dữ liệu
                      </option>
                      <option value="Shell">
                        Shell (Bash) - Scripting cho Linux/Unix
                      </option>
                      <option value="R">R - Thống kê, phân tích dữ liệu</option>
                      <option value="Scala">
                        Scala - Big Data (Apache Spark), backend
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cấp độ
                    </label>
                    <select
                      name="level"
                      className="w-full p-2 border rounded"
                      value={newQuestion.level}
                      onChange={handleNewQuestionChange}
                    >
                      <option value="intern">Intern</option>
                      <option value="fresher">Fresher</option>
                      <option value="junior">Junior</option>
                      <option value="middle">Middle</option>
                      <option value="senior">Senior</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                {newQuestion.type === "MCQ" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Các lựa chọn
                    </label>
                    <div className="space-y-3">
                      {newQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            name="correctOption"
                            checked={option.correct}
                            onChange={() => {
                              // Set this option as correct and others as incorrect
                              newQuestion.options.forEach((opt) => {
                                handleOptionChange(
                                  opt.id,
                                  "correct",
                                  opt.id === option.id,
                                );
                              });
                            }}
                            className="w-4 h-4"
                          />
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(
                                option.id,
                                "text",
                                e.target.value,
                              )
                            }
                            placeholder={`Lựa chọn ${option.id.toUpperCase()}`}
                            className="flex-1 p-2 border rounded"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Chọn radio button bên cạnh đáp án đúng
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-gradient-to-r from-primary-light to-primary text-white rounded hover:opacity-90"
                  >
                    Thêm câu hỏi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

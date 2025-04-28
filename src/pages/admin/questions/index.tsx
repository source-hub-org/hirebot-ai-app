import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Mock data
const mockQuestions = [
  {
    id: 1,
    question: "JavaScript là ngôn ngữ lập trình thuộc loại nào?",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "Compiled Language" },
      { id: "b", text: "Interpreted Language", correct: true },
      { id: "c", text: "Both Compiled & Interpreted" },
      { id: "d", text: "Neither Compiled nor Interpreted" },
    ],
  },
  {
    id: 2,
    question: "Đâu KHÔNG phải là kiểu dữ liệu nguyên thủy trong JavaScript?",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "String" },
      { id: "b", text: "Number" },
      { id: "c", text: "Object", correct: true },
      { id: "d", text: "Boolean" },
    ],
  },
  {
    id: 3,
    question:
      "Giải thích cách hoạt động của Event Loop trong JavaScript và vai trò của nó trong mô hình bất đồng bộ.",
    type: "Essay",
    language: "JavaScript",
    level: "Senior",
  },
  {
    id: 4,
    question:
      "Phân biệt giữa shallow copy và deep copy trong Python. Cung cấp ví dụ minh họa.",
    type: "Essay",
    language: "Python",
    level: "Middle",
  },
  {
    id: 5,
    question:
      "Trong Python, phương thức nào được sử dụng để sao chép một list?",
    type: "MCQ",
    language: "Python",
    level: "Junior",
    options: [
      { id: "a", text: "copy()" },
      { id: "b", text: "clone()" },
      { id: "c", text: "duplicate()" },
      { id: "d", text: "replicate()" },
    ],
  },
];

export default function QuestionsList() {
  const router = useRouter();
  const [questions, setQuestions] = useState(mockQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    type: "",
    language: "",
    level: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "MCQ",
    language: "JavaScript",
    level: "Junior",
    options: [
      { id: "a", text: "", correct: false },
      { id: "b", text: "", correct: false },
      { id: "c", text: "", correct: false },
      { id: "d", text: "", correct: false },
    ],
  });

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  // Apply filters
  useEffect(() => {
    let result = [...questions];

    if (filters.type) {
      result = result.filter((question) => question.type === filters.type);
    }

    if (filters.language) {
      result = result.filter(
        (question) => question.language === filters.language,
      );
    }

    if (filters.level) {
      result = result.filter((question) => question.level === filters.level);
    }

    setFilteredQuestions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, questions]);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  const handleAddQuestion = () => {
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

    // Add new question
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    const questionToAdd = {
      ...newQuestion,
      id: newId,
    };

    setQuestions((prev) => [...prev, questionToAdd]);

    // Reset form and close modal
    setNewQuestion({
      question: "",
      type: "MCQ",
      language: "JavaScript",
      level: "Junior",
      options: [
        { id: "a", text: "", correct: false },
        { id: "b", text: "", correct: false },
        { id: "c", text: "", correct: false },
        { id: "d", text: "", correct: false },
      ],
    });
    setShowAddModal(false);
  };

  // Handle delete question
  const handleDeleteQuestion = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      setQuestions((prev) => prev.filter((question) => question.id !== id));
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
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
            <Link href="/admin/sessions/new">
              <span className="hover:underline">Tạo phiên thi</span>
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-primary-light to-primary text-white px-4 py-2 rounded hover:opacity-90"
              >
                Thêm câu hỏi
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:opacity-90">
                Import CSV
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-90">
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Loại câu hỏi
              </label>
              <select
                name="type"
                className="w-full p-2 border rounded"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="MCQ">Trắc nghiệm</option>
                <option value="Essay">Tự luận</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
              <select
                name="language"
                className="w-full p-2 border rounded"
                value={filters.language}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cấp độ</label>
              <select
                name="level"
                className="w-full p-2 border rounded"
                value={filters.level}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Câu hỏi</th>
                  <th className="py-3 px-4 text-left">Loại</th>
                  <th className="py-3 px-4 text-left">Ngôn ngữ</th>
                  <th className="py-3 px-4 text-left">Cấp độ</th>
                  <th className="py-3 px-4 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((question) => (
                  <tr key={question.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{question.id}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-md truncate">
                        {question.question}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                          question.type === "MCQ"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                        }`}
                      >
                        {question.type === "MCQ" ? "Trắc nghiệm" : "Tự luận"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{question.language}</td>
                    <td className="py-3 px-4">{question.level}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:underline">
                          Sửa
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex">
                  <li>
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-l hover:bg-gray-100 disabled:opacity-50"
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <li key={number}>
                        <button
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 border-t border-b hover:bg-gray-100 ${
                            currentPage === number
                              ? "bg-primary text-white"
                              : ""
                          }`}
                        >
                          {number}
                        </button>
                      </li>
                    ),
                  )}
                  <li>
                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-r hover:bg-gray-100 disabled:opacity-50"
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
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

              <div className="grid grid-cols-3 gap-4">
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
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C#">C#</option>
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
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
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
                      <div key={option.id} className="flex items-center gap-3">
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
  );
}

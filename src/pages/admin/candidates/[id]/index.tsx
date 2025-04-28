import React from "react";
import { useRouter } from "next/router";

export default function CandidateDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Mock data - would be fetched from API in real implementation
  const candidateResult = {
    id: id,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    language: "JavaScript",
    level: "Senior",
    date: "2023-10-15",
    mcqScore: 85,
    essayScore: 90,
    totalScore: 87,
    status: "PASS",
    feedback:
      "Ứng viên có kiến thức tốt về JavaScript, hiểu rõ về async/await và closure. Cần cải thiện thêm về performance optimization.",
    answers: [
      {
        question: "JavaScript là ngôn ngữ lập trình gì?",
        answer: "Interpreted",
        correct: true,
      },
      {
        question: "Sự khác biệt giữa let và var?",
        answer: "Block scope vs function scope",
        correct: true,
      },
      {
        question: "Closure trong JS là gì?",
        answer: "Function có thể truy cập biến bên ngoài scope của nó",
        correct: true,
      },
      {
        question: "Promise là gì?",
        answer:
          "Đối tượng đại diện cho giá trị có thể có hoặc không có ở tương lai",
        correct: true,
      },
      {
        question: "Event loop hoạt động thế nào?",
        answer: "Sai",
        correct: false,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Chi tiết kết quả: {candidateResult.name}
        </h1>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Xuất PDF
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Xuất CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{candidateResult.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Ngày thi:</p>
            <p className="font-medium">{candidateResult.date}</p>
          </div>
          <div>
            <p className="text-gray-600">Ngôn ngữ:</p>
            <p className="font-medium">{candidateResult.language}</p>
          </div>
          <div>
            <p className="text-gray-600">Cấp độ:</p>
            <p className="font-medium">{candidateResult.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600">Điểm MCQ:</p>
            <p className="text-2xl font-bold">{candidateResult.mcqScore}/100</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-gray-600">Điểm Essay:</p>
            <p className="text-2xl font-bold">
              {candidateResult.essayScore}/100
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-gray-600">Tổng điểm:</p>
            <p className="text-2xl font-bold">
              {candidateResult.totalScore}/100
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div
            className={`inline-block px-3 py-1 rounded-full text-white ${
              candidateResult.status === "PASS" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {candidateResult.status}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nhận xét</h2>
          <p className="bg-gray-50 p-4 rounded">{candidateResult.feedback}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Chi tiết câu trả lời</h2>
          <div className="space-y-4">
            {candidateResult.answers.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded ${item.correct ? "bg-green-50" : "bg-red-50"}`}
              >
                <p className="font-medium">
                  {index + 1}. {item.question}
                </p>
                <p className="text-gray-700">Trả lời: {item.answer}</p>
                <p className={item.correct ? "text-green-600" : "text-red-600"}>
                  {item.correct ? "Đúng" : "Sai"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { TYPES } from "@/constants/candidate";
import { Answer, Chose } from "@/types/candidate";
import React from "react";
import { Session } from "@/types/session";

interface Option {
  id?: string;
  text: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  questions: Answer[];
  sessionQuestion: Session | undefined;
}

const QuestionsByTopicModal: React.FC<Props> = ({
  open,
  onClose,
  questions,
  sessionQuestion,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full relative max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="w-[35px] text-[40px] h-[35px] absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">
          Danh sách câu hỏi -{" "}
          {TYPES.find((type) => type.value === sessionQuestion?.type)?.label}
        </h2>
        {sessionQuestion?.type === TYPES[0].value && (
          <>
            <p>
              <span className="font-medium">Ngôn ngữ:</span>{" "}
              {sessionQuestion?.language}
            </p>
            <p>
              <span className="font-medium">Cấp độ:</span>{" "}
              {sessionQuestion.position}
            </p>
            <p>
              <span className="font-medium">Chủ đề:</span>{" "}
              {sessionQuestion.topic}
            </p>
          </>
        )}
        <p>
          <span className="font-medium">Số câu hỏi:</span>{" "}
          {sessionQuestion?.questionCount}
        </p>
        <p>
          <span className="font-medium">Thời gian tạo:</span>{" "}
          {new Date(sessionQuestion?.createdAt || "").toLocaleString()}
        </p>
        {questions.length === 0 && (
          <div>Không có câu hỏi nào cho chủ đề này.</div>
        )}
        {questions.map((q, idx) => (
          <div key={q._id} className="mb-6 p-4 border rounded">
            {q.question && (
              <div className="font-semibold mb-2">
                {idx + 1}. {q.question}
              </div>
            )}
            {q.questionText && (
              <div className="font-semibold mb-2">
                {idx + 1}. {q.questionText}
              </div>
            )}
            {q.options && q.options.length > 0 && (
              <div className="mb-2">
                <div className="font-medium text-sm mb-1">Đáp án:</div>
                <ul className="space-y-1">
                  {(q.options as (string | Option)[]).map((opt, i) => (
                    <li
                      key={i}
                      className={
                        i === q.correctAnswer
                          ? "font-bold text-green-700"
                          : "text-gray-700"
                      }
                    >
                      <span
                        className={
                          i === q.correctAnswer
                            ? "inline-block w-6 text-center text-white bg-green-500 rounded mr-2"
                            : "inline-block w-6 text-center text-gray-600 bg-gray-200 rounded mr-2"
                        }
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {typeof opt === "string" ? opt : opt.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {q.choices && q.choices.length > 0 && (
              <div className="mb-2">
                <div className="font-medium text-sm mb-1">Đáp án:</div>
                <ul className="space-y-1">
                  {(q.choices as Chose[]).map((opt, i) => (
                    <li
                      key={i}
                      className={
                        opt.is_correct
                          ? "font-bold text-green-700"
                          : "text-gray-700"
                      }
                    >
                      <span
                        className={
                          opt.is_correct
                            ? "inline-block w-6 text-center text-white bg-green-500 rounded mr-2"
                            : "inline-block w-6 text-center text-gray-600 bg-gray-200 rounded mr-2"
                        }
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {typeof opt === "string" ? opt : opt.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {q.explanation && (
              <div className="bg-blue-50 border border-blue-100 rounded p-2 mt-2 text-blue-700 text-sm">
                <span className="font-medium">Gợi ý:</span> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsByTopicModal;

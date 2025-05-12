import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface Option {
  id: string;
  text: string;
  correct: boolean;
}

interface EditQuestion {
  _id?: string;
  question: string;
  options: Option[];
  explanation?: string;
  [key: string]: any;
}

interface EditQuestionModalProps {
  editQuestion: EditQuestion;
  setEditQuestion: (q: EditQuestion | null) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  editQuestion,
  setEditQuestion,
  showEditModal,
  setShowEditModal,
}) => {
  const [localQuestion, setLocalQuestion] = React.useState<EditQuestion | null>(null);
  const [forceValidate, setForceValidate] = useState(false);
  React.useEffect(() => {
    if (showEditModal && editQuestion) {
      setLocalQuestion({
        ...editQuestion,
        options: (editQuestion.options || []).map((option: Option, idx: number) => ({
          id: String.fromCharCode(97 + idx),
          text: option.text,
          correct: idx === (typeof editQuestion.correctAnswer === 'number' ? editQuestion.correctAnswer : -1),
        })),
        level: editQuestion.position || "junior",
        type: editQuestion.options && editQuestion.options.length > 0 ? "MCQ" : "Essay",
      });
    }
  }, [showEditModal, editQuestion]);

  if (!showEditModal || !localQuestion) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalQuestion(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleOptionChange = (
    optionId: string,
    field: "text" | "correct",
    value: string | boolean
  ) => {
    setLocalQuestion(prev => prev ? {
      ...prev,
      options: prev.options.map(option => {
        if (option.id === optionId) {
          if (field === "correct" && value === true) {
            // Đảm bảo chỉ có 1 đáp án đúng
            return { ...option, correct: true };
          }
          return { ...option, [field]: value };
        }
        // Nếu chọn đáp án đúng, các option khác phải false
        if (field === "correct" && value === true) return { ...option, correct: false };
        return option;
      })
    } : prev);
  };

  const handleSave = () => {
    if (!localQuestion.question) {
      alert('Vui lòng nhập câu hỏi');
      return;
    }
    if (localQuestion.options && localQuestion.options.length > 0) {
      const emptyOption = localQuestion.options.find(option => !option.text);
      if (emptyOption) {
        alert('Vui lòng nhập đầy đủ các lựa chọn');
        return;
      }
      const correctIdx = localQuestion.options.findIndex(option => option.correct);
      if (correctIdx === -1) {
        alert('Vui lòng chọn ít nhất một đáp án đúng');
        return;
      }
    }
    // Log ra thông tin đã sửa
    console.log('EDITED QUESTION:', localQuestion);
    setEditQuestion(localQuestion);
    setShowEditModal(false);
  };

  if (!showEditModal || !editQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
        <h2 className="text-xl font-bold mb-4">Sửa câu hỏi</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
          <Textarea
            name="question"
            value={localQuestion.question}
            rules={["required"]}
            context={{ title: `Nội dung câu hỏi` }}
            placeholder={`Nội dung câu hỏi`}
            forceValidate={forceValidate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Các lựa chọn</label>
          {localQuestion.options.map((option, idx) => (
            <div key={option.id} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={option.correct}
                onChange={() => handleOptionChange(option.id, "correct", true)}
                className="mr-2"
              />
              <Input
                name="phone_number"
                value={option.text || ""}
                onChange={e => handleOptionChange(option.id, "text", e.target.value)}
                rules={["required"]}
                context={{ title: `Lựa chọn ${String.fromCharCode(65 + idx)}` }}
                placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                forceValidate={forceValidate}
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <Textarea
            name="explanation"
            value={localQuestion.explanation || ""}
            context={{ title: `Giải thích (nếu có)` }}
            placeholder={`Giải thích (nếu có)`}
            forceValidate={forceValidate}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setShowEditModal(false)}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;

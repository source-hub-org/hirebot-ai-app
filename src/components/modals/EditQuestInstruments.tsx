import React, { useRef } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { toast } from "react-toastify";
import { Question, Tag } from "@/types/question";
import instrumentService from "@/services/instrumentService";

interface Option {
  id: string;
  text: string;
  correct: boolean;
}

interface EditQuestion extends Question {
  answers: Option[];
}

interface EditQuestionModalProps {
  editQuestion: Question | null;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  changeQuestion: (data: Question) => void;
}

const EditQuestInstruments: React.FC<EditQuestionModalProps> = ({
  editQuestion,
  showEditModal,
  setShowEditModal,
  changeQuestion,
}) => {
  const [localQuestion, setLocalQuestion] = React.useState<EditQuestion | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (showEditModal && editQuestion) {
      const options = (editQuestion.options || []).map(
        (option: string, idx: number) => ({
          id: String.fromCharCode(97 + idx),
          text: option,
          correct: idx === editQuestion.correctAnswer,
        }),
      );
      setLocalQuestion({
        ...editQuestion,
        answers: options,
        level: editQuestion.position || "junior",
        type:
          editQuestion.options && editQuestion.options.length > 0
            ? "MCQ"
            : "Essay",
      });
    }
  }, [showEditModal, editQuestion]);

  if (!showEditModal || !localQuestion) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setLocalQuestion((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleOptionChange = (
    optionId: string,
    field: "text" | "correct",
    value: string | boolean,
  ) => {
    setLocalQuestion((prev) =>
      prev
        ? {
            ...prev,
            answers: prev.answers.map((option) => {
              if (option.id === optionId) {
                if (field === "correct" && value === true) {
                  // Đảm bảo chỉ có 1 đáp án đúng
                  return { ...option, correct: true };
                }
                return { ...option, [field]: value };
              }
              // Nếu chọn đáp án đúng, các option khác phải false
              if (field === "correct" && value === true)
                return { ...option, correct: false };
              return option;
            }),
          }
        : prev,
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for error messages
    const errorElements = formRef.current.querySelectorAll(
      ".text-red-500.text-xs.mt-1",
    );
    const hasErrors = Array.from(errorElements).some((el) => {
      return el.textContent && el.textContent.trim() !== "";
    });

    if (hasErrors) return;
    updateInstruments();
  };

  const updateInstruments = async () => {
    const updatedQuestion = {
      ...editQuestion,
      options: localQuestion.answers.map((option) => option.text),
      questionText: localQuestion.questionText,
      type: editQuestion?.typeFe,
      tags: editQuestion?.tags
        ?.map((tag: Tag) => tag._id)
        .filter((id): id is string => typeof id === "string"),
      _id: editQuestion?._id ?? "",
    };
    await instrumentService
      .update(updatedQuestion)
      .then((res) => {
        toast.success(res?.message ?? "Cập nhật thành công!");
        setShowEditModal(false);
        changeQuestion({ ...updatedQuestion, tags: editQuestion?.tags });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message || "Cập nhật không thành công!",
        );
      });
  };

  if (!showEditModal || !editQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full relative">
        <h2 className="text-xl font-bold mb-4">Sửa câu hỏi</h2>
        <form ref={formRef} onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Nội dung câu hỏi
            </label>
            <Textarea
              name="questionText"
              value={localQuestion?.questionText || ""}
              rules={["required"]}
              context={{ title: `Nội dung câu hỏi` }}
              placeholder={`Nội dung câu hỏi`}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Các lựa chọn
            </label>
            {localQuestion.answers.map((option, idx) => (
              <div key={option.id} className="flex items-center gap-2 mb-2">
                <Input
                  name="phone_number"
                  value={option.text || ""}
                  onChange={(e) =>
                    handleOptionChange(option.id, "text", e.target.value)
                  }
                  rules={["required"]}
                  context={{
                    title: `Lựa chọn ${String.fromCharCode(65 + idx)}`,
                  }}
                  placeholder={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                  classNameBox="w-full"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setShowEditModal(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestInstruments;

import React from "react";

interface QuizOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * QuizOption - Thành phần hiển thị lựa chọn trong câu hỏi trắc nghiệm
 *
 * Hiển thị một lựa chọn với radio button tùy chỉnh theo theme Quizo
 * Thay đổi style khi được chọn với border màu primary
 *
 * @param id - ID của lựa chọn (a, b, c, d)
 * @param text - Nội dung văn bản của lựa chọn
 * @param isSelected - Trạng thái đã chọn hay chưa
 * @param onSelect - Hàm callback khi người dùng chọn
 */
export default function QuizOption({
  id,
  text,
  isSelected,
  onSelect,
}: QuizOptionProps) {
  return (
    <div
      className={`quiz-option ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(id)}
    >
      {/* Radio button tùy chỉnh */}
      <div className="quiz-option-radio">
        {isSelected && <div className="quiz-option-radio-checked"></div>}
      </div>
      <span>{text}</span>
    </div>
  );
}

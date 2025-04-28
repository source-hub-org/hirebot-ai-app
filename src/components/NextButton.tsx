import React from "react";

interface NextButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLastQuestion: boolean;
}

export default function NextButton({
  onClick,
  disabled,
  isLastQuestion,
}: NextButtonProps) {
  return (
    <button
      className="next-button disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {isLastQuestion ? "Nộp bài" : "Câu tiếp theo"}
    </button>
  );
}

import { useState, useEffect } from 'react';
import { Card, Input, Button, message } from 'antd';

interface InterviewQuestionProps {
  question: {
    id: number;
    content: string;
    type: 'multiple-choice' | 'open-ended';
    options?: string[];
  };
  onAnswer: (answer: string) => void;
}

export const InterviewQuestion = ({ question, onAnswer }: InterviewQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');

  const handleAnswer = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    } else if (customAnswer) {
      onAnswer(customAnswer);
    } else {
      onAnswer('SKIPPED');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question.content}</h3>
      
      {question.options && (
        <div className="grid gap-2">
          {question.options.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name={question.id.toString()}
                value={option}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Nhập câu trả lời khác..."
        value={customAnswer}
        onChange={(e) => setCustomAnswer(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          className="px-4 py-2 text-red-600 border border-red-600 rounded"
          onClick={() => onAnswer('SKIPPED')}
        >
          Bỏ qua
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded"
          onClick={handleAnswer}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

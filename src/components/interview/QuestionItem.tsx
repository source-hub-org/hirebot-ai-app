import { InterviewQuestion } from './InterviewQuestion';
import { motion } from 'framer-motion';

export const QuestionItem = ({ question, index, onAnswer, answer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-medium text-gray-800">
            Câu {index + 1}: {question.content}
          </p>
          
          <InterviewQuestion
            question={{
              ...question,
              type: question.type === 'TECHNICAL' ? 'multiple-choice' : 'open-ended',
              options: question.type === 'TECHNICAL' ? [
                'Trên 2 năm',
                '1-2 năm',
                'Dưới 1 năm'
              ] : undefined
            }}
            onAnswer={onAnswer}
          />

          {answer && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <span className="font-medium">Đáp án:</span> {answer}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

import type { Question } from '@/models/interview';

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    questionText: 'Đánh giá kỹ năng technical của ứng viên?',
    options: [
      { id: 'opt1', text: 'Trên mong đợi' },
      { id: 'opt2', text: 'Đạt yêu cầu' },
      { id: 'opt3', text: 'Cần cải thiện' }
    ],
    allowCustomAnswer: true,
    isRequired: true
  }
];

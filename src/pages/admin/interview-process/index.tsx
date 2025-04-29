"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Select } from '@/components/ui';
import { InterviewQuestion } from '@/components/interview/InterviewQuestion';
import { QuestionItem } from '@/components/interview/QuestionItem';
import type { Question as InterviewQuestionType } from '@/models/interview';
import CreateCandidateModal from '@/components/modals/CreateCandidateModal';
import { fetchSessionDetails } from '@/services/sessionService';
import { toast } from 'react-toastify';
import { useSessionForm } from "@/hooks/useSessionForm";
import { useCandidates } from "@/hooks/useCandidates";

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  level: string;
  skills: string[];
  experience: number;
  resumeUrl: string;
}

interface InterviewQuestionDetails {
  id: number;
  content: string;
  type: string;
  difficulty: string;
  topic: string;
}

export default function InterviewProcess() {
  const formRef = useRef<HTMLFormElement>(null);
  const { formData, topicOptions, handleChange, setFormData } =
    useSessionForm();

  useEffect(() => {
    setIsClient(true);
    setFormData((prev) => ({
      ...prev,
      language: storedCandidate?.skills?.[0] || "",
    }));
  }, [storedCandidate?.skills, setFormData]);
  const [candidate, setCandidate] = useState<Candidate>({
    id: '',
    fullName: 'Nguyễn Văn A',
    email: 'nva@example.com',
    phone: '0987654321',
    position: 'Frontend Developer',
    level: 'JUNIOR',
    skills: ['React', 'TypeScript'],
    experience: 2,
    resumeUrl: ''
  });

  const [questions, setQuestions] = useState<InterviewQuestionDetails[]>([
    {
      id: 1,
      content: 'Giới thiệu về kinh nghiệm làm việc với ReactJS',
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      topic: 'Frontend'
    },
    {
      id: 2,
      content: 'Bạn xử lý conflict trong team như thế nào?',
      type: 'BEHAVIORAL',
      difficulty: 'EASY',
      topic: 'Teamwork'
    }
  ]);

  const [generationParams, setGenerationParams] = useState({
    type: 'TECHNICAL',
    difficulty: 'MEDIUM',
    topic: '',
    count: 5
  });

  const [answers, setAnswers] = useState({});

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const newQuestion = {
      id: Date.now(),
      content: `${generationParams.type} question ${questions.length + 1} (${generationParams.difficulty})`,
      ...generationParams
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCreateQuestion = (newQuestion) => {
    setQuestions(prev => [...prev, {
      id: Date.now(),
      ...newQuestion,
      type: 'TECHNICAL',
      difficulty: 'MEDIUM',
      topic: 'General'
    }]);
  };

  const generateQuestionsFromSession = async (sessionId: string) => {
    setIsGenerating(true);
    try {
      const session = await fetchSessionDetails(sessionId);
      
      const baseQuestions = [
        {
          content: `Trình bày kinh nghiệm làm việc với ${session.position}`,
          type: 'BEHAVIORAL',
          difficulty: 'MEDIUM'
        },
        {
          content: `Mô tả cách bạn xử lý ${session.required_skills?.[0] || 'kỹ thuật'} trong dự án`,
          type: 'TECHNICAL',
          difficulty: 'HARD'
        }
      ];

      setQuestions(prev => [
        ...prev,
        ...baseQuestions.map((q, i) => ({
          id: Date.now() + i,
          ...q,
          topic: session.position
        }))
      ]);

    } catch (error) {
      console.error('Lỗi khi tạo câu hỏi:', error);
      toast.error('Không thể tạo câu hỏi tự động');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen gap-4 p-6 bg-gray-50">
      {/* Candidate Form - Left */}
      <div className="w-80 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông tin ứng viên</h2>
        <div className="space-y-4">
          <Input
            name="fullName"
            label="Họ và tên"
            value={candidate.fullName}
            onChange={(e) => setCandidate({...candidate, fullName: e.target.value})}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={candidate.email}
            onChange={(e) => setCandidate({...candidate, email: e.target.value})}
          />
          <Input
            name="phone"
            label="Số điện thoại"
            value={candidate.phone}
            onChange={(e) => setCandidate({...candidate, phone: e.target.value})}
          />
          <Select
            name="position"
            label="Vị trí"
            options={['Frontend Developer', 'Backend Developer', 'Fullstack Developer']
              .map(p => ({ value: p, label: p }))}
            value={candidate.position}
            onChange={(v) => setCandidate({...candidate, position: v})}
          />
          <Select
            name="level"
            label="Trình độ"
            options={['INTERN', 'FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR']
              .map(l => ({ value: l, label: l }))}
            value={candidate.level}
            onChange={(v) => setCandidate({...candidate, level: v})}
          />
        </div>
      </div>

      {/* Questions List - Center */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow-lg border border-gray-200 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Danh sách câu hỏi ({questions.length})
          </h2>
          <Button 
            type="default"
            onClick={() => setQuestions([])} 
            variant="outline"
            className="text-red-600 hover:bg-red-50"
          >
            Xóa tất cả
          </Button>

        </div>
        
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionItem
              key={q.id}
              question={q}
              index={i}
              onAnswer={(answer) => setAnswers(prev => ({
                ...prev,
                [q.id]: answer
              }))}
              answer={answers[q.id]}
            />
          ))}
        </div>
      </div>

      {/* Question Generator - Right */}
      <div className="w-96 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tạo câu hỏi tự động</h2>
        <form ref={formRef} className="space-y-6">
                    <Select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      label="Ngôn ngữ"
                      rules={["required"]}
                      options={
                        storedCandidate?.skills?.map((skill) => ({
                          value: skill.toLowerCase(),
                          label: skill,
                        })) || []
                      }
                    />
        
                    <Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      label="Cấp độ"
                      error=""
                      rules={["required"]}
                      options={LEVEL_OPTIONS}
                    />
        
                    <Select
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      label="Chủ đề"
                      options={topicOptions}
                    />
        
                    <Input
                      type="number"
                      name="questionCount"
                      value={formData.questionCount}
                      onChange={handleChange}
                      label="Số lượng câu hỏi"
                      rules={["required", "number", { min: 5 }, { max: 50 }]}
                      min={5}
                      max={50}
                    />
        
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        onClick={handleGenerate}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                      >
                        Tạo câu hỏi
                      </button>
        
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Tạo phiên thi
                      </button>
                    </div>
        </form>
      </div>
      <CreateCandidateModal
        visible={isQuestionModalOpen}
        onCancel={() => setIsQuestionModalOpen(false)}
        onSuccess={handleCreateQuestion}
        isQuestionMode={true}
      />
    </div>
  );
}

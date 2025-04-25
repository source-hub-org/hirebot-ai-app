import React, { useState, useEffect } from 'react';
import { Input, Select } from '@/components/ui';
import { useCandidateStore } from '@/hooks/useCandidateStore';

export default function NewSession() {
  const { candidate } = useCandidateStore();
  
  useEffect(() => {
    console.log(candidate);
    return () => {
      // Candidate data persists until explicitly cleared
    };
  }, []);
  
  const [formData, setFormData] = useState({
    language: '',
    level: '',
    questionCount: 5
  });
  
  const [errors, setErrors] = useState({
    language: '',
    level: '',
    questionCount: ''
  });

  const [generatedSessions, setGeneratedSessions] = useState([]);

  const handleFieldError = (name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {
      language: '',
      level: '',
      questionCount: ''
    };
    
    Object.entries({
      language: { 
        value: formData.language, 
        rules: ['required'],
        context: { title: 'Ngôn ngữ' }
      },
      level: { 
        value: formData.level, 
        rules: ['required'],
        context: { title: 'Cấp độ' }
      },
      questionCount: { 
        value: formData.questionCount,
        rules: ['required', 'number', { min: 5 }, { max: 50 }],
        context: { title: 'Số câu hỏi' }
      }
    }).forEach(([key, { value, rules, context }]) => {
      newErrors[key as keyof typeof newErrors] = validateField(value, rules, context);
    });
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const validateField = (value: any, rules: any[], context: any) => {
    let error = '';
    rules.forEach(rule => {
      if (rule === 'required' && !value) {
        error = `Vui lòng chọn ${context.title}`;
      } else if (rule === 'number' && isNaN(value)) {
        error = `${context.title} phải là số`;
      } else if (typeof rule === 'object' && rule.min && value < rule.min) {
        error = `${context.title} phải từ ${rule.min} trở lên`;
      } else if (typeof rule === 'object' && rule.max && value > rule.max) {
        error = `${context.title} phải từ ${rule.max} trở xuống`;
      }
    });
    return error;
  };

  const handleGenerate = () => {
    if (!validateForm()) return;
    
    const newSession = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setGeneratedSessions(prev => [...prev, newSession]);
  };

  const handleClearForm = () => {
    setFormData({
      language: '',
      level: '',
      questionCount: 5
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo Phiên Thi Mới</h1>
      
      {candidate && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Thông tin ứng viên</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Họ tên</p>
              <p className="font-medium">{candidate.full_name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{candidate.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Số điện thoại</p>
              <p className="font-medium">{candidate.phone_number}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cấp độ</p>
              <p className="font-medium">{candidate.interview_level}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <form className="space-y-6">
          <Select
            name="language"
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            onValidate={(error) => handleFieldError('language', error)}
            label="Ngôn ngữ"
            error={errors.language}
            rules={['required']}
            fieldName="ngôn ngữ"
            options={[
              { value: 'javascript', label: 'JavaScript' },
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' },
              { value: 'csharp', label: 'C#' }
            ]}
          />
          
          <Select
            name="level"
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
            onValidate={(error) => handleFieldError('level', error)}
            label="Cấp độ"
            error={errors.level}
            rules={['required']}
            fieldName="cấp độ"
            options={[
              { value: 'junior', label: 'Junior' },
              { value: 'middle', label: 'Middle' },
              { value: 'senior', label: 'Senior' }
            ]}
          />
          
          <Input
            type="number"
            name="questionCount"
            value={formData.questionCount}
            onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
            onValidate={(error) => handleFieldError('questionCount', error)}
            label="Số lượng câu hỏi"
            error={errors.questionCount}
            rules={['required', 'number', { min: 5 }, { max: 50 }]}
            fieldName="số câu hỏi"
            min={5}
            max={50}
          />
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleGenerate}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              disabled={!!Object.values(errors).some(error => error)}
            >
              Tạo câu hỏi
            </button>
            
            <button
              type="button"
              onClick={handleClearForm}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Xóa Form
            </button>
          </div>
        </form>
      </div>
      
      {generatedSessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách Phiên Thi</h2>
          <div className="space-y-4">
            {generatedSessions.map(session => (
              <div key={session.id} className="border p-4 rounded">
                <p><span className="font-medium">Ngôn ngữ:</span> {session.language}</p>
                <p><span className="font-medium">Cấp độ:</span> {session.level}</p>
                <p><span className="font-medium">Số câu hỏi:</span> {session.questionCount}</p>
                <p><span className="font-medium">Thời gian tạo:</span> {new Date(session.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
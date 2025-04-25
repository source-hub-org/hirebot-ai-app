import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { validateField } from '@/helpers/validation';
import { useRouter } from 'next/router';
import { useCandidateDetailStore } from '@/stores/candidateDetailStore';
import candidateService from '@/services/candidateService';
import { Candidate } from '@/types/candidate';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess?: (candidate: any) => void;
};

export const CreateCandidateModal = ({ isOpen, onClose, onCreateSuccess }: Props) => {

  const [formData, setFormData] = useState<Candidate>({
    full_name: '',
    phone_number: '',
    email: '',
    interview_level: 'intern',
    gender: '',
    preferred_stack: ''
  });
  
  const [errors, setErrors] = useState<Partial<Candidate>>({
    full_name: '',
    phone_number: '',
    email: '',
    interview_level: '',
    gender: '',
    preferred_stack: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setCandidate = useCandidateDetailStore(state => state.setCandidate);

  const validateForm = () => {
    const newErrors: Partial<Candidate> = {
      full_name: validateField(formData.full_name, ['required'], { title: 'Tên ứng viên' }),
      phone_number: validateField(formData.phone_number, ['required', 'phone'], { title: 'Số điện thoại' }),
      email: validateField(formData.email, ['required', 'email'], { title: 'Email' }),
      interview_level: validateField(formData.interview_level, ['required'], { title: 'Cấp độ phỏng vấn' }),
      gender: validateField(formData.gender, ['required'], { title: 'Giới tính' }),
      preferred_stack: validateField(formData.preferred_stack, ['required'], { title: 'Vị trí ứng tuyển' })
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const result = await candidateService.createCandidate({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        interview_level: formData.interview_level,
        gender: formData.gender,
        preferred_stack: formData.preferred_stack
      });
      
      // Store candidate in both state and localStorage
      setCandidate(result.data);
      localStorage.setItem('candidate', JSON.stringify(result.data));
      toast.success('Tạo ứng viên thành công');
      router.push('/admin/sessions/new');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create candidate';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm ứng viên mới</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            label="Tên ứng viên"
            error={errors.full_name}
            rules={['required']}
            context={{ title: 'Tên ứng viên' }}
          />
          
          <Input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            label="Số điện thoại"
            error={errors.phone_number}
            rules={['required', 'phone']}
            context={{ title: 'Số điện thoại' }}
          />
          
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            error={errors.email}
            rules={['required', 'email']}
            context={{ title: 'Email' }}
          />

          <Select
            name="interview_level"
            value={formData.interview_level}
            onChange={handleChange}
            label="Cấp độ phỏng vấn"
            error={errors.interview_level}
            options={[
              { value: 'intern', label: 'Intern' },
              { value: 'fresher', label: 'Fresher' },
              { value: 'junior', label: 'Junior' },
              { value: 'middle', label: 'Middle' },
              { value: 'senior', label: 'Senior' },
              { value: 'expert', label: 'Expert' }
            ]}
          />
          
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Giới tính"
            error={errors.gender}
            options={[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
              { value: 'other', label: 'Khác' }
            ]}
          />
          
          <Input
            name="preferred_stack"
            value={formData.preferred_stack}
            onChange={handleChange}
            label="Vị trí ứng tuyển"
            placeholder="Vị trí tuyển dụng"
            error={errors.preferred_stack}
            rules={['required']}
            context={{ title: 'Vị trí ứng tuyển' }}
          />
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

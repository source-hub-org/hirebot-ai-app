import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { LEVEL_OPTIONS } from '@/constants/candidate';
import { SessionFormData } from '@/types/session';

export const useSessionForm = () => {
  const [formData, setFormData] = useState<SessionFormData>({
    language: '',
    level: LEVEL_OPTIONS[0].value,
    topic: '',
    questionCount: 5
  });
  
  const [topicOptions, setTopicOptions] = useState<{value: string, label: string}[]>([]);
  const storedTopics = useSelector((state: RootState) => state.candidateDetail.topics);

  const changeLevel = (value: string) => {
    const newFilteredTopics = storedTopics?.filter(topic => 
      topic.suitable_level === value
    ) || [];
    
    const newTopicOptions = newFilteredTopics.map(topic => ({
      value: topic.title,
      label: topic.title
    }));
    
    setTopicOptions(newTopicOptions);
    
    if (newTopicOptions.length > 0) {
      setFormData(prev => ({
        ...prev,
        topic: newTopicOptions[0].value
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'level') {
      changeLevel(value);
    }
  };

  const handleClearForm = () => {
    setFormData({
      language: '',
      level: LEVEL_OPTIONS[0].value,
      topic: '',
      questionCount: 5
    });
  };

  // Initialize topic options
  useEffect(() => {
    if (storedTopics) {
      changeLevel(formData.level);
    }
  }, [storedTopics]);

  return {
    formData,
    topicOptions,
    handleChange,
    handleClearForm,
    setFormData
  };
};

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/stores/store';
import candidateService from '@/services/candidateService';
import { setCandidate, setTopic } from '@/stores/candidateDetailSlice';
import { CandidateDetail } from '@/types/candidate';

export const useCandidates = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  const storedCandidate = useSelector((state: RootState) => state.candidateDetail.candidate as CandidateDetail | null);
  const storedTopics = useSelector((state: RootState) => state.candidateDetail.topics);

  const fetchCandidateIfNeeded = async () => {
    try {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      let data: CandidateDetail | null = storedCandidate;
      if (!storedCandidate || storedCandidate._id !== id) {
        const response = await candidateService.getCandidateById(id);
        data = response.data as CandidateDetail;
      }
      
      dispatch(setCandidate({
        ...data,
        answers: []
      } as CandidateDetail));
    } catch (error) {
      console.error('Failed to load candidate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTopics = async () => {
    if (!storedTopics) {
      const topicsResponse = await candidateService.getTopics();
      if (topicsResponse?.data) {
        dispatch(setTopic(topicsResponse.data));
      }
    }
  };

  useEffect(() => {
    fetchCandidateIfNeeded();
    getTopics();
  }, [id]);

  return {
    candidate: storedCandidate,
    topics: storedTopics,
    isLoading
  };
};

import { useState, useEffect } from 'react';
import candidateService from '@/services/candidateService';
import { CandidateSubmission } from '@/types/candidate';
import { ApiError } from '@/types/common';

export const useCandidateSubmissions = (candidateId: string | string[] | undefined) => {
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!candidateId || Array.isArray(candidateId)) {
        setLoading(false);
        console.log('No valid candidateId provided:', candidateId);
        return;
      }

      console.log('Fetching submissions for candidate ID:', candidateId);
      
      try {
        setLoading(true);
        const response = await candidateService.getCandidateSubmissions(candidateId);
        
        // Log the full response for debugging
        console.log('API Response:', JSON.stringify(response, null, 2));
        
        if ('success' in response && response.success && response.data) {
          console.log('Submissions data:', response.data);
          setSubmissions(response.data);
        } else {
          const errorResponse = response as ApiError;
          const errorMessage = errorResponse.message || 'Failed to fetch submissions';
          console.error('Error response:', errorMessage);
          setError(errorMessage);
        }
      } catch (err) {
        console.error('Exception in useCandidateSubmissions:', err);
        setError('An error occurred while fetching submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [candidateId]);

  return { submissions, loading, error };
};
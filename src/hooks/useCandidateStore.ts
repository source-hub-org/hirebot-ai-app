import { useEffect } from 'react';
import { useCandidateDetailStore } from '@/stores/candidateDetailStore';

export function useCandidateStore() {
  const store = useCandidateDetailStore();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCandidate = localStorage.getItem('currentCandidate');
      if (storedCandidate) {
        store.setCandidate(JSON.parse(storedCandidate));
      }
    }
  }, []);
  
  return store;
}

import { useState, useEffect } from 'react';
import { Candidate, CandidatesResponse } from '@/types/candidate';
import candidateService from '@/services/candidateService';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    total: 0
  });
  
  const [showLoading, setShowLoading] = useState(false);

  const fetchCandidates = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response: CandidatesResponse = await candidateService.getCandidates();
      setCandidates(response.data);
      
      setPagination({
        currentPage: response.pagination.page,
        itemsPerPage: response.pagination.page_size,
        totalPages: response.pagination.total_pages,
        total: response.pagination.total,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchCandidates(page, pagination.itemsPerPage);
  };


  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    setPagination(prev => ({
      ...prev,
      currentPage: pageNumber,
      currentItems: prev.allPages[pageNumber - 1] || []
    }));
    fetchCandidates(pageNumber)
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (loading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => setShowLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return {
    candidates,
    loading,
    showLoading,
    error,
    fetchCandidates,
    pagination,
    paginate,
    handlePageChange,
  };
};

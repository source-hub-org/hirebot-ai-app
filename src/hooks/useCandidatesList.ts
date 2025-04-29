import { useState, useEffect, useCallback, useRef } from "react";
import { Candidate, CandidatesResponse } from "@/types/candidate";
import candidateService from "@/services/candidateService";
import { PAGINATION } from "@/constants/candidate";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(PAGINATION);
  const [showLoading, setShowLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchCandidates = useCallback(async (page = pagination.currentPage, pageSize = pagination.itemsPerPage) => {
    try {
      setLoading(true);
      const response: CandidatesResponse = await candidateService.getCandidates(
        { page, page_size: pageSize },
      );
      setCandidates(response.data);

      setPagination({
        currentPage: response.pagination.page,
        itemsPerPage: response.pagination.page_size,
        totalPages: response.pagination.total_pages,
        total: response.pagination.total,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = (page: number) => {
    fetchCandidates(page, pagination.itemsPerPage);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;
    fetchCandidates(pageNumber);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCandidates();
      hasFetched.current = true;
    }
  }, [fetchCandidates, hasFetched]);

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

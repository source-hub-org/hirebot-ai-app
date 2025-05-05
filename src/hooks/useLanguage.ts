import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import languageService from "../services/languageService";
import { Language } from "../constants/language";
import { setLanguages, selectLanguages } from "@/stores/languageSlice";
import { PAGINATION } from "@/constants/candidate";
import { Pagination } from "@/types";

export const useLanguages = (autoFetch = true, limit?: number) => {
  const dispatch = useDispatch();
  const languages = useSelector(selectLanguages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const hasFetched = useRef(false);

  const fetchLanguages = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await languageService.getLanguages({
        page: page,
        limit: limit ?? PAGINATION.itemsPerPage
      });

      if ('error' in response) {
        throw new Error(response.message || 'Failed to load languages');
      }

      dispatch(setLanguages(response.data as Language[]));
      if ('pagination' in response) {
        setPagination({
          currentPage: response.pagination?.page || 1,
          totalPages: response.pagination?.total_pages || 1,
          totalItems: response.pagination?.total || 0
        });
      }
      hasFetched.current = true;
      console.log(pagination)
    } catch (err) {
      setError("Failed to load languages");
      console.error("Failed to load languages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, limit]);

  const paginate = (page: number) => {
    fetchLanguages(page);
  };

  const deleteLanguage = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await languageService.deleteLanguage(id);
      
      // Refresh languages after deletion
      if (pagination) {
        fetchLanguages(pagination.currentPage);
      } else {
        fetchLanguages(1);
      }
    } catch (err) {
      setError("Failed to delete language");
      console.error("Failed to delete language:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchLanguages, pagination]);

  useEffect(() => {
    if (autoFetch && !hasFetched.current) {
      fetchLanguages();
    }
  }, [autoFetch, fetchLanguages]);

  return {
    languages,
    isLoading,
    error,
    pagination,
    paginate,
    deleteLanguage,
    fetchLanguages
  };
};

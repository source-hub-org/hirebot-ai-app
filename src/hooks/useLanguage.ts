import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import languageService from "../services/languageService";
import { Language } from "../constants/language";
import { setLanguages, selectLanguages } from "@/stores/languageSlice";
import { PAGINATION } from "@/constants/candidate";

export const useLanguages = (autoFetch = true, limit?: number) => {
  const dispatch = useDispatch();
  const languages = useSelector(selectLanguages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchLanguages = useCallback(async () => {
    try {
      if (hasFetched.current) return;
      
      setIsLoading(true);
      setError(null);
      const response = await languageService.getLanguages({limit: limit ?? PAGINATION.itemsPerPage});

      dispatch(setLanguages(response.data as Language[]));
      hasFetched.current = true;
    } catch (err) {
      setError("Failed to load languages");
      console.error("Failed to load languages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, limit]);

  useEffect(() => {
    if (autoFetch && !languages?.length && !hasFetched.current) {
      fetchLanguages();
      hasFetched.current = true
    }
  }, [autoFetch, fetchLanguages, languages?.length]);

  return {
    languages,
    isLoading,
    error,
    refresh: fetchLanguages,
  };
};

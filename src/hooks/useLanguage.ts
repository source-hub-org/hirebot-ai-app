import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import languageService from '../services/languageService';
import { Language } from '../constants/language';
import { setLanguages, selectLanguages } from '@/stores/languageSlice';

export const useLanguages = (autoFetch = true) => {
  const dispatch = useDispatch();
  const languages = useSelector(selectLanguages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await languageService.getLanguages();

      dispatch(setLanguages(response.data as Language[]));
    } catch (err) {
      setError('Failed to load languages');
      console.error('Failed to load languages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!languages?.length) {
      fetchLanguages();
    }
  }, [dispatch, autoFetch]);

  return {
    languages,
    isLoading,
    error,
    refresh: fetchLanguages
  };
};

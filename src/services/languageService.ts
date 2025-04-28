import apiClient from './apiClient';
import { ApiResponse, ApiError } from '@/types/common';
import { Language } from '@/constants/language';
import { AxiosError } from 'axios'; 

export interface LanguagesService {
  getLanguages(): Promise<ApiResponse<Language[]> | ApiError>;
  getLanguageById(id: string): Promise<ApiResponse<Language> | ApiError>;
  createLanguage(LanguageData: Partial<Language>): Promise<ApiResponse<Language>>;
  updateLanguage(id: string, LanguageData: Partial<Language>): Promise<ApiResponse<Language>>;
  deleteLanguage(id: string): Promise<void>;
}

const languagesService: LanguagesService = {
  /**
   * Fetches all Languages
   * @returns Promise resolving to array of Language objects
   */
  async getLanguages(): Promise<ApiResponse<Language[]> | ApiError> {
    try {
      const response = await apiClient.get<ApiResponse<Language[]>>('/api/languages');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Language[]>>;
      console.error('Error fetching Languages:', axiosError.response?.data?.error);
      
      return {
        success: false,
        error: {
          message: axiosError.response?.data?.error?.message || 'Failed to fetch Languages',
          status: axiosError.response?.status,
          data: [] // Return an empty array to match the ApiError interface
        }
      };
    }
  },

  /**
   * Fetches Language by ID
   * @param id Language ID
   * @returns Promise resolving to Language object
   */
  async getLanguageById(id: string): Promise<ApiResponse<Language> | ApiError> {
    try {
      const response = await apiClient.get<ApiResponse<Language>>(`/api/languages/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Language>>;
      console.error('Error fetching Language:', axiosError?.response?.data?.error);
      return {
        success: false,
        error: {
          message: axiosError.response?.data?.error?.message || 'Failed to fetch Language',
          status: axiosError.response?.status,
          data: [] // Return an empty array to match the ApiError interface
        }
      };
    }
  },

  /**
   * Creates a new Language
   * @param LanguageData Language data
   * @returns Promise resolving to created Language object
   */
  async createLanguage(LanguageData: Partial<Language>): Promise<ApiResponse<Language>> {
    try {
      const response = await apiClient.post<ApiResponse<Language>>('/api/languages', LanguageData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Language>>;
      console.error('Error creating Language:', axiosError.response?.data?.error);
      throw new Error(JSON.stringify(axiosError.response?.data?.error) || 'Failed to create Language');
    }
  },

  /**
   * Updates a Language
   * @param id Language ID
   * @param LanguageData Language data
   * @returns Promise resolving to updated Language object
   */
  async updateLanguage(id: string, LanguageData: Partial<Language>): Promise<ApiResponse<Language>> {
    try {
      const response = await apiClient.patch<ApiResponse<Language>>(`/api/languages/${id}`, LanguageData);
      if (!response.data?.data) {
        throw new Error('Failed to update Language');
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Language>>;
      console.error('Error updating Language:', axiosError.response?.data?.error);
      throw new Error(JSON.stringify(axiosError.response?.data?.error) || 'Failed to update Language');
    }
  },

  /**
   * Deletes a Language
   * @param id Language ID
   */
  async deleteLanguage(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/languages/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<void>>;
      console.error('Error deleting Language:', axiosError.response?.data?.error);
      throw new Error(JSON.stringify(axiosError.response?.data?.error) || 'Failed to delete Language');
    }
  }
};

export default languagesService;

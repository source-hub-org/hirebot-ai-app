import axios from 'axios';
import apiClient from './apiClient';
import { Candidate } from '@/types/candidate';


type CreateCandidateDto = Omit<Candidate, 'id'>;

const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await apiClient.get('/api/candidates');
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  async getCandidateById(id: string): Promise<Candidate> {
    try {
      const response = await apiClient.get(`/api/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate ${id}:`, error);
      throw error;
    }
  },

  async createCandidate(candidateData: CreateCandidateDto): Promise<Candidate> {
    try {
      const response = await apiClient.post('/api/candidates', candidateData);
      return response.data;
    } catch (error) {
      console.error('Error creating candidate:', error);
      
      throw new Error(error?.response?.data?.error);
    }
  },

  async updateCandidate(id: string, candidateData: Partial<CreateCandidateDto>): Promise<Candidate> {
    try {
      const response = await apiClient.put(`/api/candidates/${id}`, candidateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating candidate ${id}:`, error);
      throw error;
    }
  },

  async deleteCandidate(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/candidates/${id}`);
    } catch (error) {
      console.error(`Error deleting candidate ${id}:`, error);
      throw error;
    }
  }
};

export default candidateService;

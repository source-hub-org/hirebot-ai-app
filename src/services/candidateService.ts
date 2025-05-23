import { AxiosError } from "axios";
import apiClient from "./apiClient";
import {
  Candidate,
  CandidateDetail,
  CandidatesResponse,
  CandidateSubmission,
} from "@/types/candidate";
import { Topic } from "@/types/topic";
import { ApiResponse, ApiError } from "@/types/common";

type CreateCandidateDto = Omit<Candidate, "id">;

const candidateService = {
  /**
   * Fetches all candidates with optional query parameters
   * @param params Query parameters for filtering candidates
   * @returns Promise resolving to array of Candidate objects
   */
  async getCandidates(params = {}): Promise<CandidatesResponse> {
    try {
      const response = await apiClient.get<ApiResponse<Candidate[]>>(
        "/api/candidates",
        { params },
      );
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || [],
        pagination: response.data?.pagination || {
          total: 0,
          page: 1,
          page_size: 10,
          total_pages: 1,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Candidate[]>>;
      console.error(
        "Error fetching candidates:",
        axiosError.response?.data?.error,
      );
      throw new Error(
        JSON.stringify(axiosError.response?.data?.error) ||
          "Failed to fetch candidates",
      );
    }
  },

  /**
   * Fetches a single candidate by ID
   * @param id Candidate ID
   * @returns Promise resolving to Candidate object
   */
  async getCandidateById(
    id: string,
  ): Promise<ApiResponse<CandidateDetail> | ApiError> {
    try {
      const response = await apiClient.get<ApiResponse<CandidateDetail>>(
        `/api/candidates/${id}`,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<CandidateDetail>>;
      console.error(
        "Error fetching candidate:",
        axiosError?.response?.data?.error,
      );
      return {
        success: false,
        error: {
          message:
            axiosError.response?.data?.error?.message ||
            "Failed to fetch candidate",
          status: axiosError.response?.status,
          data: [], // Return an empty array to match the ApiError interface
        },
      };
    }
  },

  /**
   * Creates a new candidate
   * @param candidateData Candidate data without ID
   * @returns Promise resolving to created Candidate object
   */
  async createCandidate(
    candidateData: CreateCandidateDto,
  ): Promise<ApiResponse<CandidateDetail>> {
    try {
      const response = await apiClient.post<ApiResponse<CandidateDetail>>(
        "/api/candidates",
        candidateData,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<CandidateDetail>>;
      console.error(
        "Error creating candidate:",
        axiosError.response?.data?.error,
      );
      throw new Error(
        JSON.stringify(axiosError.response?.data?.error) ||
          "Failed to create candidate",
      );
    }
  },

  /**
   * Updates an existing candidate
   * @param id Candidate ID to update
   * @param candidateData Partial candidate data to update
   * @returns Promise resolving to updated Candidate object
   */
  async updateCandidate(
    id: string,
    candidateData: Partial<CreateCandidateDto>,
  ): Promise<Candidate> {
    try {
      const response = await apiClient.put<ApiResponse<Candidate>>(
        `/api/candidates/${id}`,
        candidateData,
      );
      if (!response.data?.data) {
        throw new Error("Failed to update candidate");
      }
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Candidate>>;
      console.error(
        "Error updating candidate:",
        axiosError.response?.data?.error,
      );
      throw new Error(
        JSON.stringify(axiosError.response?.data?.error) ||
          "Failed to update candidate",
      );
    }
  },

  /**
   * Deletes a candidate by ID
   * @param id Candidate ID to delete
   * @returns Promise resolving when deletion is complete
   */
  async deleteCandidate(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/candidates/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<void>>;
      console.error(
        "Error deleting candidate:",
        axiosError.response?.data?.error,
      );
      throw new Error(
        JSON.stringify(axiosError.response?.data?.error) ||
          "Failed to delete candidate",
      );
    }
  },

  /**
   * Fetches all available topics
   * @returns Promise resolving to array of Topic objects
   */
  async getTopics(): Promise<ApiResponse<Topic[]>> {
    try {
      console.log("Calling API: /api/topics");
      const response = await apiClient.get<ApiResponse<Topic[]>>(`/api/topics`);
      console.log("API response:", response);

      // Ensure we return a properly formatted response even if the API doesn't
      if (!response.data) {
        console.warn("API returned empty data");
        return {
          success: false,
          data: [],
          message: "No data returned from API",
        };
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Topic[]>>;
      console.error("Error fetching topics:", axiosError.response?.data?.error);
      throw new Error(
        JSON.stringify(axiosError.response?.data?.error) ||
          "Failed to fetch topics",
      );
    }
  },

  /**
   * Fetches submissions for a specific candidate
   * @param candidateId Candidate ID to fetch submissions for
   * @returns Promise resolving to array of CandidateSubmission objects
   */
  async getCandidateSubmissions(
    candidateId: string,
  ): Promise<ApiResponse<CandidateSubmission[]> | ApiError> {
    try {
      const response = await apiClient.get<ApiResponse<CandidateSubmission[]>>(
        `/api/submissions/candidate/${candidateId}`,
        { params: { enrich: true } },
      );

      // Log the raw response to check if instruments and logic_questions are present
      console.log("Raw API response for submissions:", response.data);

      // Check if instruments and logic_questions exist in the response
      if (response.data?.data && response.data.data.length > 0) {
        console.log(
          "First submission instruments from API:",
          response.data.data[0].instruments,
        );
        console.log(
          "First submission logic_questions from API:",
          response.data.data[0].logic_questions,
        );
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<
        ApiResponse<CandidateSubmission[]>
      >;
      console.error(
        "Error fetching candidate submissions:",
        axiosError?.response?.data?.error,
      );
      return {
        success: false,
        error: {
          message:
            axiosError.response?.data?.error?.message ||
            "Failed to fetch candidate submissions",
          status: axiosError.response?.status,
          data: [], // Return an empty array to match the ApiError interface
        },
      };
    }
  },

  /**
   * Updates the review status for a submission
   * @param submissionId Submission ID to update
   * @param reviewData Review data to update
   * @returns Promise resolving to updated CandidateSubmission object
   */
  async updateSubmissionReview(
    submissionId: string,
    reviewData: { comment: string; status: string },
  ): Promise<ApiResponse<CandidateSubmission> | ApiError> {
    try {
      const response = await apiClient.patch<ApiResponse<CandidateSubmission>>(
        `/api/submissions/${submissionId}/review`,
        reviewData,
      );

      console.log("Update review response:", response.data);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<CandidateSubmission>>;
      console.error(
        "Error updating submission review:",
        axiosError?.response?.data?.error,
      );
      return {
        success: false,
        error: {
          message:
            axiosError.response?.data?.error?.message ||
            "Failed to update submission review",
          status: axiosError.response?.status,
          data: [], // Return an empty array to match the ApiError interface
        },
      };
    }
  },
};

export default candidateService;

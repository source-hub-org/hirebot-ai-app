import { useState, useEffect, useCallback } from "react";
import candidateService from "@/services/candidateService";
import { CandidateSubmission, ReviewStatus } from "@/types/candidate";
import { ApiError } from "@/types/common";

export const useCandidateSubmissions = (
  candidateId: string | string[] | undefined,
) => {
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const fetchSubmissions = useCallback(async () => {
    if (!candidateId || Array.isArray(candidateId)) {
      setLoading(false);
      console.log("No valid candidateId provided:", candidateId);
      return;
    }

    console.log("Fetching submissions for candidate ID:", candidateId);

    try {
      setLoading(true);
      const response =
        await candidateService.getCandidateSubmissions(candidateId);

      // Log the full response for debugging
      console.log("API Response:", JSON.stringify(response, null, 2));

      if ("success" in response && response.success && response.data) {
        console.log("Submissions data:", response.data);

        // Log specific fields to check if they exist
        if (response.data.length > 0) {
          console.log(
            "First submission instruments:",
            response.data[0].instruments,
          );
          console.log(
            "First submission logic_questions:",
            response.data[0].logic_questions,
          );
        }

        setSubmissions(response.data);
      } else {
        const errorResponse = response as ApiError;
        const errorMessage =
          errorResponse.message || "Failed to fetch submissions";
        console.error("Error response:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Exception in useCandidateSubmissions:", err);
      setError("An error occurred while fetching submissions");
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateReviewStatus = async (
    submissionId: string,
    reviewData: ReviewStatus,
  ) => {
    if (!submissionId) {
      setError("No submission ID provided");
      return false;
    }

    try {
      setUpdateLoading(true);
      const response = await candidateService.updateSubmissionReview(
        submissionId,
        reviewData,
      );

      if ("success" in response && response.success && response.data) {
        // Update the local state with the updated submission
        setSubmissions((prevSubmissions) =>
          prevSubmissions.map((sub) =>
            sub._id === submissionId ? { ...sub, review: reviewData } : sub,
          ),
        );
        return true;
      } else {
        const errorResponse = response as ApiError;
        const errorMessage =
          errorResponse.message || "Failed to update review status";
        console.error("Error updating review:", errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      console.error("Exception in updateReviewStatus:", err);
      setError("An error occurred while updating review status");
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return {
    submissions,
    loading,
    error,
    updateReviewStatus,
    updateLoading,
    refreshSubmissions: fetchSubmissions,
  };
};

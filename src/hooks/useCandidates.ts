import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/stores/store";
import candidateService from "@/services/candidateService";
import { setCandidate, setTopic } from "@/stores/candidateDetailSlice";
import { CandidateDetail } from "@/types/candidate";
import { useRouter } from "next/router";

export const useCandidates = (candidateId?: string) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const storedCandidate = useSelector(
    (state: RootState) =>
      state.candidateDetail.candidate as CandidateDetail | null,
  );
  const storedTopics = useSelector(
    (state: RootState) => state.candidateDetail.topics,
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchCandidateIfNeeded = useCallback(
    async (candidateId: string) => {
      try {
        if (!candidateId || hasFetched.current) {
          setIsLoading(false);
          return;
        }

        let data: CandidateDetail | null = storedCandidate;
        if (!storedCandidate || storedCandidate._id !== candidateId) {
          const response = await candidateService.getCandidateById(candidateId);
          data = response.data as CandidateDetail;
          if (!response?.data) {
            router.push("/admin/candidates");
            return;
          }
        }

        dispatch(
          setCandidate({
            ...data,
            answers: [],
          } as CandidateDetail),
        );
        hasFetched.current = true;
      } catch (error) {
        router.push("/admin/candidates");
        console.error("Failed to load candidate:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, router, storedCandidate],
  );

  const getTopics = useCallback(async () => {
    if (!storedTopics) {
      try {
        const topicsResponse = await candidateService.getTopics();
        if (topicsResponse?.data) {
          dispatch(setTopic(topicsResponse.data));
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }
  }, [dispatch, storedTopics]);

  useEffect(() => {
    if (candidateId && !hasFetched.current) {
      fetchCandidateIfNeeded(candidateId);
    }
    getTopics();
  }, [candidateId, fetchCandidateIfNeeded, getTopics]);

  return {
    candidate: storedCandidate,
    topics: storedTopics,
    isLoading,
  };
};

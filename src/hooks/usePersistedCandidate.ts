import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCandidate } from "@/stores/candidateDetailSlice";

export function usePersistedCandidate() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check both storage locations
      const storedCandidate =
        localStorage.getItem("currentCandidate") ||
        localStorage.getItem("candidateDetail_backup");

      if (storedCandidate) {
        try {
          const candidate = JSON.parse(storedCandidate);
          if (candidate) {
            dispatch(setCandidate(candidate));
          }
        } catch (e) {
          console.error("Failed to parse stored candidate", e);
        }
      }
    }
  }, [dispatch]);
}

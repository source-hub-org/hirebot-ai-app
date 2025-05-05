import { useState, useCallback, useEffect, useRef } from "react";
import positionService from "@/services/positionService";
import { Position } from "@/constants/position";

export default function usePosition(autoFetch = true) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchPositions = useCallback(async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      const response = await positionService.getPositions({ page, limit: perPage });
      setPositions(response.data || []);
      setPagination({
        currentPage: response.pagination?.page || 1,
        itemsPerPage: response.pagination?.page_size || 10,
        totalPages: response.pagination?.total_pages || 1,
        totalItems: response.pagination?.total || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPosition = async (positionData: Partial<Position>) => {
    try {
      setLoading(true);
      const response = await positionService.createPosition(positionData);
      await fetchPositions();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create position");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePosition = async (id: string) => {
    try {
      setLoading(true);
      await positionService.deletePosition(id);
      await fetchPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete position");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && !hasFetched.current) {
      fetchPositions();
      hasFetched.current = true;
    }
  }, [autoFetch, fetchPositions]);

  return {
    positions,
    loading,
    error,
    pagination,
    fetchPositions,
    createPosition,
    deletePosition,
  };
}

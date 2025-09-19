import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  resetPatients,
  incrementPage,
  setFilterParams,
} from "../../../../redux/ipd/inPatientsSlice";

export const usePatientsData = () => {
  const dispatch = useDispatch();
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [usingStaticData, setUsingStaticData] = useState(false);

  const {
    patients: {
      data: patientsData,
      loading: patientsLoading,
      hasMore,
      error: patientsError,
    },
    filterParams,
  } = useSelector((state) => state.inPatients);

  const fetchData = useCallback(
    (params) => {
      dispatch(fetchPatients(params));
      setFetchAttempted(true);
    },
    [dispatch]
  );

  const resetData = useCallback(() => {
    dispatch(resetPatients());
    setFetchAttempted(false);
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (patientsLoading || patientsError || !hasMore || loadingMore) return;
    setLoadingMore(true);
    dispatch(incrementPage());
  }, [dispatch, patientsLoading, patientsError, hasMore, loadingMore]);

  const updateFilters = useCallback(
    (filters) => {
      dispatch(setFilterParams(filters));
    },
    [dispatch]
  );

  // Reset loadingMore when data changes
  useEffect(() => {
    if (loadingMore && (patientsData.length > 0 || patientsError)) {
      setLoadingMore(false);
    }
  }, [patientsData, patientsError, loadingMore]);

  return {
    patientsData,
    patientsLoading,
    patientsError,
    hasMore,
    filterParams,
    fetchAttempted,
    loadingMore,
    usingStaticData,
    setUsingStaticData,
    fetchData,
    resetData,
    loadMore,
    updateFilters,
  };
};

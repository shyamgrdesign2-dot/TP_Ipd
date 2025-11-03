import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilters } from '../../../../redux/ipd/inPatientsSlice';

export const useFiltersData = () => {
  const dispatch = useDispatch();
  const [filtersAttempted, setFiltersAttempted] = useState(false);
  const [usingStaticFilters, setUsingStaticFilters] = useState(false);

  const {
    filters: { ward: wardFilters, doctor: doctorFilters, error: filtersError },
  } = useSelector((state) => state.inPatients);

  useEffect(() => {
    if (!filtersAttempted) {
      dispatch(fetchFilters({ field: "doctor" }));
      dispatch(fetchFilters({ field: "ward" }));
      setFiltersAttempted(true);
    }
  }, [dispatch, filtersAttempted]);

  const doctors = doctorFilters?.map((doctor) => ({
    id: doctor.id,
    name: doctor.name,
  })) || [];

  const wards = wardFilters?.map((ward) => ({
    id: ward.id,
    name: ward.title,
  })) || [];

  return {
    doctors,
    wards,
    filtersError,
    usingStaticFilters,
    setUsingStaticFilters,
  };
};

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { storePatientDetails } from "../redux/ipd/ipdSlice";
import { getPrintSettings } from "../redux/ipd/printSettingsSlice";

/**
 * Custom hook to handle patient details storage and print settings fetch
 * Fetches patient details from location.state and stores in Redux if not already present
 */
const usePrintPreviewSetup = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patientDetails } = state || {};
  const patientDetailsFromStore = useSelector(
    (state) => state.ipd.patientDetails
  );
  const { printSettings } = useSelector((state) => state.printSettings);

  // Store patient details if not already in Redux store
  useEffect(() => {
    if (
      patientDetails &&
      (!patientDetailsFromStore || !Object.keys(patientDetailsFromStore).length)
    ) {
      dispatch(storePatientDetails(patientDetails));
    }
  }, [patientDetails, patientDetailsFromStore, dispatch]);

  // Fetch print settings if not already loaded
  useEffect(() => {
    if (Object.keys(patientDetailsFromStore)?.length) {
      dispatch(getPrintSettings());
    }
  }, [patientDetailsFromStore, dispatch]);

  return { patientDetailsFromStore, printSettings };
};

export default usePrintPreviewSetup;

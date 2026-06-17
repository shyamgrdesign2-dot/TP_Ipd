import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { storePatientDetails } from "../redux/ipd/ipdSlice";
import {
  getPrintSettings,
  setFooterDimensions,
} from "../redux/ipd/printSettingsSlice";
import { getFooterImageHeight } from "../utils/utils";

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
  const hasPrintSettings =
    printSettings &&
    typeof printSettings === "object" &&
    Object.keys(printSettings).length > 0;

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
    if (Object.keys(patientDetailsFromStore)?.length && !hasPrintSettings) {
      dispatch(getPrintSettings());
    }
  }, [patientDetailsFromStore, hasPrintSettings, dispatch]);

  // Pre-compute footer heights for all modules as soon as settings are available
  useEffect(() => {
    const computeAllFooterHeights = async () => {
      if (!printSettings || typeof printSettings !== "object") return;

      const entries = Object.entries(printSettings).filter(
        ([_, value]) => value && value.headerFooter && value.headerFooter.footer
      );

      for (const [moduleType, moduleSettings] of entries) {
        const footer = moduleSettings?.headerFooter?.footer || {};
        if (!footer.footerImg) continue;
        if (footer.renderedFooterImageHeight != null) continue;

        try {
          const height = await getFooterImageHeight(footer.footerImg);
          if (height == null) continue;

          dispatch(
            setFooterDimensions({
              moduleType,
              dimensions: {
                renderedFooterImageHeight: height,
                showFile: footer.footerImg,
                imageShow: true,
              },
            })
          );
        } catch (error) {
          console.error(
            `[usePrintPreviewSetup] Failed to compute footer height for ${moduleType}`,
            error
          );
        }
      }
    };

    computeAllFooterHeights();
  }, [dispatch, printSettings]);

  return { patientDetailsFromStore, printSettings };
};

export default usePrintPreviewSetup;

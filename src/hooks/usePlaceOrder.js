import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { zydusRefIds } from "../redux/doctorsSlice";
import { placeIctOrder } from "../redux/appointmentsSlice";
import { getDecodedToken } from "../utils/localStorage";
import { env } from "../EnvironmentConfig";
import { useLocation } from "react-router-dom";

/**
 * Custom hook for placing Zydus ICT orders
 * @returns {Object} Object containing placeOrder function and loading state
 */
export const usePlaceOrder = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { patient_data, patientDetails } = state;

  // Get required data from Redux store
  const { siteId, storeCode } = useSelector((state) => state.doctors);
  const { medicationData, pillupSwitch } = useSelector(
    (state) => state.prescription
  );
  console.log("dispatch:", dispatch);
  console.log("state from location:", state);
  console.log("patient_data:", patient_data);
  console.log("patientDetails:", patientDetails);
  console.log("siteId:", siteId);
  console.log("storeCode:", storeCode);
  console.log("medicationData:", medicationData);
  console.log("pillupSwitch:", pillupSwitch);

  /**
   * Places an ICT order with Zydus
   * @param {Object} params - Order parameters
   * @param {string} params.action - 'add' or 'edit'
   * @param {number} params.tcmId - TCM ID (0 for new orders)
   * @param {Object} params.patientData - Patient information
   * @param {boolean} params.isPillUpAccessableFromGB - PillUp access flag
   * @returns {Promise} Promise that resolves with the order response
   */

  useEffect(() => {
    const fetchZydusRefIds = async () => {
      if (!siteId || !storeCode) {
        const decodedToken = getDecodedToken();
        const tokenData = decodedToken?.result;

        // Only fetch if user has Zydus access
        if (tokenData?.hospital_business_id === env.zydus_business_id) {
          await dispatch(zydusRefIds());
        } else {
          throw new Error("Zydus access not available for this user");
        }
      }
    };
    fetchZydusRefIds();
  }, [siteId, storeCode]);
  const placeOrder = useCallback(
    async ({ patientData = {}, isPillUpAccessableFromGB = false }) => {
      try {
        // Prepare medication list from prescription slice
        const medicineList =
          medicationData.length > 0
            ? medicationData.map(
                ({ tmm_medicine_name, display_qty, tmm_remarks }) => ({
                  name: tmm_medicine_name,
                  quantity: display_qty,
                  instruction: tmm_remarks,
                })
              )
            : [];

        // Prepare order data
        const zydusSendData = {
          action: !patientDetails?.admissionId ? "add" : "edit",
          tcmId: null,
          siteId: siteId,
          departmentId: patientData?.departmentId,
          visitId: patientData?.visitId,
          encounterId: patientData?.encounterId,
          mrno: patientData?.mrno,
          doctorCode: patientData?.employeeId,
          storeCode: storeCode,
          duplicateCheck: 1,
          investigationList: [], // Empty as requested
          medicineList: medicineList,
          pillupSwitch: 0,
        };

        // Track MoEngage event before API call
        window.Moengage?.track_event("Z_placeIctOrder_API_before_call", {
          action: !patientDetails?.admissionId ? "add" : "edit",
          tcmId: null,
          siteId: siteId,
          departmentId: patientData?.departmentId,
          visitId: patientData?.visitId,
          encounterId: patientData?.encounterId,
          mrno: patientData?.mrno,
          doctorCode: patientData?.employeeId,
          storeCode: storeCode,
          duplicateCheck: 1,
          investigationList: [],
          medicineList: medicineList
            .map((item) => JSON.stringify(item))
            .join(", "),
          pillupSwitch: isPillUpAccessableFromGB && pillupSwitch ? 1 : 0,
        });

        // Place the order
        const actionPIO = await dispatch(placeIctOrder(zydusSendData));

        // Track MoEngage event for response
        if (actionPIO.payload.status !== 400) {
          window.Moengage?.track_event("Z_placeIctOrder_API_Response", {
            status: "success",
          });
        } else {
          window.Moengage?.track_event("Z_placeIctOrder_API_Response", {
            status: "failure",
            reason: actionPIO.payload.data.message,
          });
        }

        return actionPIO;
      } catch (error) {
        console.error("Error placing ICT order:", error);

        // Track error in MoEngage
        window.Moengage?.track_event("Z_placeIctOrder_API_Response", {
          status: "error",
          reason: error.message,
        });

        throw error;
      }
    },
    [dispatch, siteId, storeCode, medicationData, pillupSwitch]
  );

  return {
    placeOrder,
  };
};

export default usePlaceOrder;

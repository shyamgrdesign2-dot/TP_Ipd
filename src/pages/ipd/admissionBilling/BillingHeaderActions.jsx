import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import addCircleIcon from "../../../assets/images/add-circle.svg";
import "./styles.scss";
import {
  fetchPatientWalletBalance,
  fetchBillsByPatient,
} from "../../opdBilling/service";
import { useSelector } from "react-redux";

const BillingHeaderActions = forwardRef(
  (
    {
      patientData,
      totalAdvanceBalance: propTotalAdvanceBalance,
      onTotalAdvanceBalanceChange,
      onAddAdvanceClick,
      onPastBillingHistoryClick,
      currentAdmissionId,
    },
    ref
  ) => {
    const [totalAdvanceBalance, setTotalAdvanceBalance] = useState(
      propTotalAdvanceBalance || 0
    );
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [hasPastBills, setHasPastBills] = useState(false);
    const { doctorList } = useSelector((state) => state.bulkMessages);
    const { userId } = useSelector((state) => state.doctors);

    // Get patient unique ID from various possible data structures
    const getPatientUniqueId = useCallback(() => {
      if (!patientData) return null;

      return (
        patientData?.patient_unique_id ||
        patientData?.patientUniqueId ||
        patientData?.details?.patient_unique_id ||
        patientData?.patient?.patient_unique_id
      );
    }, [patientData]);

    // Fetch wallet balance
    const getPatientWalletBalance = useCallback(async () => {
      const patientUniqueId = getPatientUniqueId();

      if (!patientUniqueId) {
        setTotalAdvanceBalance(0);
        return;
      }

      try {
        setIsLoadingBalance(true);
        const patientWalletBalanceRes = await fetchPatientWalletBalance(
          patientUniqueId
        );
        const balance = patientWalletBalanceRes?.advanceDepositBalance || 0;
        setTotalAdvanceBalance(balance);

        // Notify parent if callback is provided
        if (onTotalAdvanceBalanceChange) {
          onTotalAdvanceBalanceChange(balance);
        }
      } catch (error) {
        console.error("Error fetching patient wallet balance:", error);
        setTotalAdvanceBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    }, [getPatientUniqueId, onTotalAdvanceBalanceChange]);

    // Check if there are past bills for this patient
    const checkPastBills = useCallback(async () => {
      const patientUniqueId = getPatientUniqueId();
      if (!patientUniqueId || !currentAdmissionId) {
        setHasPastBills(false);
        return;
      }

      // Calculate doctorIds inside the callback
      const doctorIds =
        doctorList.map((doctor) => doctor.um_id).length > 0
          ? doctorList.map((doctor) => doctor.um_id)
          : [userId];

      try {
        const params = {
          patientId: patientUniqueId,
          page: 1,
          limit: 10, // Check first 10 bills to see if any are from other admissions
          sortBy: "date",
          sortOrder: "desc",
          doctorIds,
        };

        const response = await fetchBillsByPatient(params, "ipd");

        // Check if there are any bills that are not for the current admission
        let billsArray = [];

        if (response?.bills) {
          if (Array.isArray(response.bills)) {
            billsArray = response.bills;
          } else if (typeof response.bills === "object") {
            // If bills is an object, convert to array
            billsArray = Object.values(response.bills).flat();
          }
        }

        // Check if there are any bills for other admissions
        const hasOtherBills = billsArray.some(
          (bill) => bill?.admissionId && bill.admissionId !== currentAdmissionId
        );

        // Also check summary count as fallback
        const totalBillsCount = response?.summary?.count || 0;
        const hasBills =
          hasOtherBills || (totalBillsCount > 0 && billsArray.length > 0);

        setHasPastBills(hasBills);
      } catch (error) {
        console.error("Error checking past bills:", error);
        setHasPastBills(false);
      }
    }, [getPatientUniqueId, currentAdmissionId, doctorList, userId]);

    // Expose refresh function via ref
    useImperativeHandle(ref, () => ({
      refreshBalance: getPatientWalletBalance,
      refreshPastBills: checkPastBills,
    }));

    // Fetch balance on mount and when patient data changes
    useEffect(() => {
      // If prop is provided, use it; otherwise fetch
      if (
        propTotalAdvanceBalance !== undefined &&
        propTotalAdvanceBalance !== null
      ) {
        setTotalAdvanceBalance(propTotalAdvanceBalance);
      } else {
        getPatientWalletBalance();
      }
    }, [propTotalAdvanceBalance, getPatientWalletBalance]);

    // Refresh balance when patient data changes
    useEffect(() => {
      const patientUniqueId = getPatientUniqueId();

      if (patientUniqueId) {
        // Only fetch if prop is not provided
        if (
          propTotalAdvanceBalance === undefined ||
          propTotalAdvanceBalance === null
        ) {
          getPatientWalletBalance();
        }
      }
    }, [
      patientData,
      getPatientUniqueId,
      getPatientWalletBalance,
      propTotalAdvanceBalance,
    ]);

    // Check for past bills when patient data or admission ID changes
    useEffect(() => {
      if (currentAdmissionId) {
        checkPastBills();
      }
    }, [currentAdmissionId, checkPastBills]);

    return (
      <div className="billing-content-header">
        <div className="billing-header-center">
          <div className="advance-balance-container">
            <span className="advance-balance-label">Advance Balance:</span>
            <span className="advance-balance-value">
              {isLoadingBalance ? (
                <span style={{ opacity: 0.6 }}>Loading...</span>
              ) : (
                `₹${totalAdvanceBalance || "0"}`
              )}
            </span>
            <button className="add-advance-btn" onClick={onAddAdvanceClick}>
              <img src={addCircleIcon} alt="add" />
            </button>
          </div>
        </div>
        {hasPastBills && (
          <div className="billing-header-right">
            <button
              className="past-billing-history-btn"
              onClick={onPastBillingHistoryClick}
            >
              <span>Past IPD Billing History</span>
              <i
                className="icon-right"
                style={{ transform: "rotate(180deg)" }}
              ></i>
            </button>
          </div>
        )}
      </div>
    );
  }
);

BillingHeaderActions.displayName = "BillingHeaderActions";

export default React.memo(BillingHeaderActions);

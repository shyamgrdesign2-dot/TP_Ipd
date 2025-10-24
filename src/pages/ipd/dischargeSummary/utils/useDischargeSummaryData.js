import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { greenTick } from "../../../../assets/images/dischargeSummaryIcons";
import { formatDateToShortMonthYear } from "../../../../utils/utils";

export const useDischargeSummaryData = (
  isEditable = true,
  isOTNotes = false
) => {
  const location = useLocation();
  const { activeMenuItem } = location.state || {};

  const assessmentLastUpdateAt = useSelector(
    (state) =>
      state.dischargeSummary.actualDischargeSummaryData?.assessmentLastUpdateAt
  );

  const otSurgeries = useSelector(
    (state) => state.dischargeSummary.dischargeSummaryData?.otSurgeries
  );

  const value =
    activeMenuItem === "dischargeSummary" ? assessmentLastUpdateAt : undefined;

  const showLastUpdatedAt = (surgeryId = null) => {
    if (!isEditable) return null;

    let label = "";
    let date = null;

    if (isOTNotes) {
      const surgery = otSurgeries?.find(surgery => surgery?._id === surgeryId);
      if (surgery?.dateOfSurgery) {
        label = "OT Notes";
        date = formatDateToShortMonthYear(surgery.dateOfSurgery);
      }
    } else if (assessmentLastUpdateAt) {
      label = "Admission Asses. Form";
      date = formatDateToShortMonthYear(assessmentLastUpdateAt);
    }

    if (!label || !date || date === "Invalid date") return null;

    return (
      <div className="success-gradient-pill">
        <img src={greenTick} alt="." />
        {`Autofilled from ${label} (${date})`}
      </div>
    );
  };

  return {
    activeMenuItem,
    assessmentLastUpdateAt: value,
    showLastUpdatedAt,
  };
};

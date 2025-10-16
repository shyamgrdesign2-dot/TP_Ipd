import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { greenTick } from "../../../../assets/images/dischargeSummaryIcons";
import { formatDateToShortMonthYear } from "../../../../utils/utils";

export const useDischargeSummaryData = (isEditable = true) => {
  const location = useLocation();
  const { activeMenuItem } = location.state || {};

  const assessmentLastUpdateAt = useSelector(
    (state) =>
      state.dischargeSummary.actualDischargeSummaryData?.assessmentLastUpdateAt
  );

  const value =
    activeMenuItem === "dischargeSummary" ? assessmentLastUpdateAt : undefined;

  const showLastUpdatedAt = () => {
    if (isEditable && assessmentLastUpdateAt) {
      return (
        <div className="success-gradient-pill">
          <img src={greenTick} alt="." />
          Autofilled from Admission Asses. Form (
          {assessmentLastUpdateAt
            ? formatDateToShortMonthYear(assessmentLastUpdateAt)
            : "25 Jun 2025"}
          )
        </div>
      );
    }
    return null;
  };

  return {
    activeMenuItem,
    assessmentLastUpdateAt: value,
    showLastUpdatedAt,
  };
};

import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useSelector } from "react-redux";
import { GB_GYNEC_HISTORY, GYNAECOLOGY, PAEDIATRICS } from "../../utils/constants";

export const useAccess = (patientAge = 0) => {
  const { profile } = useSelector((state) => state.doctors);
  const isVaccinationAccessableFromGB = useFeatureIsOn(
    "vaccination-new-design"
  );
  const isGrowthChartAccessableFromGB = useFeatureIsOn(
    "growth-chart-new-design"
  );
  const isGynaecAccessableFromGB = useFeatureIsOn(
    GB_GYNEC_HISTORY
  );

  return {
    isVaccinationAccessable: isVaccinationAccessableFromGB || profile?.dp_name === PAEDIATRICS,
    isGrowthChartAccessable:
      (isGrowthChartAccessableFromGB || profile?.dp_name === PAEDIATRICS) && patientAge <= 18,
    isGynaecHistoryAccessable: isGynaecAccessableFromGB || profile?.dp_name === GYNAECOLOGY,
  };
};

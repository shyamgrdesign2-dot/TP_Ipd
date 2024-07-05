import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkToShowVaccination } from "./service";

export const useAccess = (patientAge = 0) => {
  const [isPediatric, setIsPediatric] = useState(false);
  const { profile } = useSelector((state) => state.doctors);
  const isVaccinationAccessableFromGB = useFeatureIsOn(
    "vaccination-new-design"
  );
  const isGrowthChartAccessableFromGB = useFeatureIsOn(
    "growth-chart-new-design"
  );

  useEffect(() => {
    checkForPediatric();
  }, []);

  const checkForPediatric = async () => {
    if (profile?.doctor_unique_id) {
      setIsPediatric(await checkToShowVaccination(profile.doctor_unique_id));
    }
  };

  return {
    isPediatric,
    isVaccinationAccessable: isVaccinationAccessableFromGB || isPediatric,
    isGrowthChartAccessable:
      (isGrowthChartAccessableFromGB || isPediatric) && patientAge <= 18,
  };
};

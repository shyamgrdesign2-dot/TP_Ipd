import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useSelector } from "react-redux";

export const useOpdBilling = () => {
  const { profile } = useSelector((state) => state.doctors);
  const isOpdBillingAccessableFromGB = useFeatureIsOn("new-opd-billing");

  return {
    isOpdBillingAccessable: isOpdBillingAccessableFromGB,
  };
};

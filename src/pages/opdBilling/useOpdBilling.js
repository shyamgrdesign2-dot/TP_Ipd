import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useSelector } from "react-redux";

export const useOpdBilling = () => {
  const { shouldShowOpdBilling } = useSelector((state) => state.billing);

  const isOpdBillingAccessableFromGB = useFeatureIsOn("new-opd-billing");

  return {
    isOpdBillingAccessable:
      isOpdBillingAccessableFromGB || shouldShowOpdBilling,
  };
};

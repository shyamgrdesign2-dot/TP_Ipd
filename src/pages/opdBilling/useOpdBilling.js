import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useEffect } from "react";
import { checkToShowOpdBilling } from "./service";
import { useDispatch } from "react-redux";
import { setShouldShowOpdBilling } from "../../redux/billingSlice";
import { useSelector } from "react-redux";

export const useOpdBilling = () => {
  const dispatch = useDispatch();
  const { shouldShowOpdBilling, isOpdBillChecked } = useSelector(
    (state) => state.billing
  );
  
  useEffect(() => {
    if (!isOpdBillChecked) {
      getShowOpdBilling();
    }
  }, []);

  const getShowOpdBilling = async () => {
    const res = await checkToShowOpdBilling();
    dispatch(setShouldShowOpdBilling(res?.data));
  };

  const isOpdBillingAccessableFromGB = useFeatureIsOn("new-opd-billing");

  return {
    isOpdBillingAccessable:
      isOpdBillingAccessableFromGB || shouldShowOpdBilling,
  };
};

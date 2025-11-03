
import { useLocation } from 'react-router-dom';

const useOnlyViewMode = () => {
  const { state } = useLocation();
  const { patientDetails } = state || {};

  return Boolean(patientDetails?.referral || patientDetails?.isDischarged);
};

export default useOnlyViewMode;

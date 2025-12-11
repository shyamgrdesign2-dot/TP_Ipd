import { isZydus } from "../utils/utils";

/**
 * Hook to determine if ward & bed management is in read-only mode
 * Currently returns true for Zydus hospitals
 * @returns {boolean} true if read-only mode, false otherwise
 */
const useWardBedReadOnly = () => {
  return isZydus();
};

export default useWardBedReadOnly;

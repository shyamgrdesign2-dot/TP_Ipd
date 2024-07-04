import moment from "moment";
import { useEffect, useState } from "react";
import { getAllGrowthChartParams, getGrowthChartImages } from "./service";
import { useAccess } from "../vaccination/useAccess";

export const useGrowthChart = (caseManagerData) => {
  const { isGrowthChartAccessable } = useAccess();
  const [growthChartData, setGrowthChartData] = useState([]);
  const [growthChartImageData, setGrowthChartImageData] = useState({});
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    if (isGrowthChartAccessable) {
      getGrowthChartDetails();
    }
  }, []);

  const getGrowthChartDetails = async () => {
    const allGrowthChartParams = await getAllGrowthChartParams({
      pm_id: caseManagerData?.patient_data?.pm_id || 0,
      pm_pid: caseManagerData?.patient_data?.patient_id || 0,
    });
    if (
      allGrowthChartParams &&
      allGrowthChartParams.find(
        (p) =>
          moment(p.tcbc_created_date).format(dateFormat) ===
          moment().format(dateFormat)
      )
    ) {
      setGrowthChartData(allGrowthChartParams);
      getGrowthChartImageData();
    }
  };

  const getGrowthChartImageData = async () => {
    const growthChartImageData = await getGrowthChartImages({
      pm_id: caseManagerData?.patient_data?.pm_id || 0,
      pm_pid: caseManagerData?.patient_data?.patient_id || 0,
    });
    setGrowthChartImageData(growthChartImageData);
  };

  return {
    growthChartData,
    growthChartImageData,
  };
};

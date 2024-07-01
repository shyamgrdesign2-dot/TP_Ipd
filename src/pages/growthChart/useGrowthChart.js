import moment from "moment";
import { useEffect, useState } from "react";
import { getAllGrowthChartParams } from "./service";

export const useGrowthChart = (caseManagerData) => {
  const [todayGcData, setTodayGcData] = useState([]);
  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    getTodayGrowthChartDetails();
  }, []);

  const getTodayGrowthChartDetails = async () => {
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
      setTodayGcData(allGrowthChartParams);
    }
  };

  return todayGcData;
};

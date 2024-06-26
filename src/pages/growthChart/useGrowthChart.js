import moment from "moment";
import { useEffect, useState } from "react";
import { getAllGrowthChartParams } from "./service";

export const useGrowthChart = (caseManagerData) => {
  const [todayGcData, setTodayGcData] = useState([]);

  useEffect(() => {
    getTodayGrowthChartDetails();
  }, []);

  const getTodayGrowthChartDetails = async () => {
    const allGrowthChartParams = await getAllGrowthChartParams({
      pm_id: caseManagerData?.patient_data?.pm_id || 0,
      pm_pid: caseManagerData?.patient_data?.patient_id || 0,
      date: moment().format("YYYY-MM-DD"),
    });
    if (allGrowthChartParams) {
      setTodayGcData(allGrowthChartParams);
    }
  };

  return todayGcData;
};

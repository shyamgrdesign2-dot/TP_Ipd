import { useState, useEffect } from "react";
import { getGivenVaccineDetails, getOverridenDueDatesByDate } from "./service";
import moment from "moment";

export const useTodayVaccines = (caseManagerData) => {
  const [todayVaccines, setTodayVaccines] = useState();

  useEffect(() => {
    getGivenAndDueVaccines();
  }, []);

  const getGivenAndDueVaccines = async () => {
    const given = await getGivenVaccineDetails(
      caseManagerData?.patient_data?.patient_unique_id,
      caseManagerData?.patient_data?.patient_id
    );
    const due = await getOverridenDueDatesByDate(
      caseManagerData?.patient_data?.patient_unique_id,
      caseManagerData?.patient_data?.patient_id,
      moment().format("YYYY-MM-DD")
    );
    setTodayVaccines({ given, due });
  };

  return todayVaccines;
};

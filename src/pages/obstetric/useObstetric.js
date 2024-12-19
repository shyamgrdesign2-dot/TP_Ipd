import React from "react";
import { fetchObstetricDetails } from "./service";
import { useSelector } from "react-redux";

export default function useObstetric(patientId) {
  const [obstetrics, setObstetrics] = React.useState([]);
  const { userId } = useSelector((state) => state.doctors);

  React.useEffect(() => {
    getObstetrics();
  }, []);

  const getObstetrics = async () => {
    const res = await fetchObstetricDetails(patientId, userId, true);
    setObstetrics(res);
  };

  return obstetrics;
}

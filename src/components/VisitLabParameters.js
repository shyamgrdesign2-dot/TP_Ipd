import { Button } from "antd";
import { useState, useEffect } from "react";
import LabParametersList from "./LabParametersList";
import labParamsImg from "../assets/images/Lab.svg";
import { Card } from "react-bootstrap";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import axios from 'axios';

const VisitLabParameters = ( {patient_unique_id, doc_id}) => {
  const [labParamsData, setLabParamsData] = useState([]);

  const [token, setToken] = useState(null);

  const getLabParams = async () => {
    try {
        const cleanedToken = token.replace(/['"]+/g, '');
        const response = await axios.get(`https://pm-patient-docs-uat.tatvacare.in/api/v1/lab-parameters/results/${doc_id}/${patient_unique_id}`, {
            headers: {
                'Authorization': `Bearer ${cleanedToken}`,
            },
        });
        setLabParamsData(response.data?.results || []);
    } catch (error) {
        console.error("Error fetching lab params:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if(token){
      getLabParams()
    }
  },[token])

  return (
    <div>
      {labParamsData?.length > 0 ? (
        <div className="appointment-wrap PatientDetailswrap m-0">
          <Card
            style={{
              overflow: "hidden",
            }}
          >
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={labParamsImg}
                    alt="lab-parameters"
                    className="me-3"
                  />
                  Lab Results
                </div>
                <Button
                  className="btn btn-input d-flex align-items-center gap-1"
                  // onClick={obstetricNavigate}
                >
                  <span style={{ textDecoration: "underline" }}>View All</span>
                  <i
                    className="icon-right iconrotatehistory90"
                    style={{
                      display: "block",
                      transform: `rotate(180deg)`,
                      marginTop: "-1px",
                    }}
                  />
                </Button>
              </div>
            </Card.Header>
            <LabParametersList patient_unique_id={patient_unique_id} doc_id={doc_id} />
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default VisitLabParameters;

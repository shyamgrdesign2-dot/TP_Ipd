import React, { useContext, useEffect, useState } from "react";
import { getAllGrowthChartParams } from "../../service";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Button } from "antd";
import { useSelector } from "react-redux";
import CashManagerContext from "../../../../context/CashManagerContext";

export default function VisitGrowthChart() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { patient_data } = state;

  const [growthChartData, setGrowthChartData] = useState([]);

  useEffect(() => {
    getGrowthChartDetails();
  }, []);

  const getGrowthChartDetails = async () => {
    setGrowthChartData(
      await getAllGrowthChartParams({
        pm_id: patient_data?.pm_id || 0,
        pm_pid: patient_data?.pm_pid || 0,
      })
    );
  };

  return (
    <>
      {!growthChartData.length ? null : (
        <div className="appointment-wrap PatientDetailswrap m-0">
          <Card>
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <img
                    // src={Vaccination}
                    alt="Medical History"
                    className="me-3"
                  />
                  Vaccination
                </div>
                <Button
                  className="btn btn-input d-flex align-items-center gap-1"
                  onClick={() =>
                    navigate("/prescription", {
                      state: {
                        patient_data: patient_data,
                        isGrowth: true,
                      },
                    })
                  }
                >
                  <span>See Chart</span>
                  <i
                    className="icon-right iconrotatehistory90"
                    style={{ display: "block", transform: `rotate(180deg)` }}
                  />
                </Button>
              </div>
            </Card.Header>
            <div className="visitBody">
              <div className={"overflow-auto"} style={{ maxHeight: 458 }}></div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

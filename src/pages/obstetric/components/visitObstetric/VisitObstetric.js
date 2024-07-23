import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import obstetricImg from "../../../../assets/images/obstetric-dark.svg";
import { Card } from "react-bootstrap";
import { Button } from "antd";
import "./VisitObstetric.scss";
import { fetchAllObstetricDetails } from "../../service";
import moment from "moment";
import { getOrdinalSuffix } from "../../../growthChart/growthChartHelper";
import { useDispatch, useSelector } from "react-redux";
import { addObstetricDetails } from "../../../../redux/obstetricSlice";
import { visitColumn } from "../../utils/ObstetricHelper";
import { useAccess } from "../../../vaccination/useAccess";

export default function VisitObstetric() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { obstetricDetails, isObstetricDetailsFetched } = useSelector(
    (state) => state.obstetric
  );
  const { state } = useLocation();
  const { patient_data } = state;
  const { isGynaecHistoryAccessable } = useAccess();

  const [obstetricData, setObstetricData] = useState(visitColumn);
  const [viewMore, setViewMore] = useState(false);
  const [previousVisit, setPreviousVisit] = useState({});

  const currentDate = moment();
  const visitDate = moment(previousVisit.createdAt);
  const visitedMonth = getOrdinalSuffix(
    currentDate.diff(visitDate, "months") + 1
  );

  useEffect(() => {
    if (viewMore) {
      setObstetricData(visitColumn);
    } else {
      setObstetricData(visitColumn.slice(0, 3));
    }
  }, [viewMore]);

  useEffect(() => {
    if (!isObstetricDetailsFetched && isGynaecHistoryAccessable) {
      getAllObstetricDetails();
    }
  }, [isObstetricDetailsFetched, isGynaecHistoryAccessable]);

  useEffect(() => {
    if (obstetricDetails?.examinationHistory?.[0]) {
      setPreviousVisit(obstetricDetails.examinationHistory[0]);
    }
  }, [obstetricDetails]);

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchAllObstetricDetails(
      patient_data.patient_unique_id
    );
    if (obstetricResponse) {
      dispatch(addObstetricDetails(obstetricResponse));
    }
  };

  const measurementDetails = () => {
    return (
      <div className="detailContainer">
        {obstetricData.map((visitItem, index) => {
          let value =
            visitItem.key === "bp"
              ? previousVisit.systolic / previousVisit.diastolic
              : typeof previousVisit[visitItem.key] === "boolean"
              ? previousVisit[visitItem.key]
                ? "Yes"
                : "No"
              : previousVisit[visitItem.key];
          if (value) {
            value += visitItem.siUnit;
            return (
              <React.Fragment key={index}>
                <div className="measurementItem">
                  <span className="key">{visitItem.title}</span>
                  <span className="colon">:</span>
                  <span className="value">{value}</span>
                </div>
                {index !== Object.entries(obstetricData).length - 1 && (
                  <div className="dottedLineStyle" />
                )}
              </React.Fragment>
            );
          }
        })}
      </div>
    );
  };

  return (
    <>
      {!Object.keys(previousVisit)?.length ? null : (
        <div className="appointment-wrap PatientDetailswrap m-0">
          <Card>
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <img
                    src={obstetricImg}
                    alt="Medical History"
                    className="me-3"
                  />
                  Obstetric History
                </div>
                <Button
                  className="btn btn-input d-flex align-items-center gap-1"
                  onClick={() =>
                    navigate("/prescription", {
                      state: {
                        patient_data: patient_data,
                        chartType: "obstetric",
                      },
                    })
                  }
                >
                  <span>See History</span>
                  <i
                    className="icon-right iconrotatehistory90"
                    style={{ display: "block", transform: `rotate(180deg)` }}
                  />
                </Button>
              </div>
            </Card.Header>
            <div className="visitBody overflow-auto visitObstetricContainer">
              <div className="rowContainer">
                <span className="previousText">Previous visit</span>
                <span className="updatedText">
                  {previousVisit.createdAt
                    ? "Updated on : " + visitDate.format("DD MMM YYYY")
                    : ""}
                </span>
              </div>
              <div>{visitedMonth} Month</div>
              {measurementDetails()}
              {previousVisit?.notes?.length ? (
                <div
                  className="cardbody-data mt-2 border visitItem"
                  style={{ borderRadius: "8px", padding: "16px" }}
                >
                  {previousVisit.notes}
                </div>
              ) : null}
            </div>
            <Card.Footer
              className="bg-white py-3 viewLessOrMore"
              onClick={() => setViewMore(!viewMore)}
            >
              View {viewMore ? "less" : "more"}
            </Card.Footer>
          </Card>
        </div>
      )}
    </>
  );
}

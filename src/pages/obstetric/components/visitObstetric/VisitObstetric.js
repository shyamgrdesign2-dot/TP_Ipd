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
import {
  addObstetricDetails,
  navigateToObstetric,
} from "../../../../redux/obstetricSlice";
import { visitColumn } from "../../utils/constants";
import { useAccess } from "../../../vaccination/useAccess";

export default function VisitObstetric() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { obstetricDetails, isObstetricDetailsFetched } = useSelector(
    (state) => state.obstetric
  );
  const { profile } = useSelector((state) => state.doctors);
  const { state } = useLocation();
  const { patient_data } = state;
  const { isGynaecHistoryAccessable } = useAccess();

  const [viewMore, setViewMore] = useState(false);
  const [previousVisit, setPreviousVisit] = useState({});
  const [validVisitDetails, setValidVisitDetails] = useState([]);
  const [lmpDate, setLmpDate] = useState("");

  const currentDate = moment();
  const visitDate = lmpDate ? moment(lmpDate) : null;
  const visitedMonth = getOrdinalSuffix(
    currentDate.diff(visitDate, "months") + 1
  );

  useEffect(() => {
    if (!isObstetricDetailsFetched && isGynaecHistoryAccessable) {
      getAllObstetricDetails();
    }
  }, [isObstetricDetailsFetched, isGynaecHistoryAccessable]);

  useEffect(() => {
    if (obstetricDetails?.examinationHistory?.[0]) {
      setLmpDate(obstetricDetails.lmp);
      setPreviousVisit(obstetricDetails.examinationHistory[0]);
    }
  }, [obstetricDetails]);

  useEffect(() => {
    const validItems = visitColumn
      .map((visitItem) => ({
        ...visitItem,
        value: getValue(visitItem),
      }))
      .filter((visitItem) => visitItem.value);
    setValidVisitDetails(validItems);
  }, [previousVisit]);

  const getValue = (visitItem) => {
    let value =
      visitItem.key === "bp" &&
      previousVisit.systolic &&
      previousVisit.diastolic
        ? previousVisit.systolic + "/" + previousVisit.diastolic
        : typeof previousVisit[visitItem.key] === "boolean"
        ? previousVisit[visitItem.key]
          ? "Yes"
          : "No"
        : previousVisit[visitItem.key];
    if (value) {
      if (visitItem.key === "heightOfFundus") {
        value =
          previousVisit[visitItem.key] + " " + previousVisit.heightOfFundusUnit;
      } else {
        value += visitItem.siUnit;
      }
      return value;
    }
  };

  const getAllObstetricDetails = async () => {
    const obstetricResponse = await fetchAllObstetricDetails(
      patient_data.patient_unique_id,
      profile?.userId
    );
    if (obstetricResponse) {
      dispatch(addObstetricDetails(obstetricResponse));
    }
  };

  const measurementDetails = () => {
    return (
      <div className="detailContainer">
        {validVisitDetails.map((visitItem, index) => (
          <React.Fragment key={index}>
            <div className="measurementItem">
              <span className="key">{visitItem.title}</span>
              <span className="colon">:</span>
              <span className="value">{visitItem.value}</span>
            </div>
            {index !== validVisitDetails.length - 1 && (
              <div className="dottedLineStyle" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const obstetricNavigate = () => {
    navigate("/prescription", {
      state: {
        patient_data: patient_data,
      },
    });
    dispatch(navigateToObstetric());
  };

  return (
    <>
      {!Object.keys(previousVisit)?.length ? null : (
        <div className="appointment-wrap PatientDetailswrap m-0">
          <Card
            style={{
              maxHeight: viewMore ? "fit-content" : "370px",
            }}
          >
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
                  onClick={obstetricNavigate}
                >
                  <span>See History</span>
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
            <div className="visitBody visitObstetricContainer">
              <div className="rowContainer">
                <span className="previousText">Previous visit</span>
                <span className="updatedText">
                  {previousVisit.modifiedAt
                    ? "Updated on : " +
                      moment(previousVisit.modifiedAt).format("DD MMM YYYY")
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
            {validVisitDetails.length > 2 && (
              <Card.Footer
                className="bg-white py-3 viewLessOrMore"
                onClick={() => setViewMore(!viewMore)}
              >
                View {viewMore ? "less" : "more"}
              </Card.Footer>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

import { Button } from "antd";
import "./PregnancyHistory.scss";
import arrow from "../../../../assets/images/arrow.svg";
import pregnancyHistoryImg from "../../../../assets/images/pregnancy-history.svg";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  AbortionColumns,
  EctopicColumns,
  LiveColumns,
  OutcomeOptions,
} from "../../utils/constants";

const PregnancyHistory = ({
  continueExaminationHandler,
  handlePastPregnancyDrawer,
  setEditIndex,
  bottomRef,
}) => {
  const { obstetricDetails } = useSelector((state) => state.obstetric);
  const { pregnancyHistory } = obstetricDetails;

  const renderTableTitle = (gravidaItem, i) => {
    const onEdit = () => {
      setEditIndex(i);
    };
    return (
      <div className="tcell theaderCellStyle tableTitle">
        <div>{`G ${gravidaItem.gravidaNumber}, ${gravidaItem.outcome}${
          gravidaItem.termLength ? `, ${gravidaItem.termLength}` : ""
        }`}</div>
        <div className="editIcon" onClick={onEdit}>
          <i className={"icon-Edit me-1 fs-5"} />
          <span className="editText">Edit</span>
        </div>
      </div>
    );
  };

  const renderTableHeader = (columns) => {
    return (
      <tr>
        {columns?.map((header, index) => (
          <th
            key={index}
            className="tcell theaderStyle"
            style={{
              width: `${header.width}`,
            }}
          >
            {header.title}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableData = (gravidaItem) => {
    const {
      outcome,
      dateOfDelivery,
      ageOfDelivery,
      deliveryMode = "-",
      gender = "-",
      babysWeight,
      remarks = "-",
      location = "-",
      modeOfAbortion = "-",
      typeOfAbortion = "-",
      gestationPeriod,
      modeOfManagement = "-",
    } = gravidaItem;
    return (
      <>
        {outcome === OutcomeOptions.live ||
        outcome === OutcomeOptions.stillBirth ? (
          <tr>
            <td className="obstetricTcell pregnancyTcell">{deliveryMode}</td>
            <td className="obstetricTcell pregnancyTcell">
              {dateOfDelivery
                ? moment(dateOfDelivery).format("DD MMM YYYY")
                : ageOfDelivery || "-"}
            </td>
            <td className="obstetricTcell pregnancyTcell">{gender}</td>
            <td className="obstetricTcell pregnancyTcell">
              {babysWeight ? babysWeight + " Kg" : "-"}
            </td>
            <td className="obstetricTcell pregnancyTcell">{remarks}</td>
          </tr>
        ) : outcome === OutcomeOptions.ectopic ? (
          <tr>
            <td className="obstetricTcell pregnancyTcell">
              {gestationPeriod ? gestationPeriod + " weeks" : "-"}
            </td>
            <td className="obstetricTcell pregnancyTcell">{location}</td>
            <td className="obstetricTcell pregnancyTcell">
              {modeOfManagement}
            </td>
            <td className="obstetricTcell pregnancyTcell">{remarks}</td>
          </tr>
        ) : outcome === OutcomeOptions.abortion ? (
          <tr>
            <td className="obstetricTcell pregnancyTcell">
              {gestationPeriod ? gestationPeriod + " weeks" : "-"}
            </td>
            <td className="obstetricTcell pregnancyTcell">{typeOfAbortion}</td>
            <td className="obstetricTcell pregnancyTcell">{modeOfAbortion}</td>
            <td className="obstetricTcell pregnancyTcell">{remarks}</td>
          </tr>
        ) : null}
      </>
    );
  };

  return (
    <div>
      {pregnancyHistory?.length ? (
        <div className="pregnancyHistoryContainer">
          {pregnancyHistory.map((gravidaItem, index) => {
            let columns = [];
            if (
              gravidaItem.outcome === OutcomeOptions.live ||
              gravidaItem.outcome === OutcomeOptions.stillBirth
            ) {
              columns = LiveColumns;
            } else if (gravidaItem.outcome === OutcomeOptions.ectopic) {
              columns = EctopicColumns;
            } else if (gravidaItem.outcome === OutcomeOptions.abortion) {
              columns = AbortionColumns;
            }
            return (
              <div key={index}>
                <div>{renderTableTitle(gravidaItem, index)}</div>
                <table className="tableView">
                  <thead>{renderTableHeader(columns)}</thead>
                  <tbody>{renderTableData(gravidaItem)}</tbody>
                </table>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              columnGap: "32px",
              paddingBottom: "20px",
            }}
            ref={bottomRef}
          >
            <Button
              type="button"
              className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between"
              style={{
                width: "255px",
              }}
              onClick={handlePastPregnancyDrawer}
            >
              <i className="icon-Add" />
              <span>Add past pregnancy details</span>
            </Button>
            <div className="continueBtn" onClick={continueExaminationHandler}>
              <div className="continueText">Continue to Examination</div>
              <img src={arrow} alt="arrow" />
            </div>
          </div>
        </div>
      ) : (
        <div className="emptyDataContainer" style={{ marginTop: "-18px" }}>
          <img src={pregnancyHistoryImg} alt="examination" />
          <div className="shortDescription">
            Add previous pregnancy details such as Type of birth, DOB, Sex,
            Weight, Type of delivery, Mode of delivery.
          </div>
          <div>
            <Button
              type="button"
              className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between"
              style={{
                width: "255px",
              }}
              onClick={handlePastPregnancyDrawer}
            >
              <i className="icon-Add" />
              <span>Add past pregnancy details</span>
            </Button>
          </div>
          <div className="shortDescription">Or</div>

          <div
            className="continueBtn"
            style={{ paddingBottom: "20px" }}
            onClick={continueExaminationHandler}
          >
            <div className="continueText">Continue to Examination</div>
            <img src={arrow} alt="arrow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PregnancyHistory;

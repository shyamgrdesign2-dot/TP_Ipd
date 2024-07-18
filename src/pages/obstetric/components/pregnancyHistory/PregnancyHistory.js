import { Button } from "antd";
import "./PregnancyHistory.scss";
import arrow from "../../../../assets/images/arrow.svg";
import pregnancyHistoryImg from "../../../../assets/images/pregnancy-history.svg";
import moment from "moment";

const liveColumns = [
  {
    title: "Mode of delivery",
    key: "deliveryMode",
    width: "22%",
  },
  {
    title: "Date of delivery",
    key: "dateOfDelivery",
    width: "12%",
  },
  {
    title: "Gender",
    key: "gender",
    width: "12%",
  },
  {
    title: "Baby's Weight",
    key: "babysWeight",
    width: "12%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "42%",
  },
];

const ectopicColumns = [
  {
    title: "Period of gestation",
    key: "monthOfPregnancy",
    width: "22%",
  },
  {
    title: "Location",
    key: "location",
    width: "18%",
  },
  {
    title: "Mode of management",
    key: "modeOfAbortion",
    width: "18%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "42%",
  },
];

const abortionColumns = [
  {
    title: "Period of gestation",
    key: "monthOfPregnancy",
    width: "22%",
  },
  {
    title: "Type of abortion",
    key: "typeOfAbortion",
    width: "18%",
  },
  {
    title: "Mode of abortion",
    key: "modeOfAbortion",
    width: "18%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "42%",
  },
];

const outcomes = {
  live: "Live",
  stillBirth: "Still Birth",
  abortion: "Abortion",
  ectopic: "Ectopic",
};

const PregnancyHistory = ({ pregnancyHistory }) => {
  const renderTableTitle = (gravidaItem) => {
    const onEdit = () => {
      console.log("item", gravidaItem);
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
    return (
      <>
        {gravidaItem.outcome === outcomes.live ||
        gravidaItem.outcome === outcomes.stillBirth ? (
          <tr>
            <td className="obstetricTcell">{gravidaItem.deliveryMode}</td>
            <td className="obstetricTcell">
              {gravidaItem.dateOfDelivery
                ? moment(gravidaItem.dateOfDelivery).format("DD MMM YYYY")
                : ""}
            </td>
            <td className="obstetricTcell">{gravidaItem.gender}</td>
            <td className="obstetricTcell">{gravidaItem.babysWeight}</td>
            <td className="obstetricTcell">{gravidaItem.remarks}</td>
          </tr>
        ) : gravidaItem.outcome === outcomes.ectopic ? (
          <tr>
            <td className="obstetricTcell">{gravidaItem.monthOfPregnancy}</td>
            <td className="obstetricTcell">{gravidaItem.location}</td>
            <td className="obstetricTcell">{gravidaItem.modeOfAbortion}</td>
            <td className="obstetricTcell">{gravidaItem.remarks}</td>
          </tr>
        ) : gravidaItem.outcome === outcomes.abortion ? (
          <tr>
            <td className="obstetricTcell">{gravidaItem.monthOfPregnancy}</td>
            <td className="obstetricTcell">{gravidaItem.typeOfAbortion}</td>
            <td className="obstetricTcell">{gravidaItem.modeOfAbortion}</td>
            <td className="obstetricTcell">{gravidaItem.remarks}</td>
          </tr>
        ) : null}
      </>
    );
  };

  return (
    <div>
      {pregnancyHistory.length ? (
        <div className="pregnancyHistoryContainer">
          {pregnancyHistory.map((gravidaItem, index) => {
            let columns = [];
            if (
              gravidaItem.outcome === outcomes.live ||
              gravidaItem.outcome === outcomes.stillBirth
            ) {
              columns = liveColumns;
            } else if (gravidaItem.outcome === outcomes.ectopic) {
              columns = ectopicColumns;
            } else if (gravidaItem.outcome === outcomes.abortion) {
              columns = abortionColumns;
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
          <div style={{ display: "flex", columnGap: "32px" }}>
            <Button
              type="button"
              className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between"
              style={{
                width: "255px",
              }}
            >
              <i className="icon-Add" />
              <span>Add past pregnancy details</span>
            </Button>
            <div className="continueBtn">
              <div className="continueText">Continue to Examination</div>
              <img src={arrow} alt="arrow" />
            </div>
          </div>
        </div>
      ) : (
        <div className="emptyDataContainer">
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
            >
              <i className="icon-Add" />
              <span>Add past pregnancy details</span>
            </Button>
          </div>
          <div className="shortDescription">Or</div>

          <div className="continueBtn">
            <div className="continueText">Continue to Examination</div>
            <img src={arrow} alt="arrow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PregnancyHistory;

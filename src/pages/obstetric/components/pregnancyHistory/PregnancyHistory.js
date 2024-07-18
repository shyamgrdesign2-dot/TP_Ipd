import { Button } from "antd";
import { useState } from "react";
import "./PregnancyHistory.scss";
import arrow from "../../../../assets/images/arrow.svg";
import pregnancyHistoryImg from "../../../../assets/images/pregnancy-history.svg";

const mockData = [
  {
    type: "live",
    deliveryMode: "Vaginal",
    dateOfDelivery: "1 May 2024",
    gender: "Male",
    babysWeight: 5,
    term: "Term",
    remarks: "Normal",
  },
  {
    type: "live",
    deliveryMode: "Vaginal",
    dateOfDelivery: "1 May 2024",
    gender: "Male",
    babysWeight: 5,
    term: "Term",
    remarks: "Normal",
  },
  {
    type: "ectopic",
    monthOfPregnancy: "4",
    location: "Vaginal",
    modeOfAbortion: "C-Section",
    remarks: "Normal",
  },
];

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
    width: "30%",
  },
  {
    title: "Location",
    key: "location",
    width: "15%",
  },
  {
    title: "Mode of management",
    key: "modeOfAbortion",
    width: "15%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "40%",
  },
];

const abortionColumns = [
  {
    title: "Period of gestation",
    key: "monthOfPregnancy",
    width: "30%",
  },
  {
    title: "Type of abortion",
    key: "typeOfAbortion",
    width: "15%",
  },
  {
    title: "Mode of abortion",
    key: "modeOfAbortion",
    width: "15%",
  },
  {
    title: "Remarks",
    key: "remarks",
    width: "40%",
  },
];

const PregnancyHistory = () => {
  const [pregnancyHistoryData, setPregnancyHistoryData] = useState(mockData);

  const renderTableTitle = (gravidaItem, index) => {
    const onEdit = () => {
      console.log("item");
    };
    return (
      <div className="tcell theaderCellStyle tableTitle">
        <div>{`G ${index + 1}, ${gravidaItem.type}${
          gravidaItem.term ? `, ${gravidaItem.term}` : ""
        }`}</div>
        <div className="editIcon">
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
            className="tcell"
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
      <tr>
        <td className="tcell">{gravidaItem.deliveryMode}</td>
        <td className="tcell">{gravidaItem.dateOfDelivery}</td>
        <td className="tcell">{gravidaItem.gender}</td>
        <td className="tcell">{gravidaItem.babysWeight}</td>
        <td className="tcell">{gravidaItem.remarks}</td>
      </tr>
    );
  };

  return (
    <div>
      {pregnancyHistoryData.length ? (
        <div className="pregnancyHistoryContainer">
          {pregnancyHistoryData.map((gravidaItem, index) => {
            let columns = [];
            if (gravidaItem.type === "live") {
              columns = liveColumns;
            } else if (gravidaItem.type === "ectopic") {
              columns = ectopicColumns;
            } else if (gravidaItem.type === "abortion") {
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

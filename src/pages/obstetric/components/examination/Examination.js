import { Button } from "antd";
import "./../pregnancyHistory/PregnancyHistory.scss";
import examination from "../../../../assets/images/obs-examination.svg";
import "./Examination.scss";
import moment from "moment";

const columns = [
  {
    title: "Visits",
    key: "date",
    width: "20%",
  },
  {
    title: "Pallor",
    key: "pallor",
    width: "5%",
  },
  {
    title: "Oedema",
    key: "oedema",
    width: "5%",
  },
  {
    title: "BMI",
    key: "mothersBMI",
    width: "8%",
  },
  {
    title: "BP",
    key: "bp",
    width: "8%",
  },
  {
    title: "Fundus Height",
    key: "heightOfFundus",
    width: "8%",
  },
  {
    title: "Presentation",
    key: "presentation",
    width: "8%",
  },
  {
    title: "Fluid Index",
    key: "fluidIndex",
    width: "8%",
  },
  {
    title: "Fetal Heart Rate",
    key: "foetalHeartRate",
    width: "10%",
  },
  {
    title: "Note",
    key: "note",
    width: "27%",
  },
  {
    title: "Action",
    key: "action",
    width: "5%",
  },
];

const Examination = ({ examinationHistory }) => {
  const renderTableHeader = () => {
    return (
      <tr>
        {columns?.map((header, index) => (
          <th
            key={index}
            className="tcell theaderCellStyle"
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

  const renderTableData = () => {
    const onEdit = (item) => {
      console.log("item", item);
    };
    return examinationHistory.map((item, i) => (
      <tr key={i}>
        <td className="obstetricTcell">
          Visit {i + 1}
          <div className="visitStyle">
            {item.createdAt ? moment(item.createdAt).format("DD MMM YYYY") : ""}
          </div>
        </td>
        <td className="obstetricTcell">{item.pallor ? "Yes" : "No"}</td>
        <td className="obstetricTcell">{item.oedema ? "Yes" : "No"}</td>
        <td className="obstetricTcell">{item.mothersBMI + " kg/m2"}</td>
        <td className="obstetricTcell">
          {item.systolic + "/" + item.diastolic + " mmHg"}
        </td>
        <td className="obstetricTcell">{item.heightOfFundus + " cm"}</td>
        <td className="obstetricTcell">{item.presentation}</td>
        <td className="obstetricTcell">{item.fluidIndex}</td>
        <td className="obstetricTcell">{item.foetalHeartRate + " BPM"}</td>
        <td className="obstetricTcell">{item.notes}</td>
        <td className="obstetricTcell">
          <div className="editIcon" onClick={() => onEdit(item)}>
            <i className={"icon-Edit me-1 fs-5"} />
            <span className="editText">Edit</span>
          </div>
        </td>
      </tr>
    ));
  };
  return (
    <div>
      {examinationHistory?.length ? (
        <>
          <div className="examinationTableViewContainer">
            <table className="tableView">
              <thead>{renderTableHeader()}</thead>
              <tbody>{renderTableData()}</tbody>
            </table>
          </div>
          <div className="anotherVisit">
            <Button
              type="button"
              className="btn-41 btn ant-btn-text btn-input anotherVisitBtn"
            >
              <i className="icon-Add" />
              <span>Add another visit</span>
            </Button>
          </div>
        </>
      ) : (
        <div className="emptyDataContainer">
          <img src={examination} alt="examination" />
          <div className="shortDescription">
            Add details to track every details such as Fundus height, Fetus
            weight, Presentation and Fetus heart rate.
          </div>
          <Button
            type="button"
            className="btn-41 btn ant-btn-text btn-input d-flex align-items-center justify-content-between"
            style={{
              width: "180px",
            }}
          >
            <i className="icon-Add" />
            <span>Add Examination</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Examination;

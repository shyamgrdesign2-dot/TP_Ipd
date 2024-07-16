import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./../pregnancyHistory/PregnancyHistory.scss";
import examination from "../../../../assets/images/obs-examination.svg";
import "./Examination.scss";

const examinationData = [
  {
    date: "1 May 2024",
    pallor: "Yes",
    oedema: "No",
    mothersWeight: 65,
    systolic: 130,
    diastolic: 82,
    heightOfFundus: 70,
    presentation: "Breech",
    foetalHeartRate: "120 bpm",
    note: "Normal",
  },
  {
    date: "3 Jul 2024",
    pallor: "Yes",
    oedema: "No",
    mothersWeight: 70,
    systolic: 120,
    diastolic: 80,
    heightOfFundus: 80,
    presentation: "Breech",
    foetalHeartRate: "120 bpm",
    note: "Temperature is high",
  },
];

const columns = [
  {
    title: "Visits",
    key: "date",
  },
  {
    title: "Pallor",
    key: "pallor",
  },
  {
    title: "Oedema",
    key: "oedema",
  },
  {
    title: "Mother's Weight",
    key: "mothersWeight",
  },
  {
    title: "BP",
    key: "bp",
  },
  {
    title: "Fundus Height",
    key: "heightOfFundus",
  },
  {
    title: "Presentation",
    key: "presentation",
  },
  {
    title: "Fetal Heart Rate",
    key: "foetalHeartRate",
  },
  {
    title: "Note",
    key: "note",
  },
  {
    title: "Action",
    key: "action",
  },
];

const Examination = () => {
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
    return examinationData.map((item, i) => (
      <tr key={i}>
        <td className="tcell">{item.date}</td>
        <td className="tcell">{item.pallor}</td>
        <td className="tcell">{item.oedema}</td>
        <td className="tcell">{item.mothersWeight + " kg"}</td>
        <td className="tcell">
          {item.systolic + "/" + item.diastolic + " mmHg"}
        </td>
        <td className="tcell">{item.heightOfFundus + " cm"}</td>
        <td className="tcell">{item.presentation}</td>
        <td className="tcell">{item.foetalHeartRate + " BPM"}</td>
        <td className="tcell">{item.note}</td>
        <td className="tcell">
          <EditOutlined className="custom-icon" onClick={() => onEdit(item)} />
        </td>
      </tr>
    ));
  };
  return (
    <div>
      {examinationData.length ? (
        <>
          <div className="examinationTableViewContainer" style={{}}>
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
            className="btn-41 btn ant-btn-text btn-input addBtn"
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

import React from "react";
import { Modal } from "antd";
import closeFill from "../../../../assets/images/closeFill.svg";
import "./Preview.scss";
import VaccineTable from "../vaccineTable/VaccineTable";

const columns = [
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: "8%",
  },
  {
    title: "Vaccine",
    dataIndex: "vaccine",
    key: "vaccine",
    width: "15%",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    width: "15%",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    width: "16%",
  },
  {
    title: "Given Date",
    dataIndex: "givenDate",
    key: "givenDate",
    width: "16%",
  },
  {
    title: "Site",
    dataIndex: "site",
    key: "site",
    width: "10%",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    width: "20%",
  },
];

const Preview = ({ vaccinesData, onCancel, shouldShowPreview }) => {
  return (
    <div>
      <Modal
        className="custom-modal"
        title={
          <div className="d-flex justify-content-between titleContainer">
            <span>Preview</span>
            <div className="d-flex gap-3">
              <label>Close</label>
              <img
                src={closeFill}
                alt="close"
                className="imageStyle"
                onClick={onCancel}
              />
            </div>
          </div>
        }
        centered
        open={shouldShowPreview}
        closeIcon={false}
        width={1114}
        height={708}
        footer={null}
        onCancel={onCancel}
        show={true}
        onHide={onCancel}
      >
        <div className="tableContainer">
          <VaccineTable
            dataSource={vaccinesData}
            columns={columns}
            isPreview={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Preview;

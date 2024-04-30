import React from "react";
import { Modal } from "antd";
import closeFill from "../../../../assets/images/closeFill.svg";
import "./Preview.scss";
import VaccineTable from "../vaccineTable/VaccineTable";

const dataSource = [
  {
    key: "1",
    name: "John Doe",
    age: "Birth",
    remarks: "New York",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 APR 2024",
    givenDate: "12 APR 2024",
    isOverDue: false,
  },
  {
    key: "2",
    name: "Jane Smith",
    age: "Birth",
    remarks: "Los Angeles",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 APR 2024",
    givenDate: "12 APR 2024",
    isOverDue: false,
  },
  {
    key: "3",
    name: "Alice Johnson",
    age: "Birth",
    remarks: "Chicago",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 APR 2024",
    givenDate: "12 APR 2024",
    isOverDue: true,
  },
  {
    key: "4",
    name: "Bob Brown",
    age: "6 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: true,
  },
  {
    key: "5",
    name: "Bob Brown",
    age: "6 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "6",
    name: "Bob Brown",
    age: "6 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "7",
    name: "Bob Brown",
    age: "6 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "8",
    name: "Bob Brown",
    age: "8 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "9",
    name: "Bob Brown",
    age: "8 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "10",
    name: "Bob Brown",
    age: "8 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "11",
    name: "Bob Brown",
    age: "10 Weeks",
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    isOverDue: false,
  },
  {
    key: "12",
    name: "Bob Brown",
    age: "12 Weeks",
    vaccine: "vaccine 1",
    brand: "",
    dueDate: "12 APR 2024",
    givenDate: "",
    remarks:
      "Houston HoustonHoustonHoustonHouston HoustonHouston HoustonHouston HoustonHouston HoustonHoustonHouston HoustonHouston",

    isOverDue: false,
  },
];

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
    width: "18%",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    width: "18%",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    width: "18%",
  },
  {
    title: "Given Date",
    dataIndex: "givenDate",
    key: "givenDate",
    width: "18%",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
    width: "20%",
  },
];

const Preview = ({ onCancel, shouldShowPreview }) => {
  return (
    <div>
      <Modal
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
            dataSource={dataSource}
            columns={columns}
            isPreview={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Preview;

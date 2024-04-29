import React from "react";
import { Modal, Table } from "antd";
import closeFill from "../../../../assets/images/closeFill.svg";
import "./Preview.scss";

const dataSource = [
  {
    key: "1",
    name: "John Doe",
    age: 30,
    remarks: "New York",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "2",
    name: "Jane Smith",
    age: 25,
    remarks: "Los Angeles",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "3",
    name: "Alice Johnson",
    age: 35,
    remarks: "Chicago",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "4",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "5",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "6",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "7",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "8",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "9",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "10",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "11",
    name: "Bob Brown",
    age: 40,
    remarks: "Houston",
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
  },
  {
    key: "12",
    name: "Bob Brown",
    age: 40,
    vaccine: "vaccine 1",
    brand: "brand 1",
    dueDate: "12 April 2024",
    givenDate: "12 April 2024",
    remarks:
      "Houston HoustonHoustonHoustonHouston HoustonHouston HoustonHouston HoustonHouston HoustonHoustonHouston HoustonHouston",
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

const customRowClassName = (record, index) => {
  // Add condition here to determine whether to apply the custom style
  if (index % 2 === 0) {
    // return "conditionCheck"; // Apply custom style to rows that meet the condition
    return { borderBottom: "none" };
  }
  return {}; // No custom style applied
};

const Preview = ({ onCancel }) => {
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
        visible={true} // Change 'open' to 'visible'
        closeIcon={false}
        width={1114}
        height={708}
        footer={null}
        onCancel={onCancel}
        show={true}
        onHide={onCancel}
      >
        <div className="table-container tableStyle">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            className="custom-table"
            style={customRowClassName}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Preview;

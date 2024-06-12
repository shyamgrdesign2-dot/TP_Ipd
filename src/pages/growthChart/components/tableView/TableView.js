import React from "react";
import { Table, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./tableView.scss";

const dataSource = [
  {
    key: "parameters",
    parameters: "John Brown",
    height: 32,
    weight: "New York No. 1 Lake Park",
    bmi: "Developer",
    ofc: "Developer",
  },
  {
    key: "height",
    parameters: "John Brown",
    height: 32,
    weight: "New York No. 1 Lake Park",
    bmi: "Developer",
    ofc: "Developer",
  },
  {
    key: "weight",
    parameters: "Jim Green",
    height: 42,
    weight: "London No. 1 Lake Park",
    bmi: "Designer",
    ofc: "Developer",
  },
  {
    key: "bmi",
    parameters: "Joe Black",
    height: 29,
    weight: "Sidney No. 1 Lake Park",
    bmi: "Manager",
    ofc: "Developer",
  },
  {
    key: "ofc",
    parameters: "Joe Black",
    height: 29,
    weight: "Sidney No. 1 Lake Park",
    bmi: "Manager",
    ofc: "Developer",
  },
];

const TableView = ({ onEdit }) => {
  const columns = [
    {
      title: "Parameters",
      key: "parameters",
      render: (text, record) => (
        <Space>
          {text.parameters}
          <EditOutlined onClick={onEdit} />
        </Space>
      ),
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "BMI",
      dataIndex: "bmi",
      key: "bmi",
    },
    {
      title: "OFC",
      dataIndex: "ofc",
      key: "ofc",
    },
  ];

  return (
    <Table
      className="custom-table"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  );
};

export default TableView;

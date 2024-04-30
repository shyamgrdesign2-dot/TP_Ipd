import React from "react";
import "./VaccineTable.scss";

const TableComponent = ({ dataSource, columns }) => {
  const groupDataByCommonIDs = (data) => {
    const groupedData = [];
    const idSet = new Set();

    data.forEach((item) => {
      if (!idSet.has(item.age)) {
        const group = data.filter((d) => d.age === item.age);
        groupedData.push(group);
        idSet.add(item.age);
      }
    });

    return groupedData;
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {columns.map((header, index) => (
          <th
            key={index}
            className="cell headerCellStyle"
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
    const groupedData = groupDataByCommonIDs(dataSource);

    return groupedData.map((group, groupIndex) => (
      <React.Fragment key={groupIndex}>
        {group.map((item, itemIndex) => (
          <tr key={itemIndex}>
            {itemIndex === 0 && (
              <td
                className="cell"
                style={{ verticalAlign: "middle" }}
                rowSpan={group.length}
              >
                {item.age}
              </td>
            )}
            <td className="cell">{item.name}</td>
            <td className="cell">{item.brand}</td>
            <td className="cell">{item.dueDate}</td>
            <td className="cell">{item.givenDate}</td>
            <td className="cell">{item.remarks}</td>
          </tr>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <table className="table">
        <thead>{renderTableHeader()}</thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default TableComponent;

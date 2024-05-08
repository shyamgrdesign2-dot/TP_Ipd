import React from "react";
import "./VaccineTable.scss";
import { dateFormatter } from "../../VaccinationHelper";

const VaccineTable = ({ dataSource, columns, isPreview }) => {
  const groupDataByCommonIDs = (data) => {
    const groupedData = [];
    const idSet = new Set();

    data?.forEach((item) => {
      if (!idSet.has(item.tvt_age)) {
        const group = data.filter((d) => d.tvt_age === item.tvt_age);
        groupedData.push(group);
        idSet.add(item.tvt_age);
      }
    });

    return groupedData;
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {columns?.map((header, index) => (
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
              <td className="cell" rowSpan={group.length}>
                {item.tvt_age}
              </td>
            )}
            <td className="cell">{item.tvac_name}</td>
            <td className="cell">{item.brand}</td>
            <td className="cell">
              <div className="dateCell">
                {item.dueDate}
                {((!item.tvp_given_date &&
                  new Date(item?.dueDate) < new Date()) ||
                  item?.dueDate < item.tvp_given_date) &&
                isPreview ? (
                  <span className="overDue">Over Due</span>
                ) : null}
              </div>
            </td>

            <td className="cell">
              <div className="dateCell">
                {dateFormatter(new Date(item.tvp_given_date))}
                {item.tvp_given_date && isPreview ? (
                  <span className="given">Given</span>
                ) : null}
              </div>
            </td>
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

export default VaccineTable;

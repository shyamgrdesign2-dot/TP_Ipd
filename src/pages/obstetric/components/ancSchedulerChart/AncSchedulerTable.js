const AncSchedulerTable = ({ dataSource, columns }) => {
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
    return dataSource.map((item, i) => (
      <tr key={i}>
        <td className="tcell">{item?.master?.name}</td>
        <td className="tcell">{item.dueDate ?? "-"}</td>
        <td className="tcell">{item.status ?? "-"}</td>
        <td className="tcell">{item.notes ?? "-"}</td>
      </tr>
    ));
  };

  return (
    <div className="tableViewContainer tableViewContainerForPrint">
      <table className="tableView">
        <thead>{renderTableHeader()}</thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default AncSchedulerTable;

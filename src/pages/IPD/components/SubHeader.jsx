import "./SubHeader.scss";

const SubHeader = ({ headerTitle }) => {
  return (
    <div className="sub-header">
      <div className="sub-header-content">{headerTitle}</div>
    </div>
  );
};

export default SubHeader;

const ReferenceRangeTooltip = ({ refRange }) => {
  if (!refRange) return null;

  return (
    <div className="reference-range-tooltip">
      <div className="reference-range-content">
        <div className="reference-range-title">Reference Range</div>
        <div className="reference-range-values">
          <div className="reference-range-item">
            <span className="reference-range-label">Male:</span>
            <span className="reference-range-value">
              {" "}
              {refRange.min} - {refRange.max}
            </span>
          </div>
          <div className="reference-range-item">
            <span className="reference-range-label">Female:</span>
            <span className="reference-range-value">
              {" "}
              {refRange.min} - {refRange.max}
            </span>
          </div>
        </div>
      </div>
      <div className="reference-range-separator"></div>
      <div className="reference-range-disclaimer">
        Disclaimer: This range is only for reference and may vary between
        patients based on different conditions
      </div>
    </div>
  );
};

export default ReferenceRangeTooltip;

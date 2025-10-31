import React from "react";
import { defaultIcons as icons } from "../../../../assets/images/icons/index.js";

const ConsultantNotesPreviewHeader = ({ dateText, timeText, onDownload, onPrint, onEdit }) => {
  return (
    <div className="cnp-group-header">
      <div className="cnp-gh-left">
        <img
          className="cnp-gh-calendar"
          src={icons.calendarDarkIcon}
          alt="Calendar"
        />
        <span className="cnp-gh-date">{dateText}</span>
        {timeText ? <span className="cnp-gh-time">{timeText}</span> : null}
      </div>
      <div className="cnp-gh-actions">
        <img
          className="cnp-gh-action"
          src={icons.downloadIcon}
          alt="Download"
          title="Download"
          onClick={onDownload}
        />
        <img
          className="cnp-gh-action"
          src={icons.printerIcon}
          alt="Print"
          title="Print"
          onClick={onPrint}
        />
        <img
          className="cnp-gh-action"
          src={icons.editIcon}
          alt="Edit"
          title="Edit"
          onClick={onEdit}
        />
      </div>
    </div>
  );
};

export default ConsultantNotesPreviewHeader;

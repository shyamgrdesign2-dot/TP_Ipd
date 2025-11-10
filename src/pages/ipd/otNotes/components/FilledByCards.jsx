import React from "react";
import "../styles.scss";
import moment from "moment";
import defaultIcons from "../../../../assets/images/indices";

const FilledByCards = ({
  updates,
  createdByName,
  createdByRole,
  createdAt,
}) => {
  if (
    (!Array.isArray(updates) || updates.length === 0) &&
    !createdByName &&
    !createdByRole &&
    !createdAt
  ) {
    return null;
  }

  return (
    <div className="filled-by-cards-container">
      <div className="filled-by-cards-list">
        {updates?.map((update, idx) => (
          <div className="ot-filled-by-card" key={idx}>
            <div className="ot-filled-abs-icon">
              <img src={defaultIcons.informedBy} alt="x" />
            </div>
            <div className="d-flex">
              <div className="ot-filled-left-section">
                <span className="filled-by-label">Last Filled By: </span>
                <span className="filled-by-value">
                  {update?.updatedByName || update?.updatedBy || "-"}
                </span>
                <span className="filled-by-label">
                  {update?.updatedBy
                    ? moment(update.updatedAt).format("DD MMM YYYY ( hh:mm A )")
                    : "-"}
                </span>
              </div>
              {createdByRole && (
                <div className="filled-by-card__role-badge">
                  <span className="filled-by-card__role-text">
                    {createdByRole || "-"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div
          className="ot-filled-by-card"
        >
          <div className="ot-filled-abs-icon">
            <img src={defaultIcons.informedBy} alt="x" />
          </div>
          <div className="d-flex">
            <div className="ot-filled-left-section">
              <span className="filled-by-label">Created By: </span>
              <span className="filled-by-value">{createdByName || "-"}</span>
              <span className="filled-by-label">
                {moment(createdAt).format("DD MMM YYYY ( hh:mm A )")}
              </span>
            </div>
            {
              // update?.updatedBy || TODO: INTEL - TO BE ADDED FROM BACKEND
              createdByRole && (
                <div className="filled-by-card__role-badge">
                  <span className="filled-by-card__role-text">
                    {
                      // update.updatedBy ||
                      createdByRole || "-"
                    }
                  </span>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilledByCards;

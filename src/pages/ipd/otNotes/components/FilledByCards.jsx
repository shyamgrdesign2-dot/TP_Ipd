import React from "react";
import "../styles.scss";
import moment from "moment";
import defaultIcons from "../../../../assets/images/indices";

const FilledByCards = ({ updates, createdByName, createdByRole }) => {
  if (!Array.isArray(updates) || updates.length === 0) {
    return null;
  }

  return (
    <div className="filled-by-cards-container">
      <div className="filled-by-cards-list">
        {updates.map((update, idx) => (
          <div className="ot-filled-by-card" key={idx}>
            <div className="ot-filled-abs-icon">
                <img src={defaultIcons.informedBy}  alt="x"/>
            </div>
            <div className="d-flex">
              <div className="ot-filled-left-section">
                <span className="filled-by-label">{idx === updates?.length-1 ? "" : "Last "}Filled By: </span>
                <span className="filled-by-value">
                  {update?.updatedByName || update?.updatedBy || createdByName || "-"}
                </span>
                <span className="filled-by-label">
                  {update?.updatedBy
                    ? moment(update.updatedAt).format("DD MMM YYYY ( hh:mm A )")
                    : "-"}
                </span>
              </div>
              {
                // update?.updatedBy || TODO: INTEL - TO BE ADDED FROM BACKEND
                createdByRole && (
                  <div className="filled-by-card__role-badge">
                    <span className="filled-by-card__role-text">
                      {
                        // update.updatedBy ||
                        createdByRole
                      }
                    </span>
                  </div>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilledByCards;

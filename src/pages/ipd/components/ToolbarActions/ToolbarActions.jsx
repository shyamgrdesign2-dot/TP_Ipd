import React from "react";
import "./styles.scss";
import { defaultIcons } from "../../../../assets/images/icons";

export default function ToolbarActions({
  showEditForm = true,
  selectedCount = 0,
  totalCount = 0,
  showSelectionCount = false,
  showAddToDischarge = false,
  onEdit = () => {},
  onAddToDischarge = () => {},
  onPrintPreview = () => {},
  onPrint = () => {},
  onSettings = () => {},
  onDownload = () => {},
}) {
  const BTN = {
    BIG: "big",
    SQUARE: "square",
  };

  const actions = [
    {
      id: "edit",
      label: "Edit Form",
      alt: "edit",
      type: BTN.BIG,
      onClick: onEdit,
      icon: defaultIcons.editPrimary,
      show: showEditForm,
    },
    {
      id: "discharge",
      label: "Add to Discharge Summary",
      alt: "add to discharge",
      type: BTN.BIG,
      onClick: onAddToDischarge,
      icon: defaultIcons.plusIcon || defaultIcons.editPrimary,
      show: showAddToDischarge,
    },
    {
      id: "preview",
      label: "Print Preview",
      alt: "preview",
      type: BTN.BIG,
      onClick: onPrintPreview,
      icon: defaultIcons.eyeIcon,
      show: true,
    },
    {
      id: "print",
      label: "",
      alt: "print",
      type: BTN.SQUARE,
      onClick: onPrint,
      icon: defaultIcons.printerIcon,
      show: true,
    },
    {
      id: "settings",
      label: "",
      alt: "settings",
      type: BTN.SQUARE,
      onClick: onSettings,
      icon: defaultIcons.settingsPrimaryIcon,
      show: true,
    },
    {
      id: "download",
      label: "",
      alt: "download",
      type: BTN.SQUARE,
      onClick: onDownload,
      icon: defaultIcons.downloadIcon,
      show: true,
    },
  ];

  const renderAction = (a) => {
    if (!a.show) return null;

    const isBig = a.type === BTN.BIG;
    return (
      <button
        key={a.id}
        type="button"
        className={`action-btn ${isBig ? "is-big" : "is-square"}`}
        onClick={a.onClick}
      >
        <span className="action-btn__icon">
          <img src={a.icon} alt={a.alt} />
        </span>
        {isBig && <span className="action-btn__label">{a.label}</span>}
      </button>
    );
  };

  return (
    <div className="toolbar">
      <div className="toolbar__inner">
        {/* Selection Count */}
        {showSelectionCount && (
          <div className="toolbar__selection-count">
            <span className="selection-text">
              ({selectedCount}/{totalCount} Selected)
            </span>
          </div>
        )}

        {/* Edit Form Button */}
        {showEditForm && (
          <>
            {renderAction(actions[0])}
            <span className="toolbar__divider" aria-hidden="true" />
          </>
        )}

        {/* Add to Discharge Summary Button */}
        {showAddToDischarge && (
          <>
            {renderAction(actions[1])}
            <span className="toolbar__divider" aria-hidden="true" />
          </>
        )}

        {/* Print Preview Button */}
        {renderAction(actions[2])}

        {/* Action Cluster */}
        <div className="toolbar__cluster">
          {renderAction(actions[3])}
          {renderAction(actions[4])}
        </div>

        <span className="toolbar__divider" aria-hidden="true" />

        {/* Download Button */}
        {renderAction(actions[5])}
      </div>
    </div>
  );
}

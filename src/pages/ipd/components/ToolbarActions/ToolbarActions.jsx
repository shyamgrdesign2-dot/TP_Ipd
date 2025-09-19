import React from "react";
import "./styles.scss";
import { defaultIcons } from "../../../../assets/images/icons";

export default function ToolbarActions({
  showEditForm = true,
  onEdit = () => {},
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
      icon: defaultIcons.editPrimary
    },
    {
      id: "preview",
      label: "Print Preview",
      alt: "preview",
      type: BTN.BIG,
      onClick: onPrintPreview,
      icon: defaultIcons.eyeIcon
    },
    { id: "print", label: "", alt: "print", type: BTN.SQUARE, onClick: onPrint, icon: defaultIcons.printerIcon },
    {
      id: "settings",
      label: "",
      alt: "settings",
      type: BTN.SQUARE,
      onClick: onSettings,
      icon: defaultIcons.settingsPrimaryIcon
    },
    {
      id: "download",
      label: "",
      alt: "download",
      type: BTN.SQUARE,
      onClick: onDownload,
      icon: defaultIcons.downloadIcon
    },
  ];

  const renderAction = a => {
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
        { showEditForm &&
          <>
            {renderAction(actions[0])}
            <span className="toolbar__divider" aria-hidden="true" />
          </>
        }

        {renderAction(actions[1])}

        <div className="toolbar__cluster">
          {renderAction(actions[2])}
          {renderAction(actions[3])}
        </div>

        <span className="toolbar__divider" aria-hidden="true" />

        {renderAction(actions[4])}
      </div>
    </div>
  );
}

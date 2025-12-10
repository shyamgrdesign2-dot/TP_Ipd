import React from "react";
import { Dropdown } from "antd";
import { defaultIcons } from "../../../../assets/images/icons";
import { BED_STATUS } from "../constants";

const BedActionsDropdown = ({
  record,
  onEdit,
  onBlock,
  onUnblock,
  onDelete,
}) => {
  const isBlocked =
    record.blocked === true || record.status === BED_STATUS.BLOCKED;

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "edit",
            label: "Edit Bed Name",
            onClick: () => onEdit(record),
          },
          {
            key: isBlocked ? "unblock" : "block",
            label: isBlocked ? "Unblock Bed" : "Block Bed",
            onClick: () => (isBlocked ? onUnblock(record) : onBlock(record)),
          },
          {
            key: "delete",
            label: "Delete Bed",
            onClick: () => onDelete(record),
          },
        ],
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button className="more-actions-button">
        <img src={defaultIcons.moreIcon} alt="More" />
      </button>
    </Dropdown>
  );
};

export default React.memo(BedActionsDropdown);

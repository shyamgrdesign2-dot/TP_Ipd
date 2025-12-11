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
  const isOccupied = record.status === BED_STATUS.OCCUPIED;

  // Build menu items conditionally
  const menuItems = [
    {
      key: "edit",
      label: "Edit Bed Name",
      onClick: () => onEdit(record),
    },
  ];

  // Only show block/unblock if bed is not occupied
  if (!isOccupied) {
    menuItems.push({
      key: isBlocked ? "unblock" : "block",
      label: isBlocked ? "Unblock Bed" : "Block Bed",
      onClick: () => (isBlocked ? onUnblock(record) : onBlock(record)),
    });
  }

  // Only show delete if bed is not occupied
  if (!isOccupied) {
    menuItems.push({
      key: "delete",
      label: "Delete Bed",
      onClick: () => onDelete(record),
    });
  }

  return (
    <Dropdown
      menu={{
        items: menuItems,
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

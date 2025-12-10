import { BED_STATUS } from "../constants";

/**
 * Calculate bed status from room data
 * @param {Object} room - Room/bed object from API
 * @returns {string} - Status string (available, occupied, or blocked)
 */
export const calculateBedStatus = (room) => {
  if (room.status) {
    return room.status;
  }

  if (room.blocked === true) {
    return BED_STATUS.BLOCKED;
  }

  if (room.available === true) {
    return BED_STATUS.AVAILABLE;
  }

  if (room.available === false) {
    return BED_STATUS.OCCUPIED;
  }

  // Default to available
  return BED_STATUS.AVAILABLE;
};

/**
 * Transform API response beds to component format
 * @param {Array} rooms - Array of room objects from API
 * @returns {Array} - Transformed bed objects
 */
export const transformBedsFromAPI = (rooms) => {
  return (rooms || []).map((room, index) => {
    const status = calculateBedStatus(room);

    return {
      id: room._id || room.id || `bed-${index}`,
      _id: room._id || room.id,
      roomId: room._id || room.id,
      name: room.roomName || room.name || room.bedName,
      bedName: room.roomName || room.name || room.bedName,
      status,
      available: status === BED_STATUS.AVAILABLE,
      blocked: status === BED_STATUS.BLOCKED,
      type: "bed",
      ...room, // Keep all other properties
    };
  });
};

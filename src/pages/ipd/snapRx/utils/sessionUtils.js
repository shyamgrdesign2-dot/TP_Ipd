/**
 * Utility functions for managing Snap RX session IDs
 */

/**
 * Generate a unique session ID
 * @returns {string} - Unique session ID
 */
export const generateSessionId = () => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `ipd_snaprx_${timestamp}_${randomPart}`;
};

/**
 * Store session ID in sessionStorage
 * @param {string} sessionId - Session ID to store
 */
export const storeSessionId = (sessionId) => {
  sessionStorage.setItem("ipd_snaprx_session_id", sessionId);
};

/**
 * Get session ID from sessionStorage
 * @returns {string|null} - Stored session ID or null
 */
export const getStoredSessionId = () => {
  return sessionStorage.getItem("ipd_snaprx_session_id");
};

/**
 * Clear session ID from sessionStorage
 */
export const clearSessionId = () => {
  sessionStorage.removeItem("ipd_snaprx_session_id");
};

/**
 * Get or create session ID
 * @returns {string} - Current or newly created session ID
 */
export const getOrCreateSessionId = () => {
  let sessionId = getStoredSessionId();
  if (!sessionId) {
    sessionId = generateSessionId();
    storeSessionId(sessionId);
  }
  return sessionId;
};

import React, { createContext, useContext, useEffect, useState } from "react";
import { getOrCreateSessionId, clearSessionId } from "../utils/sessionUtils";

const IPDSnapRxSessionContext = createContext();

export const IPDSnapRxSessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [hasUploadedFiles, setHasUploadedFiles] = useState(false);

  useEffect(() => {
    const currentSessionId = getOrCreateSessionId();
    setSessionId(currentSessionId);
  }, []);

  const refreshSessionId = () => {
    clearSessionId();
    const newSessionId = getOrCreateSessionId();
    setSessionId(newSessionId);
    return newSessionId;
  };

  const value = {
    sessionId,
    refreshSessionId,
    hasUploadedFiles,
    setHasUploadedFiles,
  };

  return (
    <IPDSnapRxSessionContext.Provider value={value}>
      {children}
    </IPDSnapRxSessionContext.Provider>
  );
};

export const useIPDSnapRxSession = () => {
  const context = useContext(IPDSnapRxSessionContext);
  if (!context) {
    throw new Error(
      "useIPDSnapRxSession must be used within a IPDSnapRxSessionProvider"
    );
  }
  return context;
};

import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import patientsActiveIcon from "../../../assets/images/all-patients-active.svg";
import { defaultIcons } from "../../../assets/images/dischargeSummaryIcons";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";

function IPDNavbar() {
  const [showIframe, setShowIframe] = useState(false);
  const [currentProxyIndex, setCurrentProxyIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  
  // Multiple proxy options to try
  const proxyOptions = [
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://cors-anywhere.herokuapp.com/${url}`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => url // Direct URL as last resort
  ];
  
  const handleTestingIframe = () => {
    setShowIframe(true);
    setCurrentProxyIndex(0);
    setIsLoading(true);
    setError(null);
  };

  const closeIframe = () => {
    setShowIframe(false);
    setCurrentProxyIndex(0);
    setIsLoading(true);
    setError(null);
  };

  const tryNextProxy = useCallback(() => {
    if (currentProxyIndex < proxyOptions.length - 1) {
      setCurrentProxyIndex(currentProxyIndex + 1);
      setIsLoading(true);
      setError(null);
    } else {
      setError('All proxy options failed. The external site cannot be loaded in an iframe.');
      setIsLoading(false);
    }
  }, [currentProxyIndex, proxyOptions.length]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    console.log(`Proxy ${currentProxyIndex} failed, trying next...`);
    tryNextProxy();
  };

  useEffect(() => {
    if (showIframe && iframeRef.current) {
      // Set a timeout to try next proxy if current one doesn't load
      const timeout = setTimeout(() => {
        if (isLoading) {
          tryNextProxy();
        }
      }, 10000); // 10 seconds timeout
      
      return () => clearTimeout(timeout);
    }
  }, [showIframe, currentProxyIndex, isLoading, tryNextProxy]);

  if (showIframe) {
    let token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
    console.log("intel ==> token", token);
    
    // Use the token from localStorage if available, otherwise fallback to hardcoded
    const finalToken = token || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkb2N0b3JfdW5pcXVlX2lkIjoiMmNBS2U5RlVidkdSSnROIiwibW9iaWxlX25vIjoiOTc0MjYzOTk1OCIsInBhdGllbnRfdW5pcXVlX2lkIjoiIiwiYXBwb2ludG1lbnRfaWQiOiIiLCJjbGluaWNfaWQiOiIzNjgiLCJobV9idXNpbmVzc19pZCI6Ijc1NDgxMTcxMzQzODc3MyIsImV4cCI6MTc2MTgyNjI4OX0.-7BZa1PZKpXdBQRvrDXU-ol6bOgBB9zbfHbDvopFxGE";
    const originalUrl = `https://pm-uat-dhspl-2.tatvacare.in/login_tatvacare_dr.php?type=1&token=${finalToken}&module=ipd`;
    const currentUrl = proxyOptions[currentProxyIndex](originalUrl);
    
    return (
      <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Close button */}
        <button
          onClick={closeIframe}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10001,
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          ×
        </button>
        
        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div>Loading TatvaCare...</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Trying proxy {currentProxyIndex + 1} of {proxyOptions.length}
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            textAlign: 'center',
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ffcdd2',
            maxWidth: '80%'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Unable to Load Content</div>
            <div style={{ fontSize: '14px' }}>{error}</div>
            <button
              onClick={() => window.open(originalUrl, '_blank')}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Open in Browser
            </button>
          </div>
        )}
        
        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          title="TatvaCare"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
          style={{
            display: error ? "none" : "block",
            width: "100%",
            height: "100%",
            border: 'none'
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    );
  }

  return (
    <div className="SidebarDoctor">
      <div>
        <NavLink onClick={closeIframe} to="/ipd/inPatients" replace={true}>
          {({ isActive }) => (
            <>
              <img
                src={patientsActiveIcon}
                alt="InPatients"
                style={{
                  filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                }}
              />
              <div className="mt-1 px-2">
                <div className={isActive ? "text-primary" : ""}>InPatients</div>
              </div>
            </>
          )}
        </NavLink>
      </div>

      <div>
        <NavLink onClick={closeIframe} to="/ipd/dischargedPatients" replace={true}>
          {({ isActive }) => (
            <>
              <img
                src={
                  isActive
                    ? defaultIcons.dischargedPatientsPc
                    : defaultIcons.dischargedPatientsOutline
                }
                alt="Discharged Patients"
              />
              <div className="mt-1 px-2">
                <div className={isActive ? "text-primary" : ""}>
                  Discharged Patients
                </div>
              </div>
            </>
          )}
        </NavLink>
      </div>
      <div>
        <NavLink onClick={handleTestingIframe} to="#" replace={true}>
          {({ isActive }) => (
            <>
              <img
                src={
                  isActive
                    ? defaultIcons.dischargedPatientsPc
                    : defaultIcons.dischargedPatientsOutline
                }
                alt="testIframe"
              />
              <div className="mt-1 px-2">
                <div className={isActive ? "text-primary" : ""}>
                  TESTING IFRAME
                </div>
              </div>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}

export default React.memo(IPDNavbar);

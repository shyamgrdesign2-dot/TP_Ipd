import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Form, Spin } from "antd";
import "./Onboarding.scss";
import abdmLogo from "../../../assets/images/abdm-logo.svg";
import nhaLogo from "../../../assets/images/nha-logo.svg";
import leftGroup from "../../../assets/images/onboard-page-icons/Left-Group.svg";
import MicrosoftPartner from "../../../assets/images/onboard-page-icons/microsoft.png";
import rightGroup from "../../../assets/images/onboard-page-icons/Right-Group.svg";
import { validateUser, checkPediaExists } from "../../auth/authService";
import { getUtmParams } from "../../../components/userOnboarding/services/userDataService";
import { detectOperatingSystem } from "../../../utils/utils";

const SignUp = ({ onViewChange, isLoginFlow, mobileNumber: initialMobileNumber }) => {
  const [mobileNumber, setMobileNumber] = useState(initialMobileNumber || "");
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [primaryBtnLoading, setPrimaryBtnLoading] = useState(false);
  const [secondaryBtnLoading, setSecondaryBtnLoading] = useState(false);
  const [isFromCampaign, setIsFromCampaign] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  // const [initialLoading, setInitialLoading] = useState(true);
  const [captchaVisible, setCaptchaVisible] = useState(false);
  // Get UTM params
  const utm = getUtmParams();
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Function to check if captcha is actually visible
  const checkCaptchaVisibility = () => {
    const captchaElement = document.getElementById('captch-id');
    if (!captchaElement) return false;

    // Check if captcha element has children
    if (captchaElement.children.length === 0) return false;

    // Check for hCaptcha iframe specifically
    const hCaptchaIframe = captchaElement.querySelector('iframe[src*="hcaptcha.com"]');
    if (hCaptchaIframe) {
      // Check if iframe is visible and has proper dimensions
      const rect = hCaptchaIframe.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && 
                       rect.top >= 0 && rect.left >= 0 &&
                       rect.bottom <= window.innerHeight && 
                       rect.right <= window.innerWidth;
      
      // Also check if iframe is not hidden by CSS
      const computedStyle = window.getComputedStyle(hCaptchaIframe);
      const isNotHidden = computedStyle.display !== 'none' && 
                         computedStyle.visibility !== 'hidden' &&
                         computedStyle.opacity !== '0';
      
      return isVisible && isNotHidden;
    }

    // Check for MSG91 captcha elements
    const msg91Elements = captchaElement.querySelector('msg91-otp-provider') || 
                         captchaElement.querySelector('[data-msg91]') ||
                         captchaElement.querySelector('.msg91-captcha');
    
    if (msg91Elements) {
      const rect = msg91Elements.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }

    // Fallback: check if any child element is visible
    for (let child of captchaElement.children) {
      const rect = child.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return true;
      }
    }

    return false;
  };

  // Function to wait for captcha visibility with polling
  const waitForCaptchaVisibility = () => {
    let attempts = 0;
    const maxAttempts = 30; // 15 seconds with 500ms intervals
    const interval = 500;

    const checkInterval = setInterval(() => {
      attempts++;
      
      if (checkCaptchaVisibility()) {
        clearInterval(checkInterval);
        setCaptchaVisible(true);
        console.log('Captcha is now visible');
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        // Fallback: set as visible even if not detected
        setCaptchaVisible(true);
        console.log('Captcha visibility timeout - proceeding anyway');
      }
    }, interval);

    return checkInterval;
  };

  useEffect(() => {
    // MSG91 Integration
    window.isMSG91Active = true;
    const scriptId = "msg91-otp-script";
    
    const initializeCaptcha = () => {
      if (window.initSendOTP && window.isMSG91Active) {
        const configuration = {
          widgetId: "346b79686352303336343033",
          tokenAuth: "365375TaYB4FU32WrR67443055P1",
          captchaRenderId: "captch-id",
          exposeMethods: true,
          success: (data) => {
            console.log('success response', data);
          },
          failure: (error) => {
            console.error("OTP Verification Failed:", error);
          },
        };
        
        try {
          window.initSendOTP(configuration);
          setScriptLoaded(true);
          
          // Start checking for captcha visibility after initialization
          setTimeout(() => {
            waitForCaptchaVisibility();
          }, 400); // Wait 1 second after initialization before checking visibility
          
        } catch (error) {
          console.error("Error initializing captcha:", error);
        }
      }
    };

    // Check if script already exists
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      initializeCaptcha();
      return;
    }

    // Load MSG91 script with retry mechanism
    const loadScript = async () => {
      try {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://control.msg91.com/app/assets/otp-provider/otp-provider.js";
        script.async = true;

        // Promise-based script loading
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = () => {
            setTimeout(() => {
              initializeCaptcha();
              resolve();
            },0);
          };
          script.onerror = () => reject(new Error("Script load failed"));
        });

        document.body.appendChild(script);
        await loadPromise;
      } catch (error) {
        console.error("Error loading MSG91 script:", error);
      }
    };

    loadScript();

    return () => {
      // Cleanup function
      if (window.isMSG91Active) {
        window.isMSG91Active = false;
        
        // Remove the MSG91 provider element if it exists
        const msg91Provider = document.querySelector('msg91-otp-provider');
        if (msg91Provider) {
          try {
            if (msg91Provider.disconnectedCallback) {
              msg91Provider.disconnectedCallback();
            }
            msg91Provider.remove();
          } catch (e) {
            console.error('Error removing MSG91 provider:', e);
          }
        }

        // Remove the script
        const script = document.getElementById(scriptId);
        if (script) {
          document.body.removeChild(script);
        }

        // Reset captcha container
        const captchaElement = document.getElementById('captch-id');
        if (captchaElement) {
          while (captchaElement.firstChild) {
            captchaElement.removeChild(captchaElement.firstChild);
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const campaign = searchParams.get("utm_campaign");
    setIsFromCampaign(!!campaign);
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setInitialLoading(false);
  //   }, 1500);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleGetStarted = async () => {
    if (!scriptLoaded) {
      setError("OTP service is initializing. Please try again in a moment.");
      setErrorType("captcha");
      return;
    }

    if(!isCaptchaVerified()){
      setError("Please complete the captcha verification to proceed.");
      setErrorType("captcha");
      return;
    }

    try {
      setIsButtonDisabled(true);
      setPrimaryBtnLoading(true);

      // First check user status
      const response = isLoginFlow ? await validateUser(mobileNumber) : await checkPediaExists({mbl_no: `91${mobileNumber}`});

      const { message } = isLoginFlow ? response : response.data;

      switch (message) {
        case "Doctor exists!":
        case "User exists":
          // For campaign URLs or login flow, proceed with OTP
          
          setIsFromCampaign(false);
          if (isFromCampaign || !isLoginFlow) {
            setErrorType("inputFiled");
            // Clear UTM params from URL before redirecting
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.delete("utm_source");
            currentUrl.searchParams.delete("utm_campaign");
            currentUrl.searchParams.delete("utm_medium");
            currentUrl.searchParams.delete("utm_content");
            currentUrl.searchParams.delete("utm_term");
            window.history.replaceState({}, '', currentUrl.toString());
            
            setError(
              <>
                Looks like this account already exists. Please{' '}
                <span 
                  onClick={() => {
                    onViewChange("loginOTP", mobileNumber, true);
                    focusInput();
                    setError(null);
                    setErrorType(null);
                  }}
                  className="login-link"
                >
                 Sign in
                </span>
              </>
            );
          }
          else if (window.sendOtp) {
            // moengage event for login via OTP
            window.Moengage.track_event('TP_NewLoginFlow_Login_With_OTP', {
              mobile: "91" + mobileNumber,
              utm_campaign: utm.utm_campaign ?? 'NA',
              utm_source: utm.utm_source ?? 'NA',
              utm_medium: utm.utm_medium ?? 'NA',
              utm_content: utm.utm_content ?? 'NA',
              utm_term: utm.utm_term ?? 'NA',
              operating_system: detectOperatingSystem(),
              is_marketing: Object.values(utm).some(value => value && value.length > 0),
            });

            window.sendOtp(
              `91${mobileNumber}`,
              (data) => {
                if (data.type === "success"){
                  // moengage event for OTP sent
                  window.Moengage.track_event('TP_NewLoginFlow_Login_with_OTP_Success', {
                    mobile: "91" + mobileNumber,
                    utm_campaign: utm.utm_campaign ?? 'NA',
                    utm_source: utm.utm_source ?? 'NA',
                    utm_medium: utm.utm_medium ?? 'NA',
                    utm_content: utm.utm_content ?? 'NA',
                    utm_term: utm.utm_term ?? 'NA',
                    operating_system: detectOperatingSystem(),
                    is_marketing: Object.values(utm).some(value => value && value.length > 0),
                  });
                  onViewChange("verifyOTP", mobileNumber, true , "", false,data.message);
                }
                // else{
                //   setError("Failed to send OTP. Please try again.");
                //   setErrorType("captcha");
                //   setIsButtonDisabled(false);
                // }
              },
              (error) => {
                setError("Failed to send OTP. Please try again.");
                setErrorType("captcha");
                setIsButtonDisabled(false);
              }
            );
          }
          break;

        case "Doctor does not exists!":
        case "Doctor not onboarded":
        case "User does not exists":
          if (isLoginFlow) {
            setError(
              <>
                User does not exist. Please{' '}
                <span 
                  onClick={() => {
                    onViewChange("signup", mobileNumber, false);
                    focusInput();
                    setError(null);
                    setErrorType(null);
                  }}
                  className="login-link"
                >
                  sign up
                </span>
                {' '}
              </>
            );
            setErrorType("inputFiled");
          } else {
            // Proceed with signup flow
            if (window.sendOtp) {

              window.Moengage.track_event('TP_NewLoginFlow_GetStarted', {
                  mobile: "91" + mobileNumber,
                  utm_campaign: utm.utm_campaign ?? 'NA',
                  utm_source: utm.utm_source ?? 'NA',
                  utm_medium: utm.utm_medium ?? 'NA',
                  utm_content: utm.utm_content ?? 'NA',
                  utm_term: utm.utm_term ?? 'NA',
                  operating_system: detectOperatingSystem(),
                  is_marketing: Object.values(utm).some(value => value && value.length > 0),
                });
              window.sendOtp(
                `91${mobileNumber}`,
                (data) => {
                  // console.log(data,"data")
                  if (data.type === "success"){
                    // moengage event for OTP sent for signup
                    window.Moengage.track_event('TP_NewLoginFlow_SignupOTP_sucess', {
                      mobile: "91" + mobileNumber,
                      utm_campaign: utm.utm_campaign ?? 'NA',
                      utm_source: utm.utm_source ?? 'NA',
                      utm_medium: utm.utm_medium ?? 'NA',
                      utm_content: utm.utm_content ?? 'NA',
                      utm_term: utm.utm_term ?? 'NA',
                      operating_system: detectOperatingSystem(),
                      is_marketing: Object.values(utm).some(value => value && value.length > 0),
                    });
                    onViewChange("verifyOTP", mobileNumber, false, "", false, data.message);
                  }
                },
                (error) => {
                  setError("Failed to send OTP. Please try again.");
                  setErrorType("captcha");
                  setIsButtonDisabled(false);
                }
              );
            }
          }
          break;

        case "Doctor is inactive":
          setError(
            "Your account has been locked by Admin. Please contact support@tatvacare.in/9974042363"
          );
          setErrorType("inputFiled");
          break;

        default:
          setError("Unexpected response from server.");
          setErrorType("captcha");
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      setError("Something went wrong. Please try again.");
      setErrorType("captcha");
    } finally {
      setPrimaryBtnLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const handleLoginPassword = async () => {

    try {
      setIsButtonDisabled(true);
      setSecondaryBtnLoading(true);

      const response = await validateUser(mobileNumber);
      const { message, passwordSet } = response;

      if (message === "Doctor exists!") {

        if (passwordSet) {   
          // moengage event for login via password
          window.Moengage.track_event('TP_NewLoginFlow_Login_With_Password', {
            mobile: "91" + mobileNumber,
            operating_system: detectOperatingSystem(),
            utm_campaign: utm.utm_campaign ?? 'NA',
            utm_source: utm.utm_source ?? 'NA',
            utm_medium: utm.utm_medium ?? 'NA',
            utm_content: utm.utm_content ?? 'NA',
            utm_term: utm.utm_term ?? 'NA',
            is_marketing: Object.values(utm).some(value => value && value.length > 0),
          });

          // If password is set, go to verify password page
          onViewChange("verifyPassword", mobileNumber, true);
        } else {
          // If password is not set, go to set password page
          // setError("Please set up your password first");
          setTimeout(() => {
            onViewChange("setPassword", mobileNumber, true);
          }, 2000);
        }
      } else if (message === "Doctor does not exists!" || message === "Doctor not onboarded") {
        setError(
          <>
            User does not exist. Please{' '}
            <span 
              onClick={() => {
                onViewChange("signup", mobileNumber, false);
                focusInput();
                setError(null);
                setErrorType(null);
              }}
              className="login-link"
            >
              sign up
            </span>
            {' '}
          </>
        );
        setErrorType("inputFiled");
      } else{
        // case "Doctor is inactive":
        setError(
          "Your account has been locked by Admin. Please contact support@tatvacare.in/9974042363"
        );
        setErrorType("inputFiled");
          // break;
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSecondaryBtnLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const prefixSelector = (
    <div className="country-code">
      <span className="phone-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M18.3334 14.1V16.6C18.3344 16.8321 18.2868 17.0618 18.1938 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1112 17.2006 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9523 17.988 11.4892 17.1118 9.32504 15.7083C7.31674 14.4289 5.60345 12.7156 4.32421 10.7073C2.91671 8.53435 2.04042 6.05916 1.76671 3.48334C1.74586 3.25287 1.77335 3.02061 1.84725 2.80138C1.92115 2.58216 2.03976 2.38079 2.19576 2.21014C2.35176 2.03949 2.54172 1.90341 2.75337 1.81052C2.96502 1.71763 3.19374 1.66995 3.42504 1.67001H5.92504C6.32959 1.66582 6.72172 1.80649 7.02812 2.06897C7.33452 2.33145 7.53506 2.69783 7.59171 3.10001C7.69753 3.90007 7.89422 4.68562 8.17504 5.44168C8.28723 5.73995 8.31137 6.06411 8.24504 6.37574C8.17871 6.68737 8.02518 6.97342 7.80004 7.20001L6.74171 8.25834C7.92807 10.3446 9.65539 12.072 11.7417 13.2583L12.8 12.2C13.0266 11.9749 13.3127 11.8213 13.6243 11.755C13.9359 11.6887 14.2601 11.7128 14.5584 11.825C15.3144 12.1058 16.1 12.3025 16.9 12.4083C17.3075 12.4654 17.6784 12.6697 17.9426 12.9812C18.2068 13.2928 18.3463 13.6906 18.3334 14.1Z"
            stroke="#667085"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="prefix">+91</span>
    </div>
  );

  // Add validation function
  const isValidMobileNumber = (number) => {
    return number.length === 10;
  };

  // Update mobile number handler with validation
  const handleMobileNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 10) {
      // Limit to 10 digits
      setMobileNumber(value);
      setError(null);
    }
  };

  // Add this helper function
  const isCaptchaVerified = () => {
    return window.isCaptchaVerified ? window.isCaptchaVerified() : false;
  };

  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h2 style={{ margin: "1rem 0 3rem 0" }}>
          {isLoginFlow ? (
            "Welcome Doctor!"
          ) : (
            <>
              Sign up{!isFromCampaign ? "!" : ` for `}<span className={isFromCampaign ? "gradient-text" : ""}>{isFromCampaign && "free"}</span>
            </>
          )}
        </h2>

        <Form name="signup" className="signup-form">
          <Form.Item
            name="phone"
            className="phone-form-item"
          >
            <label htmlFor="phone" className="onboard-fields-label">
              Mobile Number
            </label>
            <Input
              autoFocus
              ref={inputRef}
              addonBefore={prefixSelector}
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              className="mobile-input phone-input"
              bordered={false}
              maxLength={10}
              type="tel"
              autoComplete="tel-national"
              id="phone"
            />
            {error && errorType === "inputFiled" && <div className="error-message" style={{marginTop: "0.5rem"}}>{error}</div>}
          </Form.Item>

          <div className="captcha-wrapper" style={{margin: "1.5rem 0 1rem 0"}}>
            <div id="captch-id" className="captcha-container">
              {!captchaVisible && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '80px',
                  padding: '1rem'
                }}>
                  <Spin size="medium" />
                  <span style={{ marginLeft: '8px', color: '#666' }}>
                    Loading captcha...
                  </span>
                </div>
              )}
            </div>
          </div>

          {error && errorType === "captcha" && <div className="error-message">{error}</div>}

          <Button
            type="primary"
            loading={primaryBtnLoading}
            onClick={handleGetStarted}
            className="get-started-btn"
            disabled={(!isValidMobileNumber(mobileNumber) || isButtonDisabled)}
          >
            {isLoginFlow ? "Login via OTP" : "Get Started"}
          </Button>

          {isLoginFlow ? <div className="divider">or</div> : <div style={{height: "2rem"}}></div>}

          {isLoginFlow && (
            <Button
              type="primary"
              loading={secondaryBtnLoading}
              onClick={handleLoginPassword}
              className="get-started-btn-secondary"
              disabled={(!isValidMobileNumber(mobileNumber) || isButtonDisabled)}
            >
              Login via Password
            </Button>
          )}

          <div className="login-link">
            {isLoginFlow ? (
              <>
                Not an existing user?{" "}
                <span onClick={() => {
                  onViewChange("signup");
                  focusInput();
                }}>
                  <>Signup {isFromCampaign && <>for free</>}</>
                </span>
              </>
            ) : (
              <>
                Already have an Account?{" "}
                <span onClick={() => {
                  onViewChange("loginOTP");
                  focusInput();
                }}>Sign In</span>
              </>
            )}
          </div>
        </Form>
      </div>
      <div className="partners-section">
        <img src={leftGroup} alt="Lines Group" className="left-lines-group" />
        <img src={abdmLogo} alt="ABDM" className="abdm-logo" />
        <img src={nhaLogo} alt="NHA" className="nha-logo" />
        <img
          src={MicrosoftPartner}
          alt="Microsoft Partner"
          className="google-partner"
        />
        <img src={rightGroup} alt="Lines Group" className="right-lines-group" />
      </div>
    </div>
  );
};

export default SignUp;

import React, { useState } from 'react';
import Carousel from './OnboardCarousel';
import SignUp from './SignUp';
// import LoginOTP from './components/LoginOTP';
// import LoginPassword from './components/LoginPassword';
// import ResetPassword from './components/ResetPassword';
import './Onboarding.scss';
import SetPassword from './SetPassword';
import LoginPassword from './LoginPassword';
import VerifyOTP from './VerifyOTP';

const Onboarding = () => {
  const [view, setView] = useState('signup');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoginFlow, setIsLoginFlow] = useState(false);

  const handleViewChange = (newView, number = '') => {
    setView(newView);
    if (newView === 'loginOTP') {
      setIsLoginFlow(true);
    } else if (newView === 'signup') {
      setIsLoginFlow(false);
    }
    if (number) {
      setMobileNumber(number);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-left">
        <Carousel />
      </div>
      <div className="onboarding-right">
        {(view === 'signup' || view === 'loginOTP') && (
          <SignUp 
            onViewChange={handleViewChange} 
            isLoginFlow={isLoginFlow}
            mobileNumber={mobileNumber}
          />
        )}
        {view === 'verifyOTP' && (
          <VerifyOTP 
            onViewChange={handleViewChange}
            mobileNumber={mobileNumber}
            isLoginFlow={isLoginFlow}
          />
        )}
        {view === 'setPassword' && (
          <SetPassword 
            onViewChange={handleViewChange}
            mobileNumber={mobileNumber}
          />
        )}
        {view === 'loginPassword' && (
          <LoginPassword 
            onViewChange={handleViewChange}
            mobileNumber={mobileNumber}
          />
        )}
        {/* {view === 'loginOTP' && <LoginOTP onViewChange={setView} />}
        {view === 'loginPassword' && <LoginPassword onViewChange={setView} />}
        {view === 'resetPassword' && <ResetPassword onViewChange={setView} />} */}
      </div>
    </div>
  );
};

export default Onboarding;
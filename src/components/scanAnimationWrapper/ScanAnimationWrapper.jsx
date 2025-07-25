import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import React from 'react'
import greenScanRx from '../../assets/lotties/greenScanRx.lottie';
import './ScanAnimationWrapper.scss';

const ScanAnimationWrapper = ({children, ...props}) => {
  const { width = '125%', height= 'auto' } = props; // TODO: get the trimmed lottie from design
  return (
    <>
    <div className='scan-animation-wrapper'>
      <div
      className='lottie-style'
      style={{width, height}}
      >
      <DotLottieReact
        src={greenScanRx}
        loop
        autoplay
        style={{height: '100%', width: '100%' }}
      />
      </div>
      <div className="child-content">
        {children}
      </div>
    </div>
    </>
  )
}

export default ScanAnimationWrapper
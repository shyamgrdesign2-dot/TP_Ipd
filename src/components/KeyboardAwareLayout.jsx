import React, { useEffect, useRef } from 'react';
import { useKeyboardAware } from '../hooks/useKeyboardAware';
import '../assets/scss/mobile-keyboard-fix.scss';

/**
 * KeyboardAwareLayout - A wrapper component that handles virtual keyboard behavior
 * Keeps the header visible and manages content scrolling when keyboard appears
 */
const KeyboardAwareLayout = ({ 
  children, 
  header, 
  className = '',
  headerHeight = 60,
  autoScrollToFocusedInput = true 
}) => {
  const { isKeyboardOpen, keyboardHeight, getHeaderStyle, scrollIntoViewWithKeyboard } = useKeyboardAware();
  const contentRef = useRef(null);

  // Auto-scroll to focused input when keyboard opens
  useEffect(() => {
    if (!autoScrollToFocusedInput) return;

    const handleFocusIn = (event) => {
      const target = event.target;
      
      // Check if the focused element is an input field
      if (target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        target.closest('.ant-input') || // Ant Design inputs
        target.closest('.ant-select') // Ant Design selects
      )) {
        // Small delay to ensure keyboard animation starts
        setTimeout(() => {
          scrollIntoViewWithKeyboard(target, { block: 'center' });
        }, 300);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [scrollIntoViewWithKeyboard, autoScrollToFocusedInput]);

  const containerStyle = {
    height: '100vh',
    height: '100dvh', // Dynamic viewport height for newer browsers
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    ...getHeaderStyle(),
    height: `${headerHeight}px`,
    flexShrink: 0,
    width: '100%',
    left: 0,
    right: 0,
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    paddingTop: isKeyboardOpen ? '10px' : '0px',
    paddingBottom: isKeyboardOpen ? `${Math.max(keyboardHeight + 20, 20)}px` : '20px',
    // Smooth transition when keyboard opens/closes
    transition: 'padding 0.3s ease-in-out',
  };

  return (
    <div className={`keyboard-aware-layout ${className}`} style={containerStyle}>
      {/* Fixed Header */}
      <div style={headerStyle} className="keyboard-aware-header">
        {header}
      </div>
      
      {/* Scrollable Content */}
      <div 
        ref={contentRef}
        style={contentStyle}
        className="keyboard-aware-content"
      >
        <div style={{ paddingTop: `${headerHeight}px` }}>
          {children}
        </div>
      </div>
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          Keyboard: {isKeyboardOpen ? 'Open' : 'Closed'} | Height: {keyboardHeight}px
        </div>
      )}
    </div>
  );
};

export default KeyboardAwareLayout;

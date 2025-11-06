import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to handle virtual keyboard behavior on mobile/tablet devices
 * Returns keyboard state and utilities to manage UI during keyboard open/close
 */
export const useKeyboardAware = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const updateKeyboardState = useCallback(() => {
    // Use Visual Viewport API if available (modern browsers)
    if (window.visualViewport) {
      const viewport = window.visualViewport;
      const keyboardHeight = window.innerHeight - viewport.height;
      
      setKeyboardHeight(keyboardHeight);
      setIsKeyboardOpen(keyboardHeight > 0);
      setViewportHeight(viewport.height);
    } else {
      // Fallback for older browsers
      const currentHeight = window.innerHeight;
      const heightDifference = viewportHeight - currentHeight;
      
      // Assume keyboard is open if height difference is significant
      const isOpen = heightDifference > 150; // Adjust threshold as needed
      
      setKeyboardHeight(isOpen ? heightDifference : 0);
      setIsKeyboardOpen(isOpen);
    }
  }, [viewportHeight]);

  useEffect(() => {
    // Store initial viewport height
    setViewportHeight(window.innerHeight);

    if (window.visualViewport) {
      // Modern approach using Visual Viewport API
      window.visualViewport.addEventListener('resize', updateKeyboardState);
      
      return () => {
        window.visualViewport.removeEventListener('resize', updateKeyboardState);
      };
    } else {
      // Fallback for older browsers
      const handleResize = () => {
        updateKeyboardState();
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [updateKeyboardState]);

  // Utility function to scroll element into view accounting for keyboard
  const scrollIntoViewWithKeyboard = useCallback((element, options = {}) => {
    if (!element) return;

    const defaultOptions = {
      behavior: 'smooth',
      block: 'center',
      ...options
    };

    // If keyboard is open, adjust scroll position
    if (isKeyboardOpen) {
      const rect = element.getBoundingClientRect();
      const availableHeight = window.innerHeight - keyboardHeight;
      
      // Check if element is hidden by keyboard
      if (rect.bottom > availableHeight) {
        element.scrollIntoView(defaultOptions);
      }
    } else {
      element.scrollIntoView(defaultOptions);
    }
  }, [isKeyboardOpen, keyboardHeight]);

  // Utility to adjust fixed header position
  const getHeaderStyle = useCallback(() => {
    if (isKeyboardOpen && window.visualViewport) {
      return {
        position: 'fixed',
        top: `${window.visualViewport.offsetTop}px`,
        zIndex: 1000,
      };
    }
    return {
      position: 'fixed',
      top: 0,
      zIndex: 1000,
    };
  }, [isKeyboardOpen]);

  return {
    keyboardHeight,
    isKeyboardOpen,
    viewportHeight,
    scrollIntoViewWithKeyboard,
    getHeaderStyle,
  };
};

import { useState, useEffect } from 'react';

// Compute responsive state once so mobile devices render the right layout immediately
const getScreenState = () => {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }

  const width = window.innerWidth;
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024
  };
};

export const useResponsive = () => {
  const [screenState, setScreenState] = useState(getScreenState);

  useEffect(() => {
    const handleResize = () => setScreenState(getScreenState());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...screenState,
    isMobileOrTablet: screenState.isMobile || screenState.isTablet
  };
};

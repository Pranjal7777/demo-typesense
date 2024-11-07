// import { useEffect, useState } from "react";

import { useEffect, useState } from 'react';

export function useNewWindowScroll(threshold = 10 /* value in px */) {
  const [isBelowThreshold, setIsBelowThreshold] = useState(false);

  // console.log(isBelowThreshold); 
  
  const handleScroll = () => {
    if (window.scrollY > threshold) {
      setIsBelowThreshold(true);
    } else {
      setIsBelowThreshold(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isBelowThreshold;
}

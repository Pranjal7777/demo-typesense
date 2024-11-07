import { useEffect, useState } from 'react';



export function useWindowScroll(){
    
  const [windowScroll, setWindowScroll] = useState(0);

  const handleScroll = () => {
    setWindowScroll(window.scrollY);
  };
    
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
      
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
    
  return windowScroll;
}
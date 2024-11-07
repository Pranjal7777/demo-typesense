import { useEffect, useState } from 'react';



export function useWindowResize(){
    
  const [windowResize, setWindowResize] = useState(4000);

  const listenResizeEvent = () => {
    setWindowResize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', listenResizeEvent);
      
    return () => {
      window.removeEventListener('resize', listenResizeEvent);
    };
  }, []);
    
  return windowResize;
}
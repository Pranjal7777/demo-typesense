import React, { useEffect, useRef } from 'react';

const Drawer: React.FC<{
  minHeight?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ minHeight = '60vh', isOpen, onClose, children, title }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('touchstart', handleTouchOutside);
    } else {
      document.removeEventListener('touchstart', handleTouchOutside);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [isOpen, onClose]);
  
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity z-[199] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        ref={drawerRef}
        className={`bg-white dark:bg-bg-secondary-dark fixed bottom-0 w-full z-100 !rounded-t-3xl overflow-hidden transition-transform transform z-[200] shadow-[0px_0px_15px_rgba(0,0,0,0.1)]
           ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ minHeight, maxHeight: '90%' }}
      >
        <div className="drawer drawer-bottom flex flex-col min-h-[60%] w-full " data-drawer="true" id="drawer_1">
          <div className="flex items-center justify-between p-5 ">
            <h3 className="text-lg text-center mx-auto font-semibold dark:text-white">{title}</h3>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;

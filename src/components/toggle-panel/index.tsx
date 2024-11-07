import React, { useState } from 'react';
import Button from '@/components/ui/button';

type PannelInfo = {
    label: string;
    content: React.ReactNode;
};

type TogglePanelProps = {
    panelInfo: PannelInfo[];
};

const TogglePanel: React.FC<TogglePanelProps> = ({ panelInfo }) => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  const handleButtonClick = (index: number) => {
    setSelectedButtonIndex(index);
  };

  if (!panelInfo || panelInfo.length === 0) {
    return (
      <div className="error-container">
                Error: No Components provided.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-text-primary-light dark:text-bg-primary-dark">
      <div className='flex gap-10'>
        {panelInfo.map((btnLabel, index) => (
          <div key={index}>
            <Button
              onClick={() => handleButtonClick(index)}
              buttonType='septenary'
              className={`${selectedButtonIndex === index ? 'p-3 lg:p-auto border-b-[2.5px] border-brand-color font-semibold text-text-primary-light dark:text-text-primary-dark' : ''}`}
            >
              {btnLabel.label}
            </Button>
          </div>
        ))}
      </div>
          
      <div  className={'w-full'}>
        {panelInfo[selectedButtonIndex].content}
      </div>
          
    </div>
  );
};

export default TogglePanel;

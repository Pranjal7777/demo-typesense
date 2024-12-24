import React from 'react';

type ConditionCardProps = {
  name: string;
  isSelected: boolean;
  onClick: () =>  void;
};

const ConditionCard: React.FC<ConditionCardProps> = ({ name, isSelected, onClick }) => {

  return (
    <div
      onClick={onClick}
      role='button' tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`border cursor-pointer ${isSelected ? 'text-brand-color bg-brand-color-hover dark:bg-[#221D2A] border-brand-color' : 'border-[#DBDBDB] dark:border-[#3D3B45]'}    w-[109px] h-[45px] rounded-[4px] flex  justify-center `}
    >
      <div className="items-center justify-center flex w-full" tabIndex={0} role='button' onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); 
          onClick();
        }
      }}>
        <p className="text-xs font-medium">{name}</p>
      </div>
    </div>
  );
};

export default ConditionCard;

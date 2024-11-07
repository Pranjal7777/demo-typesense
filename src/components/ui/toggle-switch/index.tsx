import React, { FC } from 'react';

export type Props = {
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggleSwitch: FC<Props> = ({ isEnabled, setIsEnabled }) => {
  return (
    <label className="flex items-center cursor-pointer rtl:scale-x-[-1]">
      {/* The actual checkbox */}
      <input type="checkbox" className="sr-only" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
      {/* The switch */}
      <div className="relative">
        {/* The track */}
        <div
          className={`w-14 h-8 rounded-full transition-colors ${
            isEnabled ? 'bg-brand-color' : 'bg-bg-quaternary-light dark:bg-bg-senary-dark'
          }`}
        />
        {/* The knob */}
        <div
          className={`absolute top-0.5 left-[5%] w-7 h-7 bg-bg-secondary-light dark:bg-bg-septenary-dark rounded-full transition-transform ${
            isEnabled ? 'translate-x-[80%]' : ''
          }`}
        />
      </div>
    </label>
  );
};

export default ToggleSwitch;

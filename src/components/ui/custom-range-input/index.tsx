import React, { useState, ChangeEvent, useEffect } from 'react';

type CustomRangeInputProps = {
  handleDistance: (value: string) => void;
  presentValue: string | undefined;
  value: number;
  setValue: (value: number) => void;
};

const CustomRangeInput: React.FC<CustomRangeInputProps> = ({ 
  handleDistance, 
  presentValue,
  value,
  setValue 
}) => {
  const steps: (number | string)[] = [50, 100, 150, 250, 500, 750, 1000, 1500, 'Country', 'Country', 'World'];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    handleDistance(steps[newValue].toString());
  };

  useEffect(() => {
    const defaultValue = presentValue ?? 'Country';
    const index = steps.findIndex((step) => step.toString() === defaultValue.toString());
    setValue(index >= 0 ? index : 8); // Default to index 8 ('Country') if not found
  }, [presentValue, setValue]);

  const calculateLeftPosition = () => {
    const min = 0;
    const max = steps.length - 1;
    const percent = (value - min) / (max - min);
    const thumbWidth = -25; // Adjust this based on your thumb width in pixels
    const trackWidth = 100; // Adjust this based on your track width in pixels

    // Calculate the left position, considering thumb width and track width
    return `calc(${percent * trackWidth}% + (${percent - 0.5}) * ${thumbWidth}px)`;
  };

  return (
    <div className="relative w-full my-8">
      <input
        type="range"
        min="0"
        max={steps.length - 1}
        step="1"
        value={value}
        onChange={handleChange}
        className="w-full appearance-none bg-transparent custom-range"
      />
      <div className="flex justify-between absolute w-[95%] top-5 left-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: `${(index / (steps.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
          >
            {/* <div className="w-px h-2.5 bg-[#ddd] absolute top-[-12px]" /> */}
            <div className="text-xs mt-1">{index % 2 === 0 || step === 'World' ? step : null}</div>
            {/* <div className="text-xs mt-1">{step}</div> */}
          </div>
        ))}
      </div>
      <div
        className="absolute top-[-34px] text-white bg-brand-color py-1 px-3 rounded text-xs shadow-sm transform -translate-x-1/2 min-w-[50px] text-center"
        style={{ left: calculateLeftPosition() }}
      >
        <p className="w-0 h-0 border-solid border-t-brand-color border-l-transparent border-r-transparent border-b-transparent border-t-[14px] border-r-[8px] border-b-0 border-l-[8px] transform rotate-0 absolute bottom-[-10px] left-1/2 -translate-x-1/2"></p>
        {steps[value]}
      </div>
      <style jsx>
        {`
          .custom-range::-webkit-slider-runnable-track {
            width: 100%; 
            height: 8px;
            cursor: pointer;
            background: #ddd; /* Background color of the track */
            border-radius: 5px;
            border: 0;
            position: relative;
          }

          .custom-range::-webkit-slider-thumb {
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--brand-color); 
            cursor: pointer;
            margin-top: -8px;
            border: none;
          }

          .custom-range::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--brand-color);
            cursor: pointer;
            border: none;
          }

          .custom-range::-ms-track {
            width: 100%;
            cursor: pointer;
            background: transparent;
            border-color: transparent;
            color: transparent;
          }

          .custom-range::-ms-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: var(--brand-color); 
            cursor: pointer;
            border: none;
          }

          .custom-range::-ms-fill-lower {
            background: #ddd; /* Background color of the track */
            border-radius: 5px;
          }

          .custom-range::-ms-fill-upper {
            background: #ddd; /* Background color of the track */
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default CustomRangeInput;

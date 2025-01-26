import React from 'react';
import TextWrapper from '../text-wrapper';

type PriceTabProps = {
  inputFocus: string;
  price: number;
  currency: string;
  inputMax?: number;
  inputMin?: number;
  // eslint-disable-next-line no-unused-vars
  handlePriceInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  focus: string;
};

const PriceTab: React.FC<PriceTabProps> = ({
  handlePriceInputChange,
  inputFocus,
  price,
  currency,
  inputMax,
  inputMin,
  focus,
}) => {
  return (
    <div
      className={`flex items-center justify-center h-[45px] border border-[#3D3B45] max-w-[180px] w-full ${
        inputFocus === focus
          ? 'bg-brand-color-hover border-brand-color text-brand-color'
          : 'bg-white dark:bg-bg-primary-dark border-[#3D3B45]'
      }  rounded text-sm`}
    >
      <div className="flex items-center justify-center w-full">
        <TextWrapper
          className={`font-semibold ${
            inputFocus === focus ? '!text-brand-color' : '!text-text-primary-light dark:!text-text-secondary-light'
          }`}
        >
          {currency}
        </TextWrapper>
        <input
          type="number"
          name={inputFocus === focus ? 'input-min' : 'input-max'}
          className="bg-transparent w-12  outline-none pl-1 font-medium text-center"
          value={price}
          onChange={handlePriceInputChange}
          disabled={true}
          min={inputMin}
          max={inputMax}
        />
      </div>
    </div>
  );
};

export default PriceTab;

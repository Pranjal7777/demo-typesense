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
          ? 'bg-[#F7F5FC] dark:bg-[#221D2A] border-[#6d3ec1] text-[#6D3EC1]'
          : 'bg-white dark:bg-bg-primary-dark border-[#3D3B45]'
      }  rounded text-sm`}
    >
      <TextWrapper
        className={`font-semibold flex justify-end w-[80%] ${
          inputFocus === focus ? '!text-[#6D3EC1]' : '!text-text-primary-light dark:!text-text-secondary-light'
        }`}
      >
        {currency}
      </TextWrapper>
      <span className="w-full pl-1 font-medium">
        $
        <input
          type="number"
          name={inputFocus === focus ? 'input-min' : 'input-max'}
          className="bg-transparent w-9 outline-none"
          value={price}
          onChange={handlePriceInputChange}
          min={inputMin}
          max={inputMax}
        />
      </span>
    </div>
  );
};

export default PriceTab;

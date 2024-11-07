import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
// import Model from '../Model/Model';
import { gumletLoader } from '@/lib/gumlet';

const contryName = ['india', 'australia', 'germany', 'america', 'uk'];

const Location = () => {
  // const [visible, setVisible] = useState(true);

  const [options, setOptions] = useState<string[]>([]);

  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => setOptions(contryName), []);

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const [rangeKM, setRangeKM] = useState(50);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRangeKM(Number(e.target.value));
  };

  return (
    // <Model visible={visible} setVisible={setVisible}>
    <div className="flex flex-col items-center gap-5 justify-center mx-[40px] my-[28px] overflow-y-scroll">
      <div className="relative w-full flex items-center justify-center">
        <div className="absolute left-0 font-medium text-lg text-brand-color">Reset</div>
        <div className="text-[28px] font-bold">Set Location</div>
      </div>

      <div className=" flex flex-col relative w-full">
        <div className="font-normal text-sm">Country</div>
        <select
          className="px-2 mt-2 border-2 border-bg-tertiary-light h-[44px] rounded outline-none"
          name="countries"
          id="countries"
          value={selectedOption}
          onChange={(e) => handleDropdownChange(e)}
        >
          {options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <div>
            Location{' '}
          <span className="font-normal text-sm">
            {' '}
              &#40;use <span>l</span> of current location&#41;
          </span>{' '}
        </div>
        <div className="mt-2 relative flex items-center justify-center">
          <input
            className="px-2 w-full border-2 border-bg-tertiary-light h-[44px] rounded outline-none"
            type="search"
            value={'Bangalore, Karnataka'}
          />
          <Image
            className="absolute right-12 hover:scale-105 cursor-pointer"
            width={17}
            height={17}
            src={IMAGES.LOCATION_TARGET_ICON}
            alt="location target"
            loader={gumletLoader}
          />
        </div>
      </div>

      <div className=""> or </div>

      <div className="w-full">
        <div className="font-normal text-sm">Enter Zip/Postal Code</div>
        <div className="mt-2">
          <input
            className="px-2  w-full border-2 border-bg-tertiary-light h-[44px] rounded outline-none"
            type="number"
            maxLength={6}
          />
        </div>
      </div>

      <div className=" w-full">
        <div className="flex justify-between font-normal text-sm">
          <span>Distance(M) </span>
          <span>{rangeKM} KM</span>
        </div>
        <input
          className="h-[4px] w-full"
          type="range"
          id="vol"
          name="distance"
          min="0"
          max="100"
          step={10}
          value={rangeKM}
          onChange={(e) => handleRangeChange(e)}
        />
        <div className=" w-full flex justify-between text-xs px-1">
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
      </div>

      <div className="w-full">
        <button className="mt-2 bg-brand-color px-2 text-secondary  w-full border-2 border-bg-tertiary-light h-[44px] rounded outline-none">
            Apply
        </button>
      </div>
    </div>
    // </Model>
  );
};

export default Location;

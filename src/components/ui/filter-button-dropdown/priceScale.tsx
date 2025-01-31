import React, { useMemo, useState } from 'react'
import PriceTab from '../price-tab';
import TextWrapper from '../text-wrapper';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import { useRouter } from 'next/router';

type PriceScaleProps = {
  initialMinPrice: number;
  initialMaxPrice: number;
  allSelectedValues: string | string[];
  onChange?: (selected: string | string[]) => void;
  currencySymbol? : string;
};

const PriceScale = ({initialMinPrice,initialMaxPrice,allSelectedValues,onChange, currencySymbol}:PriceScaleProps) => {
    const router = useRouter();
     const [selectedFilters, setSelectedFilters] = useState({
       price: '',
     });
     const [minimumPrice, maximumPrice] = useMemo(() => {
        if (typeof allSelectedValues === 'string' && allSelectedValues !== '') {
          const [min, max] = allSelectedValues.replace(/\$/g, '').split(' - ');
          return [parseInt(min), parseInt(max)];
        } else {
          return [initialMinPrice, initialMaxPrice];
        }
     }, [allSelectedValues, initialMinPrice, initialMaxPrice]);

     const [inputFocus, setInputFocus] = useState('');
    const [minPrice, setMinPrice] = useState<number>(minimumPrice);
    const [maxPrice, setMaxPrice] = useState<number>(maximumPrice);

     const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = e.target;
       if (name === 'input-min') {
         setMinPrice(parseInt(value));
         setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
       } else if (name === 'input-max') {
         setMaxPrice(parseInt(value));
         setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
       }
     };

       const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target;
         
         if (name === 'range-min') {
           setMinPrice(parseInt(value));
           setInputFocus('min');
        //    setSelectedFilters({ ...selectedFilters, price: `$${parseInt(value)} - $${maxPrice}` });
         } else if (name === 'range-max') {
           setMaxPrice(parseInt(value));
           setInputFocus('max');
        //    setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${parseInt(value)}` });
         }
       };
       const handleApplyFilters = () => {
        setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
        onChange?.(`$${minPrice} - $${maxPrice}`);
       }
       const handleClearFilters = () => {
        setSelectedFilters({ ...selectedFilters, price: '' });
        setMinPrice(initialMinPrice);
        setMaxPrice(initialMaxPrice);
        onChange?.('');
        const { price, ...remainingQuery } = router.query;
        if(price){  
          router.replace(
            {
              pathname: router.pathname,
            query: remainingQuery,
          },
          undefined,
          { shallow: true } 
        );
        }
       }
       
  return (
    <>
      <style>
        {`
        .range-input input {
            top: 0px;          
          }
        `}
      </style>
      <div className="price mt-[24px]">
        {/* <TextWrapper className="text-base font-semibold leading-6">{filter.name || 'Price'}</TextWrapper> */}
        <div className="w-full">
          <div className="flex w-full gap-4 justify-between items-center">
            <PriceTab
              currency={currencySymbol || 'USD'}
              focus="min"
              handlePriceInputChange={handlePriceInputChange}
              inputFocus={inputFocus}
              price={minPrice}
            />
            <PriceTab
              currency={currencySymbol || 'USD'}
              focus="max"
              handlePriceInputChange={handlePriceInputChange}
              inputFocus={inputFocus}
              price={maxPrice}
            />
          </div>
          <div className="slider mt-[24px] h-[5px] relative bg-[#DBDBDB] dark:bg-[#242424] rounded-sm">
            <div
              className={`progress h-full absolute rounded-sm bg-brand-color`}
              style={{
                width: `${((maxPrice - minPrice) / (initialMaxPrice - initialMinPrice)) * 100}%`,
                left: `${((minPrice - initialMinPrice) / (initialMaxPrice - initialMinPrice)) * 100}%`,
              }}
            />
            <div className="range-input absolute w-full ">
              <input
                type="range"
                name="range-min"
                className="range-min absolute left-0"
                min={initialMinPrice}
                max={initialMaxPrice}
                value={minPrice}
                step={(initialMaxPrice - initialMinPrice) / 100}
                onChange={handleRangeInputChange}
              />
              <input
                type="range"
                name="range-max"
                className="range-max absolute right-0"
                min={initialMinPrice}
                max={initialMaxPrice}
                value={maxPrice}
                step={(initialMaxPrice - initialMinPrice) / 100}
                onChange={handleRangeInputChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8 gap-2">
            <Button
            buttonType={BUTTON_TYPE_CLASSES.senary}
            className='w-fit h-fit py-[5px] px-8 rounded-[4px] mb-0 font-medium'
            onClick={handleClearFilters}
            >
                Clear
            </Button>
            <Button
            buttonType={BUTTON_TYPE_CLASSES.primary}
            className='w-fit h-fit py-[5px] px-8 rounded-[4px] mb-0 font-medium'
            onClick={handleApplyFilters}
            >
                Apply
            </Button>
        </div>
      </div>
    </>
  );
}

export default PriceScale;

// import React, { useState } from 'react';

// interface RangeSliderProps {
//   min: number;
//   max: number;
//   step?: number;
//   onChange?: (values: { min: number; max: number }) => void;
// }

// const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step = 1, onChange }) => {
//   const [values, setValues] = useState({ min, max });

//   const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.min(Number(event.target.value), values.max);
//     setValues((prev) => {
//       const updated = { ...prev, min: newValue };
//       onChange?.(updated);
//       return updated;
//     });
//   };

//   const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.max(Number(event.target.value), values.min);
//     setValues((prev) => {
//       const updated = { ...prev, max: newValue };
//       onChange?.(updated);
//       return updated;
//     });
//   };

//   return (
//     <div className="w-full p-4">
//       <div className="relative mb-5">
//         {/* Minimum slider */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={values.min}
//           onChange={handleMinChange}
//           className="absolute w-full z-20 appearance-none bg-transparent pointer-events-auto"
//         />
//         {/* Maximum slider */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={values.max}
//           onChange={handleMaxChange}
//           className="absolute w-full z-10 appearance-none bg-transparent pointer-events-auto"
//         />
//         {/* Slider track */}
//         <div className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gray-300 w-full rounded"></div>
//         {/* Active range track */}
//         <div
//           className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-green-500 rounded"
//           style={{
//             left: `${((values.min - min) / (max - min)) * 100}%`,
//             right: `${100 - ((values.max - min) / (max - min)) * 100}%`,
//           }}
//         ></div>
//       </div>
//       {/* Labels */}
//       <div className="flex justify-between">
//         <div className="text-green-600 font-bold">USD {values.min}</div>
//         <div className="text-green-600 font-bold">USD {values.max}</div>
//       </div>
//     </div>
//   );
// };

// export default RangeSlider;

// import React, { useState } from 'react';

// interface RangeSliderProps {
//   min: number;
//   max: number;
//   step?: number;
//   onChange?: (values: { min: number; max: number }) => void;
// }

// const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step = 1, onChange }) => {
//   const [values, setValues] = useState({ min, max });

//   const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.min(Number(event.target.value), values.max);
//     setValues((prev) => {
//       const updated = { ...prev, min: newValue };
//       onChange?.(updated);
//       return updated;
//     });
//   };

//   const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.max(Number(event.target.value), values.min);
//     setValues((prev) => {
//       const updated = { ...prev, max: newValue };
//       onChange?.(updated);
//       return updated;
//     });
//   };

//   return (
//     <div className="w-full flex flex-col items-center">
//       {/* Range track container */}
//       <div className="relative w-full h-2 bg-gray-300 rounded-full">
//         {/* Active track */}
//         <div
//           className="absolute h-2 bg-green-500 rounded-full"
//           style={{
//             left: `${((values.min - min) / (max - min)) * 100}%`,
//             right: `${100 - ((values.max - min) / (max - min)) * 100}%`,
//           }}
//         ></div>
//         {/* Minimum slider thumb */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={values.min}
//           onChange={handleMinChange}
//           className="absolute w-full appearance-none pointer-events-auto z-10 slider-thumb"
//           style={{
//             left: `${((values.min - min) / (max - min)) * 100}%`,
//           }}
//         />
//         {/* Maximum slider thumb */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={values.max}
//           onChange={handleMaxChange}
//           className="absolute w-full appearance-none pointer-events-auto z-10 slider-thumb"
//           style={{
//             right: `${((values.max - min) / (max - min)) * 100}%`,
//           }}
//         />
//       </div>

//       {/* Values below the slider */}
//       <div className="flex justify-between w-full mt-4">
//         <span className="text-green-500 font-medium">USD {values.min}</span>
//         <span className="text-green-500 font-medium">USD {values.max}</span>
//       </div>
//     </div>
//   );
// };

// export default RangeSlider;



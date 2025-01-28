import { appClsx } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import DownArrowIcon from '../../../../public/assets/svg/down-arrow-icon';
import { useTheme } from '@/hooks/theme';
import PriceScale from './priceScale';

type Option = {
  label: string;
  value: string;
};

type FilterButtonDropdownProps = {
  title?: string;
  options?: Option[];
  type: 'radio' | 'checkbox' | 'scale';
  onChange?: (selected: string | string[]) => void;
  containerClassName?: string;
  buttonClassName?: string;
  dropdownContainerClassName?: string;
  optionClassName?: string;
  inputClassName?: string;
  allSelectedValues?: string | string[];
  currencySymbol?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  isActive?: boolean;
};

const FilterButtonDropdown: React.FC<FilterButtonDropdownProps> = ({
  title,
  options,
  type,
  onChange,
  containerClassName,
  buttonClassName,
  dropdownContainerClassName,
  optionClassName,
  inputClassName,
  allSelectedValues = type === 'checkbox' ? [] : '',
  currencySymbol,
  initialMinPrice,
  initialMaxPrice,
  isActive,
}) => {
  const { theme } = useTheme();
  const [selectedValues, setSelectedValues] = useState<string[] | string>(allSelectedValues);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const onFilterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelection = (value: string) => {
    if (type === 'checkbox') {
      const newValues = selectedValues as string[];
      const updatedValues = newValues.includes(value)
        ? newValues.filter((item) => item !== value)
        : [...newValues, value];
      setSelectedValues(updatedValues);
      onChange && onChange(updatedValues);
    } else {
      setSelectedValues(value);
      onChange && onChange(value);
    }
  };

  return (
    <>
      <div
        className={appClsx(
          'relative px-4 py-[10px] text-center dark:text-text-primary-dark text-text-primary-light bg-white dark:bg-bg-primary-dark border rounded-3xl',
          `${isActive ? 'bg-brand-color-hover dark:bg-brand-color-hover border-brand-color' : ''}`,
          containerClassName
        )}
      >
        <div
          onClick={onFilterClick}
          className={appClsx(
            'w-full h-full cursor-pointer flex items-center gap-2 dark:text-text-primary-dark text-text-primary-light',
            `${isActive ? 'text-brand-color' : ''}`,
            buttonClassName
          )}
        >
          {title}
          <DownArrowIcon
            primaryColor={isActive ? 'var(--brand-color)' : theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
            className={appClsx('cursor-pointer', isOpen ? 'rotate-180' : '')}
          />
        </div>
        {isOpen && (
          <div
            style={{ zIndex: 9999 }}
            ref={dropdownRef}
            className={appClsx(
              'absolute w-[298px]  rounded-md  shadow-lg p-5 flex flex-col gap-4 z-50 top-12 left-0 bg-white dark:bg-bg-nonary-dark',
              dropdownContainerClassName
            )}
          >
            {/* <div className="w-full"> */}
            {(type== 'checkbox' || type== 'radio') && options?.map((option) => (
              <label key={option.value} className={appClsx('flex items-center gap-2', optionClassName)}>
                <input
                  className={appClsx('cursor-pointer', inputClassName)}
                  type={type}
                  name={type === 'radio' ? 'dropdown-group' : undefined}
                  value={option.value}
                  checked={
                    type === 'checkbox'
                      ? (selectedValues as string[]).includes(option.value)
                      : selectedValues === option.value
                  }
                  onChange={() => handleSelection(option.value)}
                />
                {option.label}
              </label>
            ))}
            {type== 'scale' && <PriceScale allSelectedValues={allSelectedValues} onChange={onChange} initialMinPrice={initialMinPrice || 0} initialMaxPrice={initialMaxPrice || 0} currencySymbol={currencySymbol} />}
            {/* </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterButtonDropdown;

////////////////////////////////////////////////////////

// import { appClsx } from '@/lib/utils';
// import React, { useEffect, useRef, useState } from 'react';
// import DownArrowIcon from '../../../../public/assets/svg/down-arrow-icon';

// type Option = {
//   label: string;
//   value: string;
// };

// type FilterButtonDropdownProps = {
//   title: string;
//   options: Option[];
//   type: 'radio' | 'checkbox';
//   onChange?: (selected: string | string[]) => void;
// };

// const FilterButtonDropdown: React.FC<FilterButtonDropdownProps> = ({ title, options, type, onChange }) => {
//   const [selectedValues, setSelectedValues] = useState<string[] | string>(type === 'checkbox' ? [] : '');
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const onFilterClick = () => {
//     if (buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       setDropdownPosition({
//         top: rect.bottom , // Position dropdown below the button
//         left: rect.left, // Align dropdown with the button
//       });
//     }
//     setIsOpen(!isOpen);
//   };

//   const handleSelection = (value: string) => {
//     if (type === 'checkbox') {
//       const newValues = selectedValues as string[];
//       const updatedValues = newValues.includes(value)
//         ? newValues.filter((item) => item !== value)
//         : [...newValues, value];
//       setSelectedValues(updatedValues);
//       onChange && onChange(updatedValues);
//     } else {
//       setSelectedValues(value);
//       onChange && onChange(value);
//     }
//   };

//   return (
//     <>
//       <div
//         ref={buttonRef}
//         className={appClsx('relative px-4 py-[10px] text-center bg-white border rounded-3xl')}
//         onClick={onFilterClick}
//       >
//         <div className="w-full h-full cursor-pointer flex items-center gap-2">
//           {title}
//           <DownArrowIcon className={appClsx('cursor-pointer', isOpen ? 'rotate-180' : '')} primaryColor="black" />
//         </div>
//       </div>
//       {isOpen && (
//         <div
//           ref={dropdownRef}
//           style={{
//             position: 'fixed',
//             top: dropdownPosition.top,
//             left: dropdownPosition.left,
//             zIndex: 9999,
//             width: '298px',
//           }}
//           className="rounded-md border p-5 flex flex-col gap-4 bg-white shadow-lg"
//         >
//           {options.map((option) => (
//             <label key={option.value} className="flex items-center gap-2">
//               <input
//                 type={type}
//                 name={type === 'radio' ? 'dropdown-group' : undefined}
//                 value={option.value}
//                 checked={
//                   type === 'checkbox'
//                     ? (selectedValues as string[]).includes(option.value)
//                     : selectedValues === option.value
//                 }
//                 onChange={() => handleSelection(option.value)}
//                 className=""
//               />
//               {option.label}
//             </label>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// export default FilterButtonDropdown;
////////////////////////////////

import React, { forwardRef } from 'react';
import RadioWidthLable from '../radio-width-lable';
import { appClsx } from '@/lib/utils';
type OptionType = {
  label: string;
  value: string;
};
type FilterPopupProps = {
  options: OptionType[];
  filterType: 'RADIO' | 'CHECKBOX';
  onSelectionChange: (selectedValues: string[]) => void;
  filterHeaderText?: string;
  filterHeaderTextClass?: string;
  containerClass?: string;
  filterLabelClass?: string;
  inputClass?: string;
  selectedValues: string[];
};
const FilterPopup = forwardRef<HTMLDivElement, FilterPopupProps>(({
  options,
  filterType,
  onSelectionChange,
  filterHeaderText = 'Filter',
  filterHeaderTextClass,
  containerClass,
  filterLabelClass,
  inputClass,
  selectedValues
}, ref) => {

  const handleSelectionChange = (value: string) => {
    if (filterType == 'RADIO') {
      onSelectionChange([value]);
    } else {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newValues);
    }
  };

  return (
    <div ref={ref} className={appClsx('filter-popup z-50 rounded-xl flex flex-col gap-5 p-5 w-[265px] text-text-primary-light dark:text-text-secondary-light bg-bg-septenary-light dark:bg-bg-nonary-dark absolute right-0 top-14', containerClass)}>
      <h3 className={appClsx(' text-lg font-semibold', filterHeaderTextClass)}>
        {filterHeaderText}
      </h3>
      {options.map((option) => (
        <>
          {filterType == 'RADIO' ? (
            <RadioWidthLable
            labelClassName={appClsx('text-sm font-medium dark:text-text-secondary-light', filterLabelClass)}
            inputClassName={inputClass}
              checked={selectedValues.includes(option.value)}
              value={option.value}
              id={option.label}
              label={option.label}
              name="filter"
              onChange={() => handleSelectionChange(option.value)}
            ></RadioWidthLable>
          ) : (
            <label className={appClsx('flex gap-3 items-center text-sm font-medium', filterLabelClass)} key={option.value}>
              <input
              className={appClsx('h-5 w-5 ', inputClass)}
                type={'checkbox'}
                name="filter"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleSelectionChange(option.value)}
              />
              {option.label}
            </label>
          )}
        </>
      ))}
    </div>
  );
});

export default FilterPopup;

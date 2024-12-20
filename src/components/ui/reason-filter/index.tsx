import React, { ChangeEvent, forwardRef } from 'react';
import { appClsx } from '@/lib/utils';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import Button from '../button';
type OptionType = {
  label: string;
  value: string;
};
type ReasonFilterProps = {
  options: OptionType[];
  onSelectionChange: (selectedValues: string[]) => void;
  filterHeaderText?: string;
  filterDescription?: string;
  filterHeaderTextClass?: string;
  filterDescriptionClass?: string;
  containerClass?: string;
  selectedValues: string[];
  iconClass?: string;
  iconSrc?: string;
  showOtherOption?: boolean;
  otherReason?: string;
  setOtherReason?: React.Dispatch<React.SetStateAction<string>>;
  otherReasonPlaceholder?: string;
  otherReasonClass?: string;
  optionClass?: string;
  error?: string;
  buttonText?: string;
  handleSubmit?: () => void;
  buttonClass?: string;
  buttonLoading?: boolean;
};
const ReasonFilter = forwardRef<HTMLDivElement, ReasonFilterProps>(
  (
    {
      options,
      onSelectionChange,
      filterHeaderText = 'Filter',
      filterHeaderTextClass,
      containerClass,
      filterDescription,
      filterDescriptionClass,
      selectedValues,
      iconClass,
      iconSrc,
      showOtherOption = false,
      otherReasonPlaceholder = 'Please specify the reason',
      otherReasonClass,
      otherReason,
      setOtherReason,
      optionClass,
      error,
      buttonText,
      handleSubmit,
      buttonClass,
      buttonLoading,
    },
    ref
  ) => {
    const handleSelectionChange = (value: string) => {
      onSelectionChange([value]);
    };
    const reasonOptions = showOtherOption ? [...options, { label: 'Other', value: 'Other' }] : options;
    const handleOtherReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setOtherReason?.(e.target.value);
    };

    return (
      <div
        ref={ref}
        className={appClsx('w-full text-text-secondary-dark dark:text-text-secondary-light', containerClass)}
      >
        <h3 className={appClsx(' text-lg font-semibold text-center mb-5', filterHeaderTextClass)}>
          {filterHeaderText}
        </h3>
        {filterDescription && <p className={appClsx("text-sm mb-2",filterDescriptionClass)}>{filterDescription}</p>}
        <div className="w-full flex flex-col gap-3 bg-white dark:bg-bg-nonary-dark">
          {reasonOptions.map((option) => (
            <div
              onClick={() => handleSelectionChange(option.value)}
              className={appClsx("text-sm w-full p-3 relative border rounded-[4px] dark:border-border-tertiary-dark border-border-tertiary-light cursor-pointer", optionClass)}
            >
              {option.label}
              {selectedValues.includes(option.value) && (
                <Image
                  src={iconSrc || IMAGES.ORDER_SUCCESS}
                  alt="tick-icon"
                  width={20}
                  height={20}
                  className={appClsx('absolute right-3 top-1/2 -translate-y-1/2', iconClass)}
                />
              )}
            </div>
          ))}
          {showOtherOption && selectedValues?.[0] == 'Other' && (
            <textarea
              onChange={handleOtherReasonChange}
              value={otherReason}
              placeholder={otherReasonPlaceholder}
              className={appClsx(
                'w-full resize-none h-[100px] outline-none dark:bg-bg-quinary-dark dark:text-text-primary-dark dark:border-border-tertiary-dark border-border-tertiary-light p-3 border rounded-[4px] text-sm',
                otherReasonClass
              )}
            ></textarea>
          )}
          {error && <p className="text-error text-sm">{error}</p>}
          <Button isLoading={buttonLoading} className={appClsx("mt-2 !mb-0 text-sm font-semibold",buttonClass)} onClick={handleSubmit}>{buttonText || 'Submit'}</Button>
        </div>
      </div>
    );
  }
);

export default ReasonFilter;

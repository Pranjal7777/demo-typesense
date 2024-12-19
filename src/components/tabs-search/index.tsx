import { appClsx } from '@/lib/utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import SearchIcon from '../../../public/assets/svg/search-icon';
import FilterIcon from '../../../public/assets/svg/filter-icon';
import FilterPopup from '../ui/filter-popup';
import { useTheme } from '@/hooks/theme';
import CloseIcon from '../../../public/assets/svg/close-icon';
type OptionType = {
  label: string;
  value: string;
};
type TabbedSearchProps = {
  tabs: string[];
  currenActiveTab: string;
  tabContainerClass?: string;
  tabItemWrapperClass?: string;
  tabItemClass?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  searchBoxClass?: string;
  searchIconClass?: string;
  searchInputClass?: string;
  isFilterInclude?: boolean;
  onTabChange: (tab: string) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterIconWrapperClass?: string;
  filterIconClass?: string;
  filterOptions?: OptionType[];
  filterType?: 'RADIO' | 'CHECKBOX';
  selectedFilters?: string[];
  onSelectionChange?: (selectedValues: string[]) => void;
  filterHeaderText?: string;
  filterHeaderTextClass?: string;
  filterContainerClass?: string;
  filterLabelClass?: string;
  inputClass?: string;
  clearIconClass?: string;
  showClearIcon?: boolean;
  onClearSearch?: () => void;

};

const TabbedSearch: FC<TabbedSearchProps> = ({
  tabs,
  onTabChange,
  onInputChange,
  searchValue,
  searchPlaceholder,
  currenActiveTab,
  tabItemWrapperClass,
  tabItemClass,
  tabContainerClass,
  searchBoxClass,
  searchIconClass,
  searchInputClass,
  isFilterInclude,
  filterType,
  filterIconWrapperClass,
  filterIconClass,
  filterOptions = [],
  selectedFilters,
  onSelectionChange,
  filterHeaderText,
  filterHeaderTextClass,
  filterContainerClass,
  filterLabelClass,
  inputClass,
  clearIconClass,
  showClearIcon,
  onClearSearch,
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const onFilterIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowFilterPopup(!showFilterPopup);
  };
  const popupRef = useRef<HTMLDivElement | null>(null);
  const filterIconRef = useRef<HTMLDivElement | null>(null);
  const {theme} = useTheme();

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node) && filterIconRef.current &&
    !filterIconRef.current.contains(event.target as Node)) {
      setShowFilterPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    onClearSearch?.();
  };

  return (
    <div className={appClsx(' relative flex flex-col-reverse gap-3 md:flex-row md:justify-between', tabContainerClass)}>
      <ul
        className={appClsx(
          'flex text-sm md:text-[16px] w-full md:w-auto gap-[20px] text-text-tertiary-light dark:text-text-tertiary-dark leading-[24px]',
          tabItemWrapperClass
        )}
      >
        {tabs.map((item, index) => (
          <li
            key={index}
            onClick={() => onTabChange(item)}
            tabIndex={0}
            role="button"
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTabChange(item);
              }
            }}
            className={appClsx(
              currenActiveTab === item
                ? 'text-text-secondary-dark dark:text-text-secondary-light font-semibold border-b-[3px] border-brand-color'
                : '',
              'flex justify-center px-[8px] py-[11px] w-[50%] md:w-auto',
              tabItemClass
            )}
          >
            {item}
          </li>
        ))}
      </ul>
      <div className={appClsx('flex gap-3')}>
        {searchValue != undefined && (
          <div
            className={appClsx(
              'search-box w-full min-w-[290px] relative md:max-w-[290px] h-10 md:h-11 rounded-lg md:rounded  flex gap-3 items-center px-[10px] bg-bg-septenary-light dark:bg-bg-quinary-dark',
              searchBoxClass
            )}
          >
            <SearchIcon primaryColor={theme ? '#FFF' : '#202020'} className={appClsx('h-[24px] w-[24px]', searchIconClass)} />
            <input
              value={searchValue}
              onChange={onInputChange}
              placeholder={searchPlaceholder || 'Search here'}
              type="text"
              className={appClsx('w-[100%] text-[14px] outline-none bg-bg-septenary-light dark:bg-bg-quinary-dark h-[100%]', searchInputClass)}
            />
            {showClearIcon && searchValue && <CloseIcon onClick={handleClearSearch} height='13px' width='13px' primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} className={appClsx('', clearIconClass)} />}
          </div>
        )}

        {isFilterInclude && (
          <div
          ref={filterIconRef}
            className={appClsx(
              'h-11 w-12 rounded bg-[#8080801a] dark:bg-bg-quinary-dark  flex justify-center items-center cursor-pointer',
              filterIconWrapperClass
            )}
          >
            <FilterIcon primaryColor={theme ? '#FFF' : '#202020'}  onClick={onFilterIconClick} className={appClsx('', filterIconClass)} />
          </div>
        )}
      </div>
      {showFilterPopup && onSelectionChange && (
        <FilterPopup
        ref = {popupRef}
        selectedValues={selectedFilters || []}
          containerClass={filterContainerClass}
          options={filterOptions}
          onSelectionChange={onSelectionChange}
          filterType={ filterType || "RADIO"}
          filterHeaderText = {filterHeaderText || 'Filter'}
          filterHeaderTextClass = {filterHeaderTextClass}
          filterLabelClass = {filterLabelClass}
          inputClass = {inputClass}
        />
      )}
    </div>
  );
};

export default TabbedSearch;

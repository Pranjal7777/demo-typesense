import { appClsx } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react'
import DownArrowIcon from '../../../../public/assets/svg/down-arrow-icon';
import { useTheme } from '@/hooks/theme';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Category } from '@/store/types';
import SearchBox from '@/components/typesense/SearchBox';
import NewSearchBox from '../search-box';
import SearchIcon from '../../../../public/assets/svg/search-icon';
import CloseIcon from '../../../../public/assets/svg/close-icon';
type CategoriesDropDownProps = {
  isActive: boolean;
  containerClassName?: string;
  buttonClassName?: string;
  title: string;
  dropdownContainerClassName?: string;
  onCategoryClick: ({categoryId, categoryTitle}: {categoryId: string, categoryTitle: string}) => void;
}
const CategoriesDropDown = ({ isActive, containerClassName, buttonClassName, title, dropdownContainerClassName, onCategoryClick}: CategoriesDropDownProps) => {
    const {theme} = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const { categories } = useSelector((state: RootState) => state.auth);
    console.log(categories, 'mirh categories');
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories?.data ||[]);
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const filtered = categories?.data?.filter((category: Category) => category.title.toLowerCase().includes(search.toLowerCase()));
        setFilteredCategories(filtered || []);
    }
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
        setIsOpen(!isOpen);
    }
    const onCategorySelect = (category: Category) => {
        onCategoryClick({ categoryId: category.id, categoryTitle: category.title });
        setIsOpen(false);
    }
  return (
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
          primaryColor={
            isActive ? 'var(--brand-color)' : theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'
          }
          className={appClsx('cursor-pointer', isOpen ? 'rotate-180' : '')}
        />
      </div>
      {isOpen && (
        <div
          style={{ zIndex: 9999 }}
          ref={dropdownRef}
          className={appClsx(
            'fixed w-screen h-screen mobile:inset-0 md:w-[298px] md:absolute md:h-fit md:rounded-md  shadow-lg p-5 pt-2  z-50 top-12 left-0 bg-white dark:bg-bg-nonary-dark',
            dropdownContainerClassName
          )}
        >
          <div className="flex justify-center items-center md:hidden relative my-4">
            <h4 className="text-lg font-semibold text-center w-full text-text-primary-light dark:text-text-primary-dark">
              All Categories
            </h4>
            <CloseIcon
              height="16px"
              width="16px"
              primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
              className="cursor-pointer absolute right-0"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="w-full sticky z-50 bg-white dark:bg-bg-nonary-dark top-0 left-0 flex items-center gap-2 text-left cursor-pointer border border-border-tertiary-light dark:border-border-senary-light rounded-md p-2">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search categories"
              className="w-full bg-transparent"
              onChange={onSearchChange}
            />
          </div>
          {
            <div className="w-full flex flex-col mt-2 overflow-y-auto md:max-h-[230px]">
              {filteredCategories?.map((category: any) => (
                <div
                  onClick={() => onCategorySelect(category)}
                  className="w-full text-left flex items-center cursor-pointer border-b md:border-none border-border-tertiary-light dark:border-border-senary-light py-4"
                  key={category.id}
                >
                  {category.title}
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
}

export default CategoriesDropDown;
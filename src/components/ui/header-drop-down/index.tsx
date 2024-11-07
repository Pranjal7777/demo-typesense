import React, { FC, useRef, useState } from 'react';
import { categories } from '@/store/types/categories-types';
import { HydrationGuard } from '../hydration-guard';
import { ControlledMenu, MenuButton, MenuItem, SubMenu, useHover } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { useTheme } from '@/hooks/theme';
import { useRouter } from 'next/router';
import { routeToCategories } from '@/store/utils/route-helper';

export type Props = {
  item: categories;
};

const HeaderDropdown: FC<Props> = ({ item }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setOpen] = useState(false);
  const { anchorProps, hoverProps } = useHover(isOpen, setOpen);
  const theme = useTheme();
  const currTheme = theme.theme;
  const router = useRouter();

  const categoryRoute = (categoryId: string) => {
    router.push(routeToCategories({ category: { id: categoryId } }));
  };
  const subCategoryRoute = (subCategoryId: string) => {
    router.push(routeToCategories({ subCategory: { id: subCategoryId } }));
  };
  const subSubCategoryRoute = (subSubCategoryId: string) => {
    router.push(routeToCategories({ subSubCategory: { id: subSubCategoryId } }));
  };

  return (
    <>
      <HydrationGuard>
        <li className="relative sm:hidden md:flex px-3 md:text-sm sm:text-[12px] h-full flex">
          <div ref={ref} {...anchorProps}>
            <MenuButton onClick={() => categoryRoute(item._id)} className=" truncate h-full flex items-center">
              {item.title as string}
            </MenuButton>
          </div>

          <ControlledMenu
            {...hoverProps}
            state={isOpen ? 'open' : 'closed'}
            anchorRef={ref}
            onClose={() => setOpen(false)}
            overflow="auto"
            setDownOverflow
            position="anchor"
          >
            {item.child?.map((sub, index) => (
              <div key={index} className="relative ">
                {Array.isArray(sub.child) && sub.child.length > 0 ? (
                  <>
                    {/* @ts-ignore  */}
                    <SubMenu
                      onClick={() => subCategoryRoute(sub._id)}
                      overflow="auto"
                      label={<button className='min-h-full min-w-full flex justify-start text-left ' onClick={() => subCategoryRoute(sub._id)}>{sub.title as string}</button>}
                      // label={sub.title}
                      className="!py-1 text-sm w-[200px] font-medium bg-white dark:bg-bg-nonary-dark text-text-primary-light dark:text-white hover:bg-bg-tertiary-light !dark:hover:bg-bg-denary-light"
                    >
                      {sub.child.map((subItem) => (
                        <MenuItem
                          onClick={() => subSubCategoryRoute(subItem._id)}
                          key={subItem._id}
                          className="!py-3 w-[200px] bg-white font-medium dark:bg-bg-nonary-dark text-text-primary-light dark:text-white hover:bg-bg-tertiary-light dark:hover:bg-bg-denary-light"
                        >
                          {subItem.title as any}{' '}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  </>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => subCategoryRoute(sub._id)}
                      className="truncate !px-6 !py-3 font-medium bg-white dark:bg-bg-nonary-dark text-text-primary-light dark:text-white hover:bg-bg-tertiary-light dark:hover:bg-bg-denary-light"
                    >
                      {typeof sub.title === 'string' && sub.title}
                    </MenuItem>
                  </>
                )}
              </div>
            ))}
          </ControlledMenu>
        </li>

        <style>
          {`
             .szh-menu-container{
                 width:500px !important;  
              }
             .szh-menu {
                 margin-left:0.4px !important;
                 padding: 0 !important;
                 max-height:50vh;
                 margin-top:10px;
                 margin-bottom:10px;
              }
              .szh-menu--state-open {
                 max-width:50vh;
                 overflow-y:scroll;   

               }
                 .szh-menu__item--submenu {
                 padding:5% 11%;
                 }

                 .szh-menu__item--submenu:hover {
                    background:${currTheme ? '#2C2C2D' : '#F0F0F1'}
                 }
                .szh-menu__item--open {
                    background:${currTheme ? '#2C2C2D' : '#F0F0F1'}

                    }
         `}
        </style>
      </HydrationGuard>
    </>
  );
};

export default HeaderDropdown;

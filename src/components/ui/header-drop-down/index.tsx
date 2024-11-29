import React, { FC } from 'react';
import { Category } from '@/store/types/categories-types';
import { HydrationGuard } from '../hydration-guard';
import { MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { useTheme } from '@/hooks/theme';
import { useRouter } from 'next/router';
import { routeToCategories } from '@/store/utils/route-helper';

export type Props = {
  item: Category;
};

const HeaderDropdown: FC<Props> = ({ item }) => {
  const theme = useTheme();
  const currTheme = theme.theme;
  const router = useRouter();

  const categoryRoute = (categoryId: string) => {
    router.push(routeToCategories({ category: { id: categoryId } }));
  };

  return (
    <>
      <HydrationGuard>
        <li className="relative sm:hidden md:flex px-3 md:text-sm sm:text-[12px] h-full flex">
          <div >
            <MenuButton onClick={() => categoryRoute(item.id)} className=" truncate h-full flex items-center">
              {item.title as string}
            </MenuButton>
          </div>
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

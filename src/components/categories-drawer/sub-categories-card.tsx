import { subCategories } from '@/store/types';
import Link from 'next/link';
import React, { useState } from 'react';
import UpArrowRoundedEdge from '../../../public/assets/svg/up-arrow-rounded-edge';
import { useTheme } from '@/hooks/theme';
import DownArrowRoundedEdge from '../../../public/assets/svg/down-arrow-rounded-edge';

type SubCategoriesCardProps = {
  data: subCategories;
};

const SubCategoriesCard: React.FC<SubCategoriesCardProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const currTheme = theme.theme;
  return (
    <>
      <div
        className=" "
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="my-2 flex items-center justify-between pl-3 rtl:pr-3 rtl:rounded-l-none rtl:rounded-r-md dark:hover:bg-menu-hover hover:bg-bg-octonary-light h-[41px] rounded-l-md">
          <Link href="" className="">
            {typeof data.title === 'string' ? data.title : data.title.en}
          </Link>
          <div>
            {data?.child?.length !== 0 ? (
              isOpen ? (
                <>
                  {currTheme ? <UpArrowRoundedEdge primaryColor="#fff" /> : <UpArrowRoundedEdge primaryColor="#000" />}
                </>
              ) : (
                <>
                  {currTheme ? (
                    <DownArrowRoundedEdge primaryColor="#fff" />
                  ) : (
                    <DownArrowRoundedEdge primaryColor="#000" />
                  )}
                </>
              )
            ) : null}
          </div>
        </div>

        <div className={`${!isOpen && 'hidden'}  h-full  flex flex-col ml-11 mr-11 rtl:ml-0 rtl:mr-11`}>
          {typeof data.child === 'string' ? (
            <></>
          ) : (
            data.child?.map((item, index) => (
              <Link
                href=""
                className="my-1 pl-3 rtl:pr-3 flex items-center dark:hover:bg-menu-hover hover:bg-bg-octonary-light h-[34px] rounded-md"
                key={index}
              >
                {typeof item.title === 'string' ? item.title : item.title.en}
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SubCategoriesCard;

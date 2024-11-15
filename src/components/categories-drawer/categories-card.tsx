import { categories } from '@/store/types';
import React, { FC, useState } from 'react';
import { STATIC_IMAGE_URL } from '@/config';
import UpArrowRoundedEdge from '../../../public/assets/svg/up-arrow-rounded-edge';
import { useTheme } from '@/hooks/theme';
import DownArrowRoundedEdge from '../../../public/assets/svg/down-arrow-rounded-edge';
import ImageContainer from '../ui/image-container';
import Link from 'next/link';
import { routeToCategories } from '@/store/utils/route-helper';
import { useRouter } from 'next/router';
import keyDownHandler from '@/helper/key-down-handler';
type CategoryCardProps = {
  data: categories;
  changMenu:()=>void;
};

const CategoriesCard: FC<CategoryCardProps> = ({ data,changMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const currTheme = theme.theme;

  const router=useRouter();
  
  const subCategoryRoute=(subCategoryId:string)=>{
    router.push(routeToCategories({subCategory:{id:subCategoryId}}));
  };  

  const handleClick=()=>{
    subCategoryRoute(data._id);
    changMenu();
  }

  return (
    <div 
      
      tabIndex={0}
      role="button"
      onKeyDown={(e) => keyDownHandler(e,()=>subCategoryRoute(data._id))} className={`!transition !duration-700 !ease-in flex flex-col h-20 ${isOpen && '!h-fit'}`}
      >
      <div
        className="flex items-center w-full justify-between h-20 cursor-pointer  "
        role="button"
        tabIndex={0}
       
      >
        <Link href={routeToCategories({subCategory:{id:data._id}})} className='w-[100%]'>
          <div  onClick={handleClick} className="flex items-center h-20 w-full dark:hover:bg-bg-denary-light hover:bg-bg-octonary-light">
            <ImageContainer
              width={40}
              height={40}
              className="w-10 h-10 mr-4 rtl:mr-0 rtl:ml-4"
              src={`${STATIC_IMAGE_URL}/${data.images.website}`}
              alt="category-icon"
              loading="lazy"
            />
            {/* <Image width={40} height={40} className='w-10 h-10 mr-4 rtl:mr-0 rtl:ml-4' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="category-icon" /> */}

            <span className="text-sm truncate">{typeof data.title === 'string' ? data.title : data.title.en}</span>
          </div>
        </Link>
        {data.child.length !==0 && <div className='w-[25%] flex items-center justify-center h-full dark:hover:bg-bg-denary-light hover:bg-bg-octonary-light '
          role="button"
          tabIndex={0}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {data.child.length !== 0 ? (
            isOpen ? (
              <>{currTheme ? <UpArrowRoundedEdge primaryColor="#fff" /> : <UpArrowRoundedEdge primaryColor="#000" />}</>
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

        </div>}
        
      </div>

      <div className={`${!isOpen && 'hidden'} h-full  flex flex-col ml-11 rtl:ml-0 rtl:mr-11`}>
        {typeof data.child === 'string' ? (
          <></>
        ) : (
          data.child.map((item, index) => <CategoriesCard data={item} key={index}  changMenu={changMenu}/>)
        )}
      </div>
    </div>
  );
};

export default CategoriesCard;

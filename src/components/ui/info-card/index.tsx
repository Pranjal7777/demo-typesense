import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';
import { useTheme } from '@/hooks/theme';
import UpArrowRoundedEdge from '../../../../public/assets/svg/up-arrow-rounded-edge';

type InfoSection = {
    title: string,
    items: string[]
  }

type InfoCardProps={
    val:InfoSection,
    isOpen:boolean,
    id:number
    onClick:(_id:number)=>void
}

const InfoCard:FC<InfoCardProps> = ({val,isOpen,id,onClick}) => {

  const {theme}=useTheme();

  return (
    <div className="hover:cursor-text flex flex-col mb-7 mobile:mb-5 " onClick={()=>onClick(id)} 
      role='button' tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();  onClick(id);
        }
      }}
    >
      <div className={`flex items-center justify-between mobile:mb-3 ${id === 0 ? 'mb-5' : 'mb-2'}`}>
        <div className={appClsx(' text-sm mobile:text-base font-semibold  text-text-primary-light dark:text-text-primary-dark')}>{val.title}</div>
        {
          isOpen ? (
            <UpArrowRoundedEdge primaryColor={theme ? 'white' :  'black'} className={`sm:hidden `}/>
                    
          ) : (

            <DownArrowRoundedEdge primaryColor={theme ? 'white' :  'black'} className={`sm:hidden `}/>
          )
        }
      </div>
      <div className={` sm:flex flex-wrap ${id === 0 ? 'flex mobile:flex-col' : ''} ${isOpen ? 'flex flex-row flex-wrap' : 'hidden'}  `}>
        {
          val.items.map((innerItem, k) => (
            <div key={k} className={`mobile:p-1  flex items-center  text-xs mobile:text-sm font-normal ${id === 0 ? 'text-text-primary-light  lg:border-r-[1.5px] lg:mr-2 lg:pr-2 mobile:mt-2 border-border-senary-light dark:border-border-primary-dark dark:text-text-primary-dark' : 'text-text-quaternary-dark dark:text-text-tertiary-dark'}`}>
              <span className="mobile:truncate ">{innerItem}</span>
              {
                id !== 0 ? (
                  <span className="mobile:!my-2 mx-1.5 text-base  text-text-tertiary-light mobile:hidden">•</span>
                ) : null
              }
            </div>
          ))
        }

      </div>
    </div>
  );
};

export default InfoCard;
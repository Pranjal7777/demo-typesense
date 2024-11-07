// import ContentSectionPageTitle from '@/components/Ui/ContentSectionPageTitle'
import React, { FC } from 'react';
import ContentSectionTitle from '../content-section-title';
import { appClsx } from '@/lib/utils';



export type Props = {
    title?: string; 
    desc?:{
        para:string
    } [],
    className:string,
    sectionTitleClassName:string
  };

const AboutTextContent: FC<Props> = ({title,desc,className,sectionTitleClassName}) => {
  return (
    <>
      <div className={appClsx('',className)}>
        {
          title && (
            <ContentSectionTitle className={appClsx('',sectionTitleClassName)}>
              {title}
            </ContentSectionTitle>
          )
        }
        {
          desc?.map((item,key)=><p
            className={appClsx('text-base mb-5 lg:mb-12  mobile:!text-xs text-text-primary-light dark:text-text-tertiary-dark','')}
            key={key}
          >
            {item.para.toString()}
          </p>)
        }
        {/* <Description className={appClsx(``,descriptionClassName)} desc={desc} /> */}
      </div>

      {/* <ContentSection className='max-w-[1063px] mx-auto'
    title={aboutSection.items.title}
    desc={aboutSection.items.desc}
    sectionTitleClassName='text-center pb-8 mobile:pb-4 text-[28px] mobile:text-xl'
  /> */}
    </>
  );
};

export default AboutTextContent;

import React, { FC } from 'react';
import ContentSectionPageTitle from '@/components/ui/content-section-page-title';
// import ContentSection from '../ContentSection';
import QaContentSection from '../qa-content-section';
// import { PrivacyDataType } from '@/pages/privacy-policy';
import { appClsx } from '@/lib/utils';
// import { termsData } from '@/pages/about';
import { qaSectionType } from '@/pages/privacy-policy';


export type Props = {
  data:{
    attributes:{
      qa_section:qaSectionType[]
    }
  },
  title:string,
  description:string
};




const QaSection:FC<Props> = ({data,title,description})=> {
  // console.log("for ter***********",title);
  
  return (
    <section className="py-12 mobile:pb-0 mobile:pt-9 border-error">
      <ContentSectionPageTitle className="">{title}</ContentSectionPageTitle>
      <p
        className={appClsx('text-base mb-10 lg:mb-12  mobile:!text-xs text-text-primary-light dark:text-text-tertiary-dark',)}
           
      >
        {description}
            
      </p>
      {data?.attributes?.qa_section?.map((item, key) => (
        <QaContentSection key={key} className="" question={item?.question} answers={item.allAnswersPara} />
      ))}
    </section>
  );
};

export default QaSection;
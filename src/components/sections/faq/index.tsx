import { useTranslation } from 'next-i18next';
import React, { memo, useState } from 'react';
import SectionTitle from '@/components/ui/section-title';
import FaqCard from './faq-card';
import { PROJECT_NAME } from '@/config';
import { faqApi } from '@/store/api-slices/faq/faq-api';


interface FaqSection{
    title:string,
    questions:{
      question:string,
      answer:string
    }[]
}

const FAQ = () => {
  const { t } = useTranslation('common');
  const faqSection= t('page.faqSection',{returnObjects:true, projectName:PROJECT_NAME}) as FaqSection;

  const {data} = faqApi.useGetAllFaqQaQuery();

  const [openCard,setOpenCard]=useState<number>(0);

  const handleCardClick=(id:number)=>{
    if(id===openCard){
      setOpenCard(-1);
    }
    else{

      setOpenCard(id);
    }
    // setOpenCard(id === openCard ? -1 : id);
    // setOpenCard(id === 0 ? (id+1) : (id-1) );
  };

  return (
    <div className=' mobile:py-0 py-12 mobile:my-9 flex flex-col items-center justify-center'>
      <SectionTitle className=" mb-3 mobile:mb-2">
        {faqSection.title}
      </SectionTitle>
      <div className=' max-w-[792px] w-full'>
        {
          data?.data?.map((item,id)=>(
            <FaqCard key={id} id={id} onClick={handleCardClick} isOpen={id===openCard} question={item.title} answer={item.htmlContent}/>
          ))
        }
      </div>
    </div>
  );
};

export default memo(FAQ);
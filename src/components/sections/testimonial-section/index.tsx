import React, { memo } from 'react';
import CustomerTestimonial from '../customer-testimonial';
import { useTranslation } from 'next-i18next';
import SectionTitle from '@/components/ui/section-title';

type Testimonial = {
  title: string;
  comment: string;
  userName: string;
  ratings: number;
};

export type translateType = {
  title: string;
  testimonials: Testimonial[];
};

const TestimonialSection: React.FC = () => {
  const { t } = useTranslation('common');
  const _text: translateType = t('page.userTestimonials', { returnObjects: true }) as translateType;
  return (
    <div className=" py-12 mobile:py-0 mobile:mt-9 w-100">
      <div className="">
        <SectionTitle className="text-center !py-0 mb-8">{_text?.title}</SectionTitle>
      </div>
      {/* <div className=" grid text-center md:text-left mobile:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 mobile:gap-4 place-items-center place-content-center "> */}
      <div className="">
        <CustomerTestimonial data={_text?.testimonials} />
      </div>
    </div>
  );
};

export default memo(TestimonialSection);

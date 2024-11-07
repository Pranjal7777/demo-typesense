import React, { FC } from 'react';
import DescriptionDropdown from '../../ui/accordion-card';
import SectionTitle from '@/components/ui/section-title';
export type Props = {
  data: {
    title: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
};

const Accordion: FC<Props> = ({ data }) => {
  return (
    <>
      <SectionTitle className="!text-2xl mobile:!text-base mobile:font-semibold pt-12 pb-7 border-b border-border-tertiary-light dark:border-border-tertiary-dark">
        {data.title}
      </SectionTitle>
      {data.items.map(
        (item, index) =>
          typeof item !== 'string' && <DescriptionDropdown key={index} item={item} /> // Handling array of objects
      )}
    </>
  );
};

export default Accordion;

import React, { FC } from 'react';
import Description from '../ui/description';
import SectionTitle from '../ui/section-title';

export type Props = {
  data: {
    title: string;
    desc: string[];
  }[];
};

const AboutUs: FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <div key={index}>
          <SectionTitle className="!text-2xl  mobile:!text-base mobile:font-semibold pt-12 pb-7 mb-[24px] border-b border-border-tertiary-light dark:border-border-tertiary-dark">
            {item.title}
          </SectionTitle>
          <Description desc={item.desc} />
        </div>
      ))}
    </>
  );
};

export default AboutUs;

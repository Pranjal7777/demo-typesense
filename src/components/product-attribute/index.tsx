import React, { FC } from 'react';

export type Props = {
  data: {
    title: string;
    attribute: {
      name: string;
      value: string;
    }[];
  }[];
};

const ProductAttribute: FC<Props> = ({ data }) => {
  return (
    <>
      {data ? data.map((item, index) => (
        <div className="mt-3 md:mt-6" key={index}>
          <div className="xl:mb-3 sm:mt-2 text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
            {item.title}
          </div>
          <div className="mobile:mt-2  flex flex-col">
            {item?.attribute?.map((item1, index1) => (
              <div className="mobile:h-5 mobile:text-sm flex  items-center justify-between my-1.5 sm:h-7" key={index1}>
                <span className="text-sm md:text-base !font-medium text-text-primary-light dark:text-text-primary-dark text-nowrap">
                  {item1.name}
                </span>
                <span className="xl:text-base lg:text-sm md:text-xs sm:text-[10px] text-sm font-normal text-text-tertiary-light dark:text-text-tertiary-dark text-nowrap">
                  {item1.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )): null}
    </>
  );
};

export default React.memo(ProductAttribute);

import React, { FC } from 'react';
import { appClsx } from '@/lib/utils';
type Answer = {
    ansPara?: string; // Define the type of ansPara here
  };
export type Props = {
    answers: Answer[];
    className?:string
  };


const AnswerDescription: FC<Props> = ({ answers , className}) =>{
  return (
    <>
      {
        answers.map((item, index) => (
          <p
            className={appClsx('text-base mb-5 lg:mb-12  mobile:!text-xs text-text-primary-light dark:text-text-tertiary-dark',className)}
            key={index}
          >
            {item?.ansPara?.toString()}
          </p>
        ))
      }
    </>
  );
};

export default AnswerDescription;
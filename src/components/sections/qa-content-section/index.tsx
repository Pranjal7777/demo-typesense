import React, { FC } from 'react';
import ContentSectionTitle from '../content-section-title';
import AnswerDescription from '../answer-description';
import { appClsx } from '@/lib/utils';

export type Props = {
    question?: string;
    answers: {
        ansPara: string
    }[];
    className?:string;
    sectionTitleClassName?:string,
    descriptionClassName?:string
};

const  QaContentSection: FC<Props> = ({ question,answers ,className,sectionTitleClassName,descriptionClassName}) => {
  return (
    <div>
      {/* <ContentSectionTitle/> */}
      <div className={appClsx('',className)}>
        {
          question && (
            <ContentSectionTitle className={appClsx('',sectionTitleClassName)}>
              {question}
            </ContentSectionTitle>
          )
        }
        {
          answers?.length > 0? <AnswerDescription className={appClsx('',descriptionClassName)} answers={answers} /> :null
        }
        {/* <AnswerDescription className={appClsx(``,descriptionClassName)} answers={answers} /> */}
      </div>
        
    </div>
  );
};

export default QaContentSection;
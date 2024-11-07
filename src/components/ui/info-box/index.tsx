import React, { useState } from 'react';

type InfoBoxProps = {
  question: string;
  answer: string;
  width: string | number;
};

const InfoBox: React.FC<InfoBoxProps> = ({ question, answer, width }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={`mobile:mt-9 h-auto w-auto lg:w-[${width}] p-4 lg:p-0 mobile:h-auto overflow-y-scroll `}>
      <div className="text-lg md:text-xl font-semibold text-text-primary-light dark:text-text-quinary-dark">
        {question}
      </div>

      {answer ? (
        <div className="mobile:mt-2 mobile:text-sm lg:mt-5 sm:mt-1 text-text-octonary-light dark:text-text-tertiary-dark">
          <span className={`transition-height duration-300 ease-in-out ${isExpanded ? 'max-h-screen' : 'max-h-12'}`}>
            <span className="transition-all duration-300 ease-in text-sm md:text-base">
              {isExpanded ? answer : `${answer?.substring(0, 300).trim()}...`}
              {answer?.length > 300 && (
                <span
                  className="text-text-primary-light dark:text-text-quinary-dark font-bold hover:underline hover:cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                  tabIndex={0}
                  role="button"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === '') {
                      setIsExpanded(!isExpanded);
                    }
                  }}
                >
                  {isExpanded ? '...Read less' : 'Read more'}
                </span>
              )}
            </span>
          </span>
        </div>
      ) : (
        <div>
          <span className='font-medium'>No Description Found</span>
        </div>
      )}
    </div>
  );
};

export default InfoBox;

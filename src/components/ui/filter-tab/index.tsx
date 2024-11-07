import React from 'react';
import Button from '../button';
import TextWrapper from '../text-wrapper';

type FilterTabProps = {
  buttonType?: string;
  className: string;
  onClick?: () => void;
  text?: string;
};

const FilterTab: React.FC<FilterTabProps> = ({ buttonType, className, onClick, text, ...props }) => {
  return (
    <Button buttonType={buttonType} className={className} onClick={onClick} {...props}>
      <TextWrapper className="text-sm">{text}</TextWrapper>
    </Button>
  );
};

export default FilterTab;

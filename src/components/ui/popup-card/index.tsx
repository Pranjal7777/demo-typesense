import React from 'react';
import Button from '../button';

type props = {
  onCancel: () => void;
  onUnfollow: () => void;
  question: string;
  cancelBtnLabel: string;
  confirmBtnLabel: string;
};
const PopUpCard: React.FC<props> = ({ question, cancelBtnLabel, confirmBtnLabel, onCancel, onUnfollow }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-gray-900 bg-opacity-75 z-10 pt-20 pb-10">
      <div className="flex rounded-xl lg:w-1/3 flex-col items-center p-5 bg-white">
        <p className="font-lg font-semibold w-3/4 lg:w-1/2 text-center text-text-primary-light dark:text-text-secondary-light">
          {question}
        </p>
        <div className="flex flex-col md:flex-row mt-10 w-full  gap-2 ">
          <Button buttonType="tertiary" className="!mb-0" onClick={onCancel}>
            {cancelBtnLabel}
          </Button>
          <Button className="mb-0" onClick={onUnfollow}>
            {confirmBtnLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopUpCard;

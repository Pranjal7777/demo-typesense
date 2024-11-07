import Image from 'next/image';
import React from 'react';
import PropTypes from 'prop-types';

type TypeCardProps = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
};

const TypeCard: React.FC<TypeCardProps> = ({ name, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      role='button'
      tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`border  h-[93px] w-[93px] mobile:w-[85px] mobile:h-[85px] rounded-[4px] ${
        isSelected
          ? 'text-brand-color bg-[#F7F5FC] dark:bg-[#221D2A] border-brand-color'
          : 'border-[#DBDBDB] dark:border-[#3D3B45]'
      } `}
    >
      <div className={'p-2 flex flex-col items-center w-full cursor-pointer'}>
        <div className="w-full h-[80%]">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Sunflower_clip_art.svg"
            width={60}
            height={60}
            alt="image"
            className='mobile:w-3/4 mx-auto'
          />
        </div>
        <span className="text-xs mx-auto font-medium text-[#202020] dark:text-text-secondary-light">{name}</span>
      </div>
    </div>
  );
};
TypeCard.propTypes = {
  name: PropTypes.string.isRequired,
};
export default TypeCard;

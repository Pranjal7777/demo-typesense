import React from 'react';
import ImageContainer from '../image-container';
export interface ProdAdCardProps {
  imageURL?: string;
  title: string;
  subTitle?: string;
}

const ProdAdCard: React.FC<ProdAdCardProps> = ({ imageURL, title, subTitle }) => {
  return (
    <div className='flex gap-2 border border-border-tertiary-light'>
      {imageURL && <ImageContainer src={imageURL} alt={title + 'image'} />}
      <div className='flex flex-col gap-2'>
        <span className='text-sm font-normal'>{title}</span>
        <p className='text-base font-semibold'>{subTitle}</p>
      </div>
    </div>
  );
};

export default ProdAdCard;

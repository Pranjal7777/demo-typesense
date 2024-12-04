import React, { FC } from 'react';
import ImageContainer from '@/components/ui/image-container';
import { appClsx } from '@/lib/utils';
import { NO_PRODUCTS } from '../../../public/images/placeholder';

type Props = {
  src?: string;
  alt?: string;
  height?: number;
  width?: number;
  containerClassName?: string;
  title?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  imageClassName?: string;
};

const Placeholder: FC<Props> = ({
  src = NO_PRODUCTS,
  alt = 'placeholder',
  height = 200,
  width = 200,
  containerClassName,
  title,
  titleClassName,
  description,
  descriptionClassName,
  imageClassName,
}) => {
  return (
    <div className={appClsx('flex flex-col justify-center items-center', containerClassName)}>
      <ImageContainer
        className={appClsx('h-[168px] w-[168px] md:h-[200px] md:w-[200px]', imageClassName)}
        height={height}
        width={width}
        alt={alt}
        src={src}
      />
      {title && (
        <p
          className={appClsx(
            'text-text-primary-light dark:text-text-primary-dark md:text-[28px] text-[20px] font-medium',
            titleClassName
          )}
        >
          {title}
        </p>
      )}
      {description && (
        <p
          className={appClsx(
            'text-text-quaternary-dark dark:text-text-senary-dark text-sm md:text-base font-medium',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default Placeholder;

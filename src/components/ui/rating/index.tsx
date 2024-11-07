import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
import StarIcon from '../../../../public/assets/svg/star-icon';
import { useTheme } from '@/hooks/theme';

export type Props = {
  wrapperClass?: string;
  starContainerClass?: string;
  value?: number;
  text?: string;
  color?: string;
  itemClassName?: string;
  className?: string;
};

const Rating: FC<Props> = ({ value = 0, color='#FDB514', text, itemClassName = '', className = '', wrapperClass='', starContainerClass='' }) => {
  const clampedValue = Math.min(Math.max(value, 0), 5);

  const theme = useTheme();
  const selectedColor = color;
  const disabledColor = '#EBEBEB';
  const disabledColorDark = '#2F2F2F';

  return (
    <div className={appClsx('flex md:gap-2 items-center', wrapperClass)}>
      <div className={appClsx('flex gap-2',starContainerClass)}>
        {Array(5)
          .fill('')
          .map((_i, index) => (
            // <span key={index} className={appClsx('flex', className)}>
            <StarIcon
              key={index} 
              className={appClsx('', className)}
              color={index < clampedValue ? selectedColor : theme.theme ? disabledColorDark : disabledColor}
            />
            // </span>
          ))}
      </div>
      <span className={itemClassName}>{text && text}</span>
    </div>
  );
};

// Rating.defaultProps = {
//   color: '#f8e825',
// };

export default Rating;

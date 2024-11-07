import React from 'react';
// import CrossIcon from '../../../public/images/cross-icon.svg';
// import CrossIconWhite from '../../../public/images/cross_icon_white.svg';
import LeftArrowRoundedEdgeIcon from '../../../../public/assets/svg/left-arrow-rounded-edge';
import { useTheme } from '@/hooks/theme';


type cardProps = {
   label: string
}

const CtaCard: React.FC<cardProps> = ({label}) => {
  const {theme} = useTheme();
  console.log(theme);
  return <div>

    <div>
      <LeftArrowRoundedEdgeIcon />
      <span className='text-lg md:text-xl'>{label}</span>
      
    </div>
  </div>;
};

export default CtaCard;

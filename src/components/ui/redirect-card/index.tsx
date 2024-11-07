import Link from 'next/link';
import React from 'react';

type RedirectCardProps = {
  linkUrl?: any;
  label: string;
  labelIcon?: React.ElementType | any;
  actionIcon?: React.ElementType | any;
};

const RedirectCard: React.FC<RedirectCardProps> = ({ linkUrl, label, labelIcon, actionIcon }) => {
  return (
    <div className='flex items-center justify-between px-4 lg:px-1 font-semibold py-4 lg:py-2 hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark'> 
      {linkUrl ?  <Link href={linkUrl}>
        <div className='flex  items-center gap-2'>
          <div>{labelIcon}</div>
          <span>{label}</span>
        </div>
      </Link> :  
        <div className='flex  items-center gap-2'>
          <div>{labelIcon}</div>
          <span>{label}</span>
        </div>
      }
     

      <div>
        {actionIcon}
      </div>
    </div>
  );
};

export default RedirectCard;

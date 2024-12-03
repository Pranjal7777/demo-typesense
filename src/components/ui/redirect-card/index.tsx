import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type RedirectCardProps = {
  linkUrl?: any;
  label: string;
  labelIcon?: React.ElementType | any;
  actionIcon?: React.ElementType | any;
};

const RedirectCard: React.FC<RedirectCardProps> = ({ linkUrl, label, labelIcon, actionIcon }) => {
  const router = useRouter()
  const onCardClick = ()=>{
    if(linkUrl){
      router.push(linkUrl)
    }
  }
  return (
    <div onClick={onCardClick} className='flex items-center justify-between px-4 lg:px-1 py-4 lg:py-2 hover:bg-bg-tertiary-light dark:hover:bg-bg-tertiary-dark'> 
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

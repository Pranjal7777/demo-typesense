import React, { FC } from 'react';
// import { PROFILE_IMAGE } from '../../../../public/images/productcard';
import Image from 'next/image';
import Rating from '../rating';
import { appClsx } from '@/lib/utils';
import Button from '../button';
import UserPlaceholderIcon from '../../../../public/assets/svg/user-placeholder-icon';
import { STATIC_IMAGE_URL } from '@/config';
type Props = {
    cardClass?:string;
    fullNameClass? : string;
    userNameClass? : string;
    ratingClass? : string;
    starColor? : string;
    ratingText? : string;
    ratingTextClass? : string;
    ratingValue?: number;
    buttonClass? : string;
    buttonType? : string;
    profilePic: string;
    userName?:string;
    fullName?:string;
    buttonText?: string;
    showFollowingSection?: boolean;
    followingSectionClass?: string;
    totalFollowers?: number;
    totalFollowing?: number;
    followButtonHandler?: ()=>void;
}
const NewProfileCard:FC<Props> = ({cardClass,fullNameClass,userNameClass,starColor,ratingClass,ratingText,ratingTextClass,buttonClass,buttonType,profilePic,fullName,userName,buttonText,ratingValue=0,showFollowingSection=true,followingSectionClass,totalFollowers,totalFollowing,followButtonHandler}) => {
  return (
    <div className={appClsx('w-full flex flex-col items-center md:items-start gap-1', cardClass)}>
      {
        profilePic ? <Image
          width={100}
          height={100}
          className=' rounded-full'
          // className="absolute  mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3 "
          src={`${STATIC_IMAGE_URL}/${profilePic}`}
          alt="profile-image"
        /> : <UserPlaceholderIcon height='100' width='100' className='rounded-full'/>
      }
      
      <strong className={appClsx('text-[20px] mt-2 md:mt-3 text-text-primary-light font-semibold leading-[30px]', fullNameClass)}>{fullName}</strong>
      <span className={appClsx('text-text-tertiary-light text-[14px] leading-[21px] ', userNameClass)}>{userName}</span>
      <Rating value={ratingValue}  itemClassName = {ratingTextClass} color= {starColor}  className={ratingClass} text={ratingText}/>
      <Button onClick={followButtonHandler} buttonType={buttonType} className={buttonClass}>{buttonText}</Button>
      {
        showFollowingSection && <div className={appClsx('w-full flex gap-4 justify-center md:justify-start text-sm font-medium text-text-secondary-dark' , followingSectionClass)}>
          <span>{`${totalFollowers || '0 '} followers`}</span>
          <span>{`${totalFollowing || '0 '} following`}</span>
        </div>
      }
      
    </div>
  );
};
export default NewProfileCard;
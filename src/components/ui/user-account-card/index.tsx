import React from 'react';
import ProfileImageContainer from '../profile-image-container';

type UserAccountCardProps = {
  profileImage: string;
  accountName: string;
  desc?: string;
};
const UserAccountCard: React.FC<UserAccountCardProps> = ({ profileImage, accountName, desc }) => {
  return (
    <div className='flex items-center gap-4 bg-[#F1ECF9] dark:bg-[#352551] p-5 rounded-[7px]'>
      <div>
        <ProfileImageContainer className='object-fill rounded-full' src={profileImage} alt="Profile Image" height={48} width={48} />
      </div>
      <div className='flex flex-col gap-2'>
        <span className='text-xl font-semibold leading-[30px] text-text-primary-light dark:text-text-secondary-light'>{accountName}</span>
        <p className='text-sm font-normal text-[#57585A] dark:text-[#929293] leading-[21px]'>{desc}</p>
      </div>
    </div>
  );
};

export default UserAccountCard;

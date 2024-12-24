import React from 'react';
import ProfileImageContainer from '../profile-image-container';
import UserPlaceholderIcon from '../../../../public/assets/svg/user-placeholder-icon';
import { useTheme } from '@/hooks/theme';

type UserAccountCardProps = {
  profileImage: string;
  accountName: string;
  desc?: string;
};
const UserAccountCard: React.FC<UserAccountCardProps> = ({ profileImage, accountName, desc }) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-4 bg-bg-quattuordenary-light dark:bg-bg-quattuordenary-dark p-5 rounded-[7px]">
      <div>
        {profileImage ? (
          <ProfileImageContainer
            className="object-fill rounded-full"
            src={profileImage}
            alt="Profile Image"
            height={48}
            width={48}
          />
          ) : (
          <UserPlaceholderIcon
            secondaryColor={theme ? 'var(--icon-secondary-dark)' : 'var(--icon-secondary-light)'}
            height="50"
            width="50"
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-semibold leading-[30px] text-text-primary-light dark:text-text-secondary-light">
          {accountName}
        </span>
        <p className="text-sm font-normal text-text-tertiary-light dark:text-text-septenary-light leading-[21px]">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default UserAccountCard;

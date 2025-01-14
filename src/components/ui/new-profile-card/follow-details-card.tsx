import React, { FC } from 'react';
import UserProfile from '../user-profile';
import Button from '../button';
import { appClsx } from '@/lib/utils';
import { sellerProfileApi } from '@/store/api-slices/seller-profile/seller-profile-api';

type FollowDetailsCardProps = {
  firstName?: string;
  lastName?: string;
  profilePicUrl?: string;
  username?: string;
  buttonText?: string;
  buttonType?: string;
  buttonClassName?: string;
  accountId?: string;
  refetch?: () => void;
  handleUnfollow?: (accountId: string) => void;
};

const FollowDetailsCard: FC<FollowDetailsCardProps> = ({
  firstName,
  lastName,
  profilePicUrl,
  username,
  buttonText,
  buttonType,
  buttonClassName,
  accountId,
  refetch,
  handleUnfollow,
}) => {
  const [postFollow, { isLoading: isFollowLoading }] = sellerProfileApi.usePostFollowMutation();
  const [postUnFollow, { isLoading: isUnFollowLoading }] = sellerProfileApi.usePostUnFollowMutation();
  const onFollowUnfollow = async () => {
    if (buttonText?.toLowerCase() === 'unfollow') {
      try {
        await postUnFollow(accountId || '').unwrap();
        handleUnfollow?.(accountId || '');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await postFollow(accountId || '').unwrap();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-bg-septenary-light dark:border-border-tertiary-dark dark:bg-bg-secondary-dark">
      <div className="flex items-center gap-3">
        <UserProfile
          className="w-10 h-10"
          textContainerClassName="text-sm"
          firstName={firstName}
          lastName={lastName}
          profilePicUrl={profilePicUrl}
        />
        <div className="flex flex-col gap-1">
          <span className="text-text-primary-light dark:text-text-primary-dark text-sm font-semibold">{`${firstName} ${lastName}`}</span>
          <span className="text-text-quinary-light text-xs">@{username}</span>
        </div>
      </div>
      <Button
        disabled={isFollowLoading || isUnFollowLoading}
        isLoading={isFollowLoading || isUnFollowLoading}
        onClick={onFollowUnfollow}
        className={appClsx('w-[76px] mt-0 mb-0 h-[30px] text-xs flex justify-center items-center', buttonClassName)}
        buttonType={buttonType}
        spinnerClassName="w-5 h-5"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default FollowDetailsCard;

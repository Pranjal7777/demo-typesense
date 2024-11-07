import { appClsx } from '@/lib/utils';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Rating from '../rating';
import React, { useState, useCallback } from 'react';
import PopUpCard from '../popup-card';
import ImageContainer from '../image-container';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { sellerProfileApi } from '@/store/api-slices/seller-profile/seller-profile-api'; // Import the API slice
import FullScreenSpinner from '../full-screen-spinner'; // Import the spinner component
import { toast } from 'sonner';
import { getCookie } from '@/utils/cookies';
import { useRouter } from 'next/router';

type SellerProfileCardProps = {
  sellerName: string;
  sellerRating: string;
  buttonLabel: string;
  className?: string;
  width?: string;
  profilePic?: any;
  label: string;
  unfollowLabel?: string;
  accoundId: string;
};

const ProfileCard: React.FC<SellerProfileCardProps> = ({
  sellerName,
  sellerRating,
  buttonLabel,
  className,
  width,
  profilePic,
  label,
  unfollowLabel,
  accoundId,
}) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();
  const { t: productDetails } = useTranslation('productDetails');
  const unfollowBtnText: string = productDetails('page.unfollowBtn');
  const cancelBtnText: string = productDetails('page.cancelBtn');
  const popupQues: string = productDetails('page.unfollowQues');

  const [postFollow] = sellerProfileApi.usePostFollowMutation();
  const [postUnFollow] = sellerProfileApi.usePostUnFollowMutation();
  const isUserAuth = getCookie('isUserAuth');
  const handleButtonClick = useCallback(async () => {
    if(!isUserAuth) {
      router.push('/login');
      return;
    }


    if (isFollowed) {
      setIsPopupOpen(true);
    } else {
      setIsLoading(true);
      try {
        await postFollow(accoundId);
        setIsFollowed(true);
        toast.success(`You have successfully followed ${sellerName}!`);
      } catch (error) {
        toast.error('Failed to follow. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isFollowed, accoundId, postFollow]);

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    try {
      await postUnFollow(accoundId);
      setIsFollowed(false);
    } catch (error) {
      console.error('Error unfollowing:', error);
    } finally {
      setIsLoading(false);
      setIsPopupOpen(false);
    }
  };

  return (
    <div className={`p-5 mt-5 rounded-[4px] bg-bg-quinquedenary-light dark:bg-bg-quinquedenary-dark flex justify-between w-[${width}]`}>
      {isLoading && <FullScreenSpinner />} 
      <div className={`${appClsx(className)} w-full flex items-center justify-between`}>
        <div className={`${appClsx(className)} flex items-center`}>
          <ImageContainer
            className="lg:w-[62px] lg:h-[62px] md:w-[48px] md:h-[48px] sm:w-[43px] sm:h-[42px] mobile:w-[56px] mobile:h-[56px]"
            width={62}
            height={62}
            src={profilePic}
            alt="user-image"
          />

          <div className="flex flex-col ml-4 rtl:ml-0 rtl:mr-4">
            <span className="text-text-tertiary-light dark:text-text-tertiary-dark md:text-xs mobile:text-[10px] font-medium">
              <span className="text-text-tertiary-light dark:text-text-tertiary-dark md:text-xs mobile:text-[10px] font-medium">
                {label}
              </span>
              <Link href={`/seller-profile/${accoundId}`}>
                <div className="font-semibold text-sm md:text-base text-text-primary-light dark:text-text-quinary-dark mobile:text-base">
                  {sellerName}
                </div>
              </Link>
              <Rating
                itemClassName="text-xs dark:text-text-tertiary-dark md:mt-[5px]"
                value={parseInt(sellerRating)}
                text={parseInt(sellerRating) !== 0 ? sellerRating : ''}
              />
            </span>
          </div>
        </div>
        <div className="mobile:w-[84px] mobile:h-[33px] flex mobile:items-center mobile:justify-center mobile:mr-3 rtl:ml-3">
          <Button
            className="flex items-center justify-center border-brand-color text-sm md:text-base"
            buttonType={BUTTON_TYPE_CLASSES.quinary}
            onClick={handleButtonClick}
          >
            {isFollowed ? unfollowLabel : buttonLabel}
          </Button>
        </div>
      </div>

      {isPopupOpen && (
        <PopUpCard
          onCancel={handleCancel}
          onUnfollow={handleUnfollow}
          question={popupQues}
          cancelBtnLabel={cancelBtnText}
          confirmBtnLabel={unfollowBtnText}
        />
      )}
    </div>
  );
};

export default ProfileCard;

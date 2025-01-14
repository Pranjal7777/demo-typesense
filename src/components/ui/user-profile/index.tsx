import { STATIC_IMAGE_URL } from '@/config';
import { appClsx } from '@/lib/utils';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';

type UserProfileProps = {   
  firstName?: string;
  lastName?: string;
  profilePicUrl?: string;
  className?: string;
  imageClassName?: string;
  textContainerClassName?: string;  
  imageHeight?: number;
  imageWidth?: number;
};

const UserProfile:FC<UserProfileProps> = ({ firstName, lastName, profilePicUrl, className, imageClassName, textContainerClassName, imageHeight, imageWidth }) => {
  const [hasError, setHasError] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(
    profilePicUrl?.includes('http') ? profilePicUrl : `${STATIC_IMAGE_URL}/${profilePicUrl}`
  );
  useEffect(() => {
    setProfilePicSrc(profilePicUrl?.includes('http') ? profilePicUrl : `${STATIC_IMAGE_URL}/${profilePicUrl}`);
  }, [profilePicUrl]);

  const getInitials = () => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className={appClsx("flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 overflow-hidden", className)}>
      {!hasError && profilePicUrl ? (
        <Image
          height={imageHeight || 100}
          width={imageWidth || 100}
          src={profilePicSrc}
          alt={`${firstName} ${lastName}`}
          onError={() => setHasError(true)}
          className={appClsx("w-full h-full object-cover rounded-full object-center", imageClassName)}
        />
      ) : (
        <div className={appClsx("flex items-center justify-center w-full h-full bg-brand-color text-white text-sm md:text-base uppercase", textContainerClassName)}>
          {getInitials()}
        </div>

      )}
    </div>
  );
};

export default UserProfile;

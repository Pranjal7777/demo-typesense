import Image from 'next/image';
import React, { useState } from 'react';
import { IMAGES } from '@/lib/images';
import { useTheme } from '@/hooks/theme';

type ImageContainerProps = {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  layout?: string;
  loading?: any;
};

const ProfileImageContainer: React.FC<ImageContainerProps> = ({
  src,
  width,
  height,
  alt = 'Profile Image',
  layout,
  className,
  loading,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const theme = useTheme();
  const currTheme = theme.theme;
  return (
    height ?  <Image
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      {...props}
      layout={layout}
      loading={loading}
      onError={() => setImgSrc(currTheme ? IMAGES.PROFILE_PLACEHOLDER_IMAGE_DARK : IMAGES.PROFILE_PLACEHOLDER_IMAGE_LIGHT)}
    /> 
      :  <Image
        src={imgSrc}
        layout='fill'
        alt={alt}
        className={className}
        {...props}
        onError={() => setImgSrc(currTheme ? IMAGES.PROFILE_PLACEHOLDER_IMAGE_DARK : IMAGES.PROFILE_PLACEHOLDER_IMAGE_LIGHT)}
      />
   
  );
};

export default ProfileImageContainer;

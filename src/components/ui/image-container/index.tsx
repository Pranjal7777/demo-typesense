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

const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  width,
  height,
  alt = 'Product Image',
  layout,
  className,
  loading,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const {theme} = useTheme();

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
      onError={() => setImgSrc(theme ?`${IMAGES.FALLBACK_IMAGE_DARK}` : `${IMAGES.FALLBACK_IMAGE_LIGHT}`)}
    /> 
      :  <Image
        src={imgSrc}
        layout='fill'
        alt={alt}
        className={className}
        {...props}
        onError={() => setImgSrc(theme ?`${IMAGES.FALLBACK_IMAGE_DARK}` : `${IMAGES.FALLBACK_IMAGE_LIGHT}`)}
      />
   
  );
};

export default ImageContainer;

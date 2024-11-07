import Head from 'next/head';
import React from 'react';

interface OGTagsProps {
  url?: string;
  ogImage?: string;
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  keywords?: string;
  twitterTitle?:string;
  twitterImage?:string ;
  twitterImageAlt?:string;
  twitterURL?:string;
}

const defaultTitle = 'Kwibal - The biggest buy & sell marketplace globally in 2024';
const defaultOGTitle = 'Kwibal - The biggest buy & sell marketplace globally in 2024';
const defaultDescription = 'Negotiate and get the best deals , buy direct or trade your products for another one.';
const defaultOGURL = 'https://webv2.le-offers.com/';
const defaultOGImage = 'https://leoffer-media.s3.ap-south-1.amazonaws.com/og_image_36021e5b9a.svg';

const CustomHeader: React.FC<OGTagsProps> = ({
  url,
  ogImage,
  title,
  description,
  image,
  imageWidth = 1200,
  imageHeight = 630,
  keywords,
  twitterTitle,
  twitterImage,
  twitterImageAlt,
  twitterURL
}) => {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title || defaultOGTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultOGImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta name="keywords" content={keywords || 'Kwibal'}></meta>
      <meta name="Publisher" content="Appscrip"></meta>

      {/* twitter */}
      <meta name="twitter:site" content={twitterURL || url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage || defaultOGImage} />
      <meta name="twitter:title" content={twitterTitle || defaultOGTitle} />
      <meta name="twitter:image" content={twitterImage || defaultOGImage} />
      <meta name="twitter:image:alt" content={twitterImageAlt || 'twitter image'} />

      {/* og image */}
      <meta property="og:image" content={ogImage || defaultOGImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <link rel="canonical" href={url || defaultOGURL} />

      <meta name="robots" content="noindex"></meta>
      <meta name="googlebot" content="noindex"></meta>

      {/* <meta http-equiv="pragma" content="no-cache" /> 
<meta http-equiv="expires" content="-1" />
<meta http-equiv="cache-control" content="no-cache"/> */}
    </Head>
  );
};

export default CustomHeader;

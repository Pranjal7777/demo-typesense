export interface StrapiData {
  id: number;
  attributes: Attributes;
}

export interface Attributes {
  seoProperties: SeoProperties;
}

export interface SeoProperties {
  id: number;
  metaTitle: string;
  metaDesc: string;
  schemaDesc: string;
  schemaName: string;
  keywords: Keywords;
  metaImage: ImageProps;
  twitterCard: TwitterCard;
}

export interface Keywords {
  key: string;
}

export interface ImageProps {
  data: ImageData;
}

export interface ImageData {
  attributes: ImageAttributes;
}

export interface ImageAttributes {
  url: string;
}

export interface TwitterCard {
  id: number;
  twitterTitle: string;
  twitterUrl: string;
  twitterImageAlt: string;
  twitterImage: ImageProps;
}

export interface Twitter {
  twitterTitle: string;
  twitterUrl: string;
  twitterImage: {
    url: string;
    name: string;
  };
}

export interface SeoData {
  title: string;
  description: string;
  image: {
    url: string;
    name: string;
  };
  url: string;
  twitter?: Twitter;
}

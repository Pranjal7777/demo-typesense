export interface PdpProductData {
  message: string;
  result: Result;
}

export interface Result {
  _id: string;
  title: string;
  userId: string;
  listedByUserId: string;
  images: Image[];
  videos: any[];
  price: number;
  units: Units;
  users: Users;
  description: string;
  creationTs: number;
  expiredTs: number;
  sold: boolean;
  assetCondition: string;
  details: any[];
  availableForExchange: boolean;
  isNegotiable: boolean;
  seoSettings: SeoSettings;
  url_rewrite: UrlRewrite;
  custom_url_list: any[];
  taxes: any[];
  locationName: string;
  location: Location;
  adBumpPlanDetail: AdBumpPlanDetail;
  address: string;
  city: string;
  area: string;
  state: string;
  country: string;
  statusCode: number;
  canShipProduct: boolean;
  shippingDetails: ShippingDetails;
  shippingAvailable: boolean;
  enableBuyNowOfferFlow: boolean;
  customMakeModelsEnable: boolean;
  categoryPath: CategoryPath[];
  isUrgentToSell: boolean;
  isHighlight: boolean;
  zip: string;
  likeCount: number;
  viewCount: number;
  shareLink: string;
  soldType: string;
  ratingCondition: string;
  myOffer: MyOffer;
  offerId: string;
  isOffered: boolean;
  isExchanged: boolean;
  isFollow: boolean;
  isLiked: boolean;
  addressId: string;
  isCancelled: boolean;
  offerType: number[];
  isPremium: IsPremium;
  noOfToken: number;
  isSubscribe: boolean;
  isShipmentRequested: boolean;
  mainCategory: string;
  shippingType: string;
  numberOfOfferCount: number;
  buyDirectRequestId: string;
  buyDirectStatus: number;
  isBuyDirect: boolean;
  isBuyDirectCanclled: boolean;
  buyerOfferCount: number;
  makeId: string;
  model: any[];
  Year: string;
  VINId: string;
  Mileage: string;
  make: any[];
  shipTag: string;
}

export interface Image {
  type: string;
  thumbnailUrl?: string;
  seqId: number;
  url: string;
}

export interface Units {
  symbol: string;
  currency_code: string;
}

export interface Users {
  _id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  username: string;
  avgRating: number;
  totalRatingCount: number;
  bio: string;
  profilePic: string;
  referralCode: string;
}

export interface SeoSettings {
  titleSeo: string;
  metaTags: any[];
  slug: string;
  description: string;
  facebookImg: string;
  twitterImg: string;
  openGraph: string;
}

export interface UrlRewrite {
  custom_url: string;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface AdBumpPlanDetail {
  planId: string;
  expiryTs: number;
}

export interface ShippingDetails {}

export interface CategoryPath {
  title: string;
  id: string;
}

export interface MyOffer {}

export interface IsPremium {
  isPremium: boolean;
  noOfTokens: number;
}

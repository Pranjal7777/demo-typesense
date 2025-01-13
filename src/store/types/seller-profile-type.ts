import { Product } from './product-types';

export interface LoginVerified {
  facebookVerified: boolean;
  gmailVerified: boolean;
  appleVerified: boolean;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
}
export interface Subscription {
  isSubscribed: boolean;
}
export interface SellerProfileType {
  accountBrandName: string;
  accountId: string;
  accountLegalName: string;
  accountType: string;
  avgSellerRating: number;
  bio: string;
  commentCount: number;
  country: string;
  countryCode: string;
  creationDate: string; // ISO date string
  dateOfBirth: string; // ISO date string
  email: string;
  fcmTopic: string;
  firstName: string;
  isFollow: boolean;
  isProfileComplete: boolean;
  lastName: string;
  loginVerifiredBy: LoginVerified;
  mqttTopic: string;
  phoneNumber: string;
  profileLink: string;
  profilePic: string;
  publishCount: number;
  referralCode: string;
  sellerRating: number;
  sellerRatingCount: number;
  soldAssetCount: number;
  statusCode: number;
  subscription: Subscription;
  totalAvgRating: number;
  totalRatingCount: number;
  username: string;
  website: string;
  _id: string;
}
export type FollowCountDataType = {
  totalFollower: number;
  totalFollowing: number;
  isFollow: number;
};
  
export interface SellerUserAssetResponse {
    message: string;
    result: Product[];
    Totalcount: number;
  }

export interface UserReviewType  {
    city: string;
    email: string;
    firstName: string;
    images: string[]; // Assuming images is an array of strings (URLs).
    ipaddress: string;
    lastName: string;
    latitude: number;
    linkedWith: string;
    longitude: number;
    orderId: string;
    ratedDate: string; // Assuming this is an ISO string.
    ratedTs: number;
    rating: number;
    review: string;
    reviewRatingByUserId: string;
    statusCode: number;
    statusText: string;
    userId: string;
    _id: string;
  }


export interface UserReviewsData  {
    totalCount: number;
    userReviews: UserReviewType[];
  }
  
export interface ReviewApiResponse {
    data: UserReviewsData;
    message: string;
  }

export interface AllRatingApiResponse {
    message: string;
    data: {
      fromAvgBuyerRating: string;
      fromAvgSellerRating: number;
      fromBuyerRatingCount: number;
      fromSellerRatingCount: number;
      rating: number;
      ratingCount: number;
    };
  }

export interface RatingParameter {
  parameterId: string;
  parameterTitle: string;
  rating: string;
  _id: string;
}

export interface BuyerRatingResponseData {
  avgRating: number;
  ratingCount: number;
  ratingParameter: RatingParameter[];
}

export interface BuyerRatingApiResponse {
  message: string;
  data: BuyerRatingResponseData;
}
  
export interface Followee {
  _id: string;
  start: number;
  accountId: string;
  accountUsername: string;
  accountLogo: string;
  userId: string;
  profilePic: string;
  firstName: string;
  lastName: string;
  isFollow: boolean;
}

export interface FollowersAndFollowingResponse {
  data: {
    followeeData: Followee[];
     totalCount: number;
}
}
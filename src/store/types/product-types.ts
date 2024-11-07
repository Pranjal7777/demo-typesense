export interface ResponseGetAllBannersAndProductsPayload {
    result: Product[];
    banners: Banner[];
    Totalcount:number
  }
export interface Banner {
    type: number;
    bannerTypeMsg: string;
    name?: string;
    assetSubTypeId?: string;
    categoryPath?: Paths[];
    imageWeb: string;
    imageMobile: string;
    locationName: string;
    assetTypeId?: string;
    url?: string;
  }
export interface Product {
    _id: string;
    username: string;
    assetTitle: string;
    assetTypeTitle: string;
    images: Image[];
    inSection: string;
    isProduct: string;
    isasset: string;
    units: Units;
    title: Title2;
    userId: string;
    listedByUserId: string;
    price: number;
    description: string;
    creationTs: number;
    sold: boolean;
    assetCondition: string;
    ratingCondition: string;
    statusCode: number;
    statusText: string;
    availableForExchange: boolean;
    isNegotiable: boolean;
    expiredTs: number;
    address: string;
    area: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    categories: Paths[];
    mainCategory: string;
    firstName: string;
    lastName: string;
    userName: string;
    offerId: string;
    promoteAds: PromoteAd[] | string;
    urgentSaleExpireOn: number;
    profilePic: string;
    highlightExpireOn: number;
    isUrgentToSell: boolean;
    isOffered: boolean;
    subscribPlanEndTime: string;
    isSubscribe: boolean;
    categoryPath: Paths[];
    isHighlight: boolean;
    adBumpPlanDetail: AdBumpPlanDetail;
    isLiked: boolean;
    accountId: string;
  }
  
export interface AdBumpPlanDetail {
    planId: string;
    expiryTs: number;
  }
export interface PromoteAd {
    planId: string;
    planType: number;
    planName: Title2;
    // coverageScope?: any;
    coverage: string;
    countryName: string;
    radius: string;
    duration: Duration;
    expireOn: number;
    purchaseTs: number;
    promotionPlanLogId: string;
  }
export interface Duration {
    days: number;
    hours: number;
  }
export interface Paths {
    id: string;
    title: string;
  }
export interface Title2  {
    en: string;
  }
export interface Units {
    symbol: string;
    currency_code: string;
  }
export interface Image {
    seqId: number;
    type: string;
    url: string;
    thumbnailUrl?: string;
  }
  //-----------------------------------------------------------------------------------------------------------------------
export interface ResponseGetAllHighlightedProductsPayload {
    result: Product[];
    Totalcount:number
  }

//-----------------------------------------------------------------------------------------------------------------------------


export interface ResponseSearchUsersPayload {
    users:  SearchUsers[];
  }
export interface SearchUsers {
    country: string;
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    inSection: string;
    accountId: string;
    profilePic:string;
  }
export interface ResponseSearchItemsPayload {
    data: SearchItems[];
  }

export interface SearchItems {
    assetId: string;
    assetTitle: string;
    assetTypeTitle: string;
    images: Image2[];
    accountId: string;
    price: number;
    inSection: string;
    userId: string;
    listedByUserId: string;
    isProduct: boolean;
    isasset: boolean;
    score: number;
    categoryPath: CategoryPath[];
    _id: number;
    units: number;
  }
  interface CategoryPath {
    id: string;
    title: string;
  }
  interface Image2 {
    seqId: number;
    type: string;
    url: string;
    thumbnailUrl: string;
  }

export interface ResponseGetRecentSearchDataPayload{
    data: Data;
  }
  interface Data{
    data: Datum[];
    user: RecentSearchedUser[]
    message: string
    totalCount: number
  }

export interface RecentSearchedUser {
    searchText: string
    searchIn: string
    userId: string
    userName: string
    accountId: string
    profilePic: string
    timestamp: number
  }
  interface Datum {
    searchText: string;
  }

// --------------------------------------------------------
export interface PrivacyPolicyData {
  _id: string;
  pageContent: string;
}
export interface ResponseGetPrivacyPolicyDataPayload {
  message: string;
  data: PrivacyPolicyData;
}

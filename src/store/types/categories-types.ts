export interface ResponseGetAllGrandParentCategoriesPayload {
    message: string;
    data: Category[];
    categoryPath: [];
    parentCategoryName: string;
    parentCategoryId: string;
    totalCount: number;
}
export interface ResponseGetSubCategoriesByParentIdPayload {
    message: string;
    data: Category[];
    categoryPath: [];
    parentCategoryName: string;
    parentCategoryId: string;
    totalCount: number;
}
export interface Category {
  id: string;
  titleLang: TitleLang;
  title: string;
  images: Images;
  icon: string;
  seqId: number;
  hasSubType: boolean;
  subTypesCount: number;
  shippingAvailable: boolean;
  categoryPath: CategoryPath[];
  attributesGroupCount: number;
  isPremium: boolean;
  noOfTokens: number;
  shippingType: string;
  enableBuyNowOfferFlow: boolean;
  customMakeModelsEnable: boolean;
}

export interface CategoryPath {
  title:string;
  id: string;
}
export interface Images {
  website: string;
  app: string;
  unSelectedWebIcon: string;
  unSelectedAppIcon: string;
}
export interface TitleLang {
  en: string;
  es?: string;
}
// =========================================================================================
export interface ResponseGetAllCategoriesPayload {
    data: categories[];
}
export interface categories {
    child: categories[] 
    title: Title | string;
    images: Images;
    seqId: number;
    _id: string;
    noOfTokens: number | string;
  }
export interface subCategories{
    _id: string;
    seqId: number;
    title: Title;
    images: Images;
    icon: string;
    noOfTokens: number;
    child: subSubCategories[];
  }
export interface subSubCategories{
    _id: string;
    seqId: number;
    title: Title;
    images: Images;
    icon: string;
    noOfTokens: number;
  }
export interface Title {
    en: string;
}
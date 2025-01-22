import {  AUTH_URL_V2 } from '@/config';
import { rootApi } from './root-api';
import { SIMILAR_PRODUCTS_URL } from '@/api/endpoints';

type SimilarProduct = {
 result: Root,
 Totalcount: number
};
export type Root = Root2[]

export interface Root2 {
  title: Title
  listedByUserId: string
  userId: string
  images: Image[]
  price: number
  units: Units
  description: string
  creationTs: number
  sold: boolean
  statusCode: number
  assetCondition: string
  ratingCondition: string
  statusText: string
  expiredTs: number
  availableForExchange: boolean
  isNegotiable: boolean
  address: string
  categories: Category[]
  area: string
  city: string
  state: string
  country: string
  zip: string
  mainCategory: string
  promoteAds: any
  urgentSaleExpireOn: number
  isLiked: boolean
  _id: string
  assetTitle: string
  assetTypeTitle: string
  inSection: string
  isProduct: string
  isasset: string
  score: number
  username: string
  firstName: string
  lastName: string
  userName: string
  profilePic: string
  highlightExpireOn: number
  soldReason: string
  isUrgentToSell: boolean
  subscribPlanEndTime: string
  categoryPath: CategoryPath[]
  isHighlight: boolean
}

export interface Title {
  en: string
}

export interface Image {
  seqId: number
  url: string
  type: string
  thumbnailUrl?: string
}

export interface Units {
  symbol: string
  currency_code: string
}

export interface Category {
  id: string
  title: string
}

export interface CategoryPath {
  id: string
  title: string
}

const SimilarProductsAPI = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimilarProducts: builder.query<SimilarProduct, { categoryId: string; assetName: string }>({
      query: ({ categoryId, assetName }) => ({
        url: `${AUTH_URL_V2}/${SIMILAR_PRODUCTS_URL}/?categoryId=${categoryId}&assetName=${assetName}`,
        method: 'GET',
      }),
    }),
  }),
});

export default SimilarProductsAPI;

import { Product } from "./product-types";

export type MyFavoritesResponseType = {
  message: string;
  result: Product[];
  totalCount: number;
};

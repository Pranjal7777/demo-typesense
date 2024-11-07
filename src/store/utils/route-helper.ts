
type categoryType = {
  category?: {
    id?: string;
    name?: string;
  };
  subCategory?: {
    id?: string;
    name?: string;
  };
  subSubCategory?: {
    id?: string;
    name?: string;
  };
};
export const routeToCategories = (categoryObj: categoryType) => {
  return`/categories/${
    categoryObj?.category?.id
      ? categoryObj.category.id
      : categoryObj?.subCategory?.id
        ? categoryObj.subCategory.id
        : categoryObj?.subSubCategory?.id
          ? categoryObj.subSubCategory.id
          : ''
  }`;

};

export const routeSellerProfile = (id: string) => `/seller-profile/${id}`;
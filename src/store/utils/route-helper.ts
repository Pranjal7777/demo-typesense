
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
// export const routeToCategories = (categoryObj: categoryType) => {
//   return`/categories/${
//     categoryObj?.category?.id
//       ? categoryObj.category.id 
//       : categoryObj?.subCategory?.id
//         ? categoryObj.subCategory.id
//         : categoryObj?.subSubCategory?.id
//           ? categoryObj.subSubCategory.id
//           : ''
//   }`;

// };

export const routeToCategories = (categoryObj: categoryType) => {
  const { category, subCategory, subSubCategory } = categoryObj;

  const selectedId = category?.id || subCategory?.id || subSubCategory?.id || '';
  const selectedName = category?.name || subCategory?.name || subSubCategory?.name || '';

  const baseRoute = `/categories/${selectedName}-${selectedId}`;
  // const queryParam = selectedName ? `?selectedCategory=${encodeURIComponent(selectedName)}` : '';

  return `${baseRoute}`;
};
export const routeToSearch = (categoryObj: categoryType) => {
  const { category, subCategory, subSubCategory } = categoryObj;

  const selectedId = category?.id || subCategory?.id || subSubCategory?.id || '';
  const selectedName = category?.name || subCategory?.name || subSubCategory?.name || '';

  const baseRoute = `/search/${selectedName}-${selectedId}`;
  // const queryParam = selectedName ? `?selectedCategory=${encodeURIComponent(selectedName)}` : '';

  return `${baseRoute}`;
};

export const routeSellerProfile = (id: string) => `/seller-profile/${id}`;

export const getSearchTerm = (params: any) => {
  if(!params) return '';
  const paramsArray = params['searchTerm']?.split('-');
  const searchTerm = paramsArray?.slice(0, -1).join('-');
  return searchTerm;
};

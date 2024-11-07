import React, { useState } from 'react';
import { productsApi } from '@/store/api-slices/products-api';
import ProductCard from '../ui/product-card';
import Button from '../ui/button';
import { useTranslation } from 'next-i18next';

const ProductList = () => {
  const [page, setPage] = useState(1);
  const { data: bannersAndProducts, isLoading, } = productsApi.useGetAllBannersAndProductsQuery({
    page,
    latitude: '',
    longitude: '',
    country:''
  });

  const handleLoadMore = () => {
    setPage(page + 1); 
  };

  const {t: productDetails} = useTranslation('productDetails');
  const viewmore: string = productDetails('page.viewMore');

  return (
    <div className="lg:mt-[52px] mobile:mt-[16px] w-full">
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {bannersAndProducts?.result.map((product: any, index: number) => (
          <div key={index}>
            <ProductCard key={index} product={product} />
          </div>
        ))}
      </div>
      <div className='flex items-center justify-center mt-7'>
        <Button className='w-1/3 md:w-1/6' buttonType='tertiary' onClick={handleLoadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : viewmore}
        </Button>
      </div>
    </div>
  );
};

export default ProductList;

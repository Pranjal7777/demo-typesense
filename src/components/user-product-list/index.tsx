import React, { useState } from 'react';
import ProductCard from '../ui/product-card';
import UserProductListing from '@/store/api-slices/user-listing-api';
import Button from '../ui/button';
import ProductCardSkeleton from '../ui/product-card-skeleton';

type SimilarProductsProps = {
  accoundId: string;
  page: string;
};

const UserProductList: React.FC<SimilarProductsProps> = ({ accoundId, page }) => {
  const [displayedProducts, setDisplayedProducts] = useState<number>(20);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  
  const { data, isLoading, isError, error } = UserProductListing.useGetUserProductsListingQuery({
    accoundId,
    page,
  });

  const fetchMoreData = () => {
    if (isLoadingMore) return; 

    setIsLoadingMore(true);

    setTimeout(() => {
      setDisplayedProducts(prev => prev + 20);
      setIsLoadingMore(false);
    }, 1000); 
  };

  if (isError) {
    console.error('Error fetching products:', error);
  }

  const productsToShow = data?.result.slice(0, displayedProducts) || [];
  const hasMoreProducts = data?.result.length > displayedProducts;

  return (
    <div className="lg:mt-[52px] mobile:mt-[16px] w-full">
      {(isLoading || isLoadingMore) && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(20)].map((_, index) => (
            <div key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && productsToShow.length === 0 && (
        <div className="text-center">No Products found</div>
      )}

      {data && !isLoading && !isError && productsToShow.length > 0 && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productsToShow.map((product: any, index: number) => (
            <div key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {hasMoreProducts && !isLoading && !isError && (
        <div className="text-center mt-4">
          <Button
            onClick={fetchMoreData}
            buttonType='tertiary'
            className='w-1/3 md:1/4 lg:1/6 mx-auto'
          >
            {isLoadingMore ? 'Loading...' : 'View More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProductList;

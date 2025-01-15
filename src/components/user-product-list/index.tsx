import React, { useEffect, useState } from 'react';
import ProductCard from '../ui/product-card';
import UserProductListing from '@/store/api-slices/user-listing-api';
import Button from '../ui/button';
import ProductCardSkeleton from '../ui/product-card-skeleton';

type SimilarProductsProps = {
  accoundId: string;
  page: string;
  isLikeChange?: boolean;
};

const UserProductList: React.FC<SimilarProductsProps> = ({ accoundId, page:pageNo, isLikeChange }) => {
  const [displayedProducts, setDisplayedProducts] = useState<number>(20);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(Number(pageNo));
  
  const { data, isError, error, refetch,isFetching } = UserProductListing.useGetUserProductsListingQuery({
    accoundId,
    page: page,
  });

  useEffect(() => {
      refetch();
  }, [isLikeChange,refetch]);

  // const fetchMoreData = () => {
  //   if (isLoadingMore) return; 

  //   setIsLoadingMore(true);

  //   setTimeout(() => {
  //     setDisplayedProducts(prev => prev + 20);
  //     setIsLoadingMore(false);
  //   }, 1000); 
  // };

  if (isError) {
    console.error('Error fetching products:', error);
  }


  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      if(page === 1) {
        setAllProducts(data.result);
      } else {
        setAllProducts(prev => [...prev, ...data.result]);
      }
    }
  }, [data, page]);

  const productsToShow = allProducts.slice(0, displayedProducts) || [];
  const hasMoreProducts = allProducts.length > displayedProducts;

  return (
    <div className="lg:mt-[52px] mobile:mt-[16px] w-full">
      {(isFetching || isLoadingMore) && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {!isFetching && !isError && productsToShow.length === 0 && <div className="text-center">No Products found</div>}

      {data && !isFetching && !isError && productsToShow.length > 0 && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productsToShow.map((product: any, index: number) => (
            <div key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {data && !isFetching && !isError && data.Totalcount > allProducts.length && (
        <div className="text-center mt-4">
          <Button onClick={() => setPage(page + 1)} buttonType="tertiary" className="w-1/3 md:1/4 lg:1/6 mx-auto">
            {'View More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProductList;

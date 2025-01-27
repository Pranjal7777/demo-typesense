import React, { useEffect } from 'react';
import ProductCard from '../ui/product-card';
import SimilarProductsAPI from '@/store/api-slices/similar-products-api';
import ProductCardSkeleton from '../ui/product-card-skeleton';
type SimilarProductsProps = {
  assetName: string;
  categoryId: string;
  isLikeChange?: boolean;
};

const SimilarProductsList: React.FC<SimilarProductsProps> = ({ assetName, categoryId, isLikeChange }) => {
  const { data, isFetching, isError, error, refetch } = SimilarProductsAPI.useGetSimilarProductsQuery({
    assetName,
    categoryId,
  });

  useEffect(() => {
      refetch();
  }, [isLikeChange]);

  if (isError) {
    console.error('Error fetching similar products:', error);
  }
  return (
    <div className="lg:mt-[52px] mobile:mt-[16px] w-full">
      {isFetching && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {!isFetching && !isError && !data && <div className="text-center">No Products found</div>}

      {data && !isFetching && !isError && data?.result?.length > 0 && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.result.map((product: any, index: number) => (
            <div key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarProductsList;

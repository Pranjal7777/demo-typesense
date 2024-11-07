import React from 'react';
import ProductCard from '../ui/product-card';
import SimilarProductsAPI from '@/store/api-slices/similar-products-api';
import ProductCardSkeleton from '../ui/product-card-skeleton';
type SimilarProductsProps = {
  assetId: string;
  categoryId: string;
};

const SimilarProductsList: React.FC<SimilarProductsProps> = ({ assetId, categoryId }) => {
  const { data, isLoading, isError, error } = SimilarProductsAPI.useGetSimilarProductsQuery({
    assetId,
    categoryId,
  });

  if (isError) {
    console.error('Error fetching similar products:', error);
  }
  return (
    <div className="lg:mt-[52px] mobile:mt-[16px] w-full">
      {isLoading && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && data?.result.length === 0 && <div className="text-center">No Products found</div>}

      {data && !isLoading && !isError && data?.result?.length > 0 && (
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

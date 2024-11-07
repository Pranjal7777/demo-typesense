import React from 'react';
import { Product } from '@/store/types';
import ProductCard from '@/components/ui/product-card';


interface Props {
  products: Product[];
}



const RecommendedProduct: React.FC<Props> = ({ products}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-x-5 gap-y-7">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default RecommendedProduct;

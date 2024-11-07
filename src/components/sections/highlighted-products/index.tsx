import React from 'react';
import { Product } from '@/store/types';
// import NewProductCard from '@/components/Ui/NewProductCard';
// import ProductCard from '@/components/Ui/ProductCard';
import NewProductCard from '@/components/ui/new-product-card';

interface Props {
  products: Product[];
}

const HighlightedProducts: React.FC<Props> = ({ products }) => {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-2 md:gap-y-7">
      {products.map((product, index) => (
        <NewProductCard key={index} product={product}/>
      ))}
    </div>
  );
};

export default HighlightedProducts;

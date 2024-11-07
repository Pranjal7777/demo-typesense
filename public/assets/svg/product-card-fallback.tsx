import React from 'react';

type ProductCardFallbackProps = {
  width?: string;
  height?: string;
};

const ProductCardFallback: React.FC<ProductCardFallbackProps> = ({ height = 240, width = 240 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 240 240" fill="color" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="240" fill="#F0F0F0" />
      <mask
        id="mask0_3404_11626"
        style={{maskType:'alpha'}}
        maskUnits="userSpaceOnUse"
        x="96"
        y="96"
        width="48"
        height="48"
      >
        <rect x="96" y="96" width="48" height="48" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3404_11626)">
        <path
          d="M106.615 137C105.605 137 104.75 136.65 104.05 135.95C103.35 135.25 103 134.395 103 133.385V106.616C103 105.606 103.35 104.75 104.05 104.05C104.75 103.35 105.605 103 106.615 103H133.384C134.395 103 135.25 103.35 135.95 104.05C136.65 104.75 137 105.606 137 106.616V133.385C137 134.395 136.65 135.25 135.95 135.95C135.25 136.65 134.395 137 133.384 137H106.615ZM106.615 134H133.384C133.538 134 133.679 133.936 133.807 133.808C133.936 133.68 134 133.539 134 133.385V106.616C134 106.462 133.936 106.321 133.807 106.193C133.679 106.065 133.538 106 133.384 106H106.615C106.461 106 106.32 106.065 106.192 106.193C106.064 106.321 106 106.462 106 106.616V133.385C106 133.539 106.064 133.68 106.192 133.808C106.32 133.936 106.461 134 106.615 134ZM109.5 129.5H130.653L124.077 120.731L118.461 128.039L114.462 122.923L109.5 129.5Z"
          fill="#B7B7B7"
        />
      </g>
    </svg>
  );
};

export default ProductCardFallback;

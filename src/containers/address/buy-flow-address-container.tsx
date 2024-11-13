import React, { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const BuyFlowAddressContainer:FC<Props> = ({children}) =>{
  return (
    <div>
      {children}
    </div>
  );
};

export default BuyFlowAddressContainer;
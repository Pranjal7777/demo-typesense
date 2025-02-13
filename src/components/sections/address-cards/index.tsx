import AddressCard from '@/components/ui/address-card';
import AddressCardSkeleton from '@/components/ui/address-skeleton/address-card-skeleton';
import AddressContainer from '@/containers/address';
import Placeholder from '@/containers/placeholder/placeholder';
import keyDownHandler from '@/helper/key-down-handler';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { AddressType, UserInfoType } from '@/store/types/profile-type';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useMemo } from 'react';
import { NO_ADDRESS } from '../../../../public/images/placeholder';
import Button from '@/components/ui/button';

export type Props = {
  defaultButtonHandler: (_id:string)=>void;
  clickEvent: () => void;
  deleteButtonHandler: (_id: string) => void;
  editButtonHandler: (_item: UserInfoType) => void;
  mobileEditBtn: (_item: UserInfoType) => void;
};

const AddressCards: FC<Props> = ({
  clickEvent,
  deleteButtonHandler,
  editButtonHandler,
  mobileEditBtn,
  defaultButtonHandler
}) => {
 
  const router = useRouter();
  const { data, error, isLoading } = addressApi.useGetAllSavedAddressQuery();
  useEffect(()=>{
    if(error){
      router.push('/500');
    }
  },[error]);

  const allSavedAddress:AddressType[] | null = useMemo(()=>{
    const defaultItem = data?.data?.filter((item) => item.isDefault);
    const otherItems = data?.data?.filter((item) => !item.isDefault);
    if(defaultItem && otherItems){
      const sortedData = [...defaultItem, ...otherItems];
      return sortedData;
    }
    if(defaultItem){
      return defaultItem;
    }
    if(otherItems){
      return otherItems;
    }
    return null;
  },[data]);
  

  return (
    <AddressContainer className='mb-16 md:mb-0'>
      {data && data?.data?.length > 0 && (
        <div
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            keyDownHandler(e, clickEvent);
          }}
          onClick={clickEvent}
          className="hidden cursor-pointer dark:bg-bg-primary-dark border border-[#DBDBDB]  dark:border-[#3D3B45] min-h-[137px] md:min-h-full  sm:flex justify-center items-center text-[16px] font-[600]  dark:text-text-secondary-light  w-[100%] p-[9px] max-h-fit rounded-[8px] max-w-[427px]  min-w-[320px] md:min-w-[289px] lg:min-w-fit"
        >
          + Add New Address
        </div>
      )}

      {isLoading ? (
        [...Array(6)].map((_, index) => <AddressCardSkeleton key={index} />)
      ) : error ? (
        <h1>Something went wrong. Please try later.</h1>
      ) : allSavedAddress && allSavedAddress.length > 0 ? (
        allSavedAddress?.map((item) => (
          <AddressCard
            defaultButtonHandler={defaultButtonHandler}
            defaultButton={item.isDefault}
            item={item}
            key={item._id}
            deleteButtonHandler={deleteButtonHandler}
            editButtonHandler={editButtonHandler}
            mobileEditBtn={mobileEditBtn}
          />
        ))
      ) : null}
      {((!data && !isLoading) || (data && data?.data?.length == 0)) && (
        <div className="w-[95%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Placeholder
            src={NO_ADDRESS}
            title="Add New Address"
            titleClassName="font-bold md:text-2xl mb-2"
            description="Provide the necessary details to add a new address"
          />
          <Button className="w-full max-w-[413px] mx-auto mt-7 hidden md:block" onClick={clickEvent}>
            Add New Address
          </Button>
        </div>
      )}
    </AddressContainer>
  );
};

export default AddressCards;

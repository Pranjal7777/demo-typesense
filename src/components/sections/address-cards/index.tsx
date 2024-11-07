import AddressCard from '@/components/ui/address-card';
import AddressCardSkeleton from '@/components/ui/address-skeleton/address-card-skeleton';
import AddressContainer from '@/containers/address';
import keyDownHandler from '@/helper/key-down-handler';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { UserInfoType } from '@/store/types/profile-type';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

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
  

  return (
    <AddressContainer>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          keyDownHandler(e, clickEvent);
        }}
        onClick={clickEvent}
        className="hidden cursor-pointer dark:bg-bg-primary-dark border border-[#DBDBDB]  dark:border-[#3D3B45] min-h-[137px]  sm:flex justify-center items-center text-[16px] font-[600]  dark:text-text-secondary-light  w-[100%] p-[9px] max-h-fit rounded-[8px] max-w-[427px]  min-w-[320px] md:min-w-[289px] lg:min-w-fit"
      >
        + Add New Address
      </div>

      {isLoading ? (
        [...Array(6)].map((_, index) => (
          <AddressCardSkeleton key={index} />
        ))
      ) : error ? (
        <h1>Something went wrong. Please try later.</h1>
      ):data?.data?.length == 0  ? ( <strong>No data found. Please add a new address.</strong> ) : (
        data?.data?.map((item) => (
          <AddressCard
            defaultButtonHandler ={defaultButtonHandler}
            defaultButton={item.isDefault}
            item ={item}
            key={item._id}
            deleteButtonHandler={deleteButtonHandler}
            editButtonHandler={editButtonHandler}
            mobileEditBtn={mobileEditBtn}
          />
        ))
      )}
    </AddressContainer>
  );
};

export default AddressCards;

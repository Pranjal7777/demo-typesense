import BuyFlowAddressTile from '@/components/ui/address-card/buy-flow-address-tile';
import AddressCardSkeleton from '@/components/ui/address-skeleton/address-card-skeleton';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { UserInfoType } from '@/store/types/profile-type';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import CrossIcon from '../../../../public/images/cross-icon.svg';
import CrossIconWhite from '../../../../public/images/cross_icon_white.svg';
import { ADD_ADDRESS, ADDRESS, NO_DATA_FOUND_ADDRESS, SOMETHING_WRONG } from '@/constants/texts';
import BuyFlowAddressContainer from '@/containers/address/buy-flow-address-container';

export type Props = {
  defaultButtonHandler: (_id: string) => void;
  clickEvent: () => void;
  deleteButtonHandler: (_id: string) => void;
  editButtonHandler: (_item: UserInfoType) => void;
  mobileEditBtn: (_item: UserInfoType) => void;
  toggleEnterAddress: () => void;
  setIsOpenAddressModel: (_value: boolean) => void;
};

const BuyFlowAddressCards: FC<Props> = ({
  clickEvent,
  deleteButtonHandler,
  editButtonHandler,
  defaultButtonHandler,
  toggleEnterAddress,
  setIsOpenAddressModel,
}) => {
  const router = useRouter();
  const { data, error, isLoading } = addressApi.useGetAllSavedAddressQuery();
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const defaultAddress = data?.data?.find((address) => address.isDefault) || data?.data?.[0];

  useEffect(() => {
    if (error) {
      router.push('/500');
    }
  }, [error]);


  const handleChangeClick = (view: string) => {
    if (view === 'mobile') {
      setIsOpenAddressModel(true);
    } else {
      setShowAllAddresses(true);
    }
  };

  if (isLoading) {
    return <AddressCardSkeleton />;
  }

  if (error) {
    return <h1>{SOMETHING_WRONG}</h1>;
  }

  if (!data?.data?.length) {
    return <strong>{NO_DATA_FOUND_ADDRESS}</strong>;
  }

  return (
    <BuyFlowAddressContainer>
      {!showAllAddresses && defaultAddress ? (
        <div className="w-full">
          <BuyFlowAddressTile
            defaultButtonHandler={defaultButtonHandler}
            defaultButton={true}
            item={defaultAddress}
            key={defaultAddress._id}
            deleteButtonHandler={deleteButtonHandler}
            editButtonHandler={editButtonHandler}
            handleChangeClick={handleChangeClick}
            showAllAddresses={showAllAddresses} 
          />
        </div>
      ) : (
        <>
          <div className="bg-[white] flex flex-col dark:bg-bg-primary-dark  border border-border-tertiary-light  dark:border-border-tertiary-dark p-4 rounded-[8px]  w-full ">
            <div className="flex justify-between px-1">
              <h2 className="text-xl font-semibold  dark:text-white mb-4">{ADDRESS}</h2>
              <div>
                {' '}
                <span>
                  <Image
                    width={12}
                    height={12}
                    className="cursor-pointer hover:scale-110 dark:hidden"
                    onClick={() => setShowAllAddresses(false)}
                    src={CrossIcon}
                    alt="cross_icon"
                  />
                </span>
                <span>
                  <Image
                    width={12}
                    height={12}
                    className="cursor-pointer hover:scale-110 dark:block hidden"
                    onClick={() => setShowAllAddresses(false)}
                    src={CrossIconWhite}
                    alt="cross_icon"
                  />
                </span>
              </div>
            </div>
            <div className="bg-[white] flex flex-col dark:bg-bg-primary-dark  border border-border-tertiary-light  dark:border-border-tertiary-dark p-[2px] rounded-[8px]  w-full removeLastChildBorder">
              {data.data.map((item) => (
                <BuyFlowAddressTile
                  defaultButtonHandler={defaultButtonHandler}
                  defaultButton={item.isDefault}
                  item={item}
                  key={item._id}
                  deleteButtonHandler={deleteButtonHandler}
                  editButtonHandler={editButtonHandler}
                  handleChangeClick={handleChangeClick}
                  showAllAddresses={showAllAddresses}
                />
              ))}
            </div>
            {/* for desktop */}
            <button
              className="hidden lg:block text-brand-color pt-4 text-sm font-medium cursor-pointer text-start"
              onClick={clickEvent}
            >
              {ADD_ADDRESS}
            </button>
            {/* for mobile */}
            <button
              className="lg:hidden text-brand-color pt-4 text-sm font-medium cursor-pointer text-start"
              onClick={toggleEnterAddress}
            >
              {ADD_ADDRESS}
            </button>
          </div>
        </>
      )}
      <style jsx>{`
        :global(.removeLastChildBorder > div:last-child) {
          border-bottom: none;
        }
        :global(.removeLastChildBorder > div) {
          padding-bottom: 0px !important;
        }
      `}</style>
    </BuyFlowAddressContainer>
  );
};

export default BuyFlowAddressCards;

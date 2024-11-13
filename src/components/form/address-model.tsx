import React, { Dispatch, SetStateAction } from 'react';
import Button from '../ui/button';
import Image from 'next/image';
import CrossIconWhite from '../../../public/images/cross_icon_white.svg';
import CrossIcon from '../../../public/images/cross-icon.svg';
import EditIcon from '../../../public/assets/images/edit_square_white.svg';
import EditIconBlack from '../../../public/assets/images/edit_square.svg';
import DeleteIcon from '../../../public/assets/images/delete_red.svg';
import { AddressType, UserInfoType } from '@/store/types/profile-type';
import { ADD_NEW_ADDRESS, DEFAULT, MAKE_DEFAULT, SELECT_ADDRESS } from '@/constants/texts';

interface AddressModelProps {
  addresses: AddressType[];
  deleteButtonHandler: (_id: string) => void;
  toggleEnterAddress: () => void;
  defaultButtonHandler: (_id: string) => void;
  setIsOpenAddressModel: Dispatch<SetStateAction<boolean>>;
  mobileEditBtn: (_item: UserInfoType) => void;
}

export default function AddressModel({
  addresses,
  setIsOpenAddressModel,
  deleteButtonHandler,
  toggleEnterAddress,
  defaultButtonHandler,
  mobileEditBtn,
}: AddressModelProps) {
  return (
    <div className="fixed inset-0 bg-white z-20 overflow-y-auto dark:bg-bg-primary-dark">
      <header
        className={`sticky top-0 block lg:hidden bg-white dark:bg-bg-secondary-dark   p-4`}
      >
        <div className="flex items-center justify-center relative h-8 ">
          <Image
            className="cursor-pointer hover:scale-110 absolute right-0 top-1 dark:hidden z-10"
            width={16}
            height={16}
            src={CrossIcon}
            alt="back-arrow-icon"
            onClick={() => {
              setIsOpenAddressModel(false);
            }}
          />
          <Image
            className="cursor-pointer hover:scale-110 absolute right-0 top-1 "
            width={16}
            height={16}
            src={CrossIconWhite}
            alt="back-arrow-icon"
            onClick={() => {
              setIsOpenAddressModel(false);
            }}
          />
          <p className="text-xl font-semibold dark:text-white">{SELECT_ADDRESS}</p>
        </div>
      </header>
      <div className="p-4 mobile:h-full overflow-y-auto mobile:!pb-[200px] dark:bg-bg-secondary-dark">
        {addresses?.map((address) => (
          <div key={address._id} className="border dark:border-border-tertiary-dark rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold dark:text-white">{address.name}</h3>
                <p className="text-sm text-gray-600 mt-2 dark:text-secondary-dark ">
                  {address.addressLine1}, {address.addressLine2}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center ">
              {address.isDefault ? (
                <span className="text-sm font-semibold inline-block dark:text-gray-300 mt-3">{DEFAULT}</span>
              ) : (
                <button
                  className="text-sm text-brand-color mt-3 font-semibold"
                  onClick={() => defaultButtonHandler(address?._id)}
                >
                  {MAKE_DEFAULT}
                </button>
              )}
              <div className="flex justify-between items-center gap-4 mt-4">
                <button className="hidden mobile:block" onClick={() => {
                  mobileEditBtn(address);
                }}>
                  <Image className='hidden dark:block' src={EditIcon} alt="edit-icon" width={18} height={20} />
                  <Image className='block dark:hidden' src={EditIconBlack} alt="edit-icon" width={20} height={20} />
                </button>
                <button onClick={() => deleteButtonHandler(address._id)}>
                  <Image className='' src={DeleteIcon} alt="trash-icon" width={22} height={22} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-bg-secondary-dark">
          <Button
            onClick={()=>{
              toggleEnterAddress();
              setIsOpenAddressModel(false);
            }}
            className="w-full bg-brand-color hover:bg-brand-color-dark text-white mobile:!mb-0"
          >
            {ADD_NEW_ADDRESS}
          </Button>
        </div>
      </div>
    </div>
  );
}

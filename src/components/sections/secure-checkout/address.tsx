import AddressModel from '@/components/form/address-model';
import { AddressType, UserInfoType } from '@/store/types/profile-type';
import { Dispatch, SetStateAction } from 'react';

export interface AddressSectionProps {
  data: AddressType[];
  mobileEditBtn: (_item: UserInfoType) => void;
  isOpenAddressModel: boolean;
  setIsOpenAddressModel: Dispatch<SetStateAction<boolean>>;
  editButtonHandler: (_item: UserInfoType) => void;
  deleteButtonHandler: (_id: string) => void;
  toggleEnterAddress: () => void;
  defaultButtonHandler: (_id: string) => void;
}

export const AddressSection = ({
  isOpenAddressModel,
  setIsOpenAddressModel,
  deleteButtonHandler,
  toggleEnterAddress,
  defaultButtonHandler,
  data,
  mobileEditBtn,
}: AddressSectionProps) => {
  return (
    <>
      {/* add and edit address form popup for mobile */}
      {isOpenAddressModel && (
        <div className="px-4 mt-6">
          <AddressModel
            addresses={data }
            setIsOpenAddressModel={setIsOpenAddressModel}
            deleteButtonHandler={deleteButtonHandler}
            toggleEnterAddress={toggleEnterAddress}
            defaultButtonHandler={defaultButtonHandler}
            mobileEditBtn={mobileEditBtn}
          />  
        </div>
      )}
    </>
  );
};

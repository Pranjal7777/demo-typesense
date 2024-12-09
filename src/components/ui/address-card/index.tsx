import React, { FC, useState } from 'react';
import DeleteIcon from '../../../../public/assets/svg/delete-icon';
import EditIcon from '../../../../public/assets/svg/edit-icon';
import { useTheme } from '@/hooks/theme';
import {  UserInfoType } from '@/store/types/profile-type';

export type Props = {
  item: UserInfoType;
  defaultButton: boolean;
  deleteButtonHandler: (_id: string) => void;
  editButtonHandler: (_item: UserInfoType) => void;
  mobileEditBtn: (_item: UserInfoType) => void;
  defaultButtonHandler : (_id:string)=>void;
};
const AddressCard: FC<Props> = ({
  item,
  deleteButtonHandler,
  editButtonHandler,
  mobileEditBtn,
  defaultButtonHandler
}) => {

  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="bg-[white] flex flex-col dark:bg-bg-primary-dark  border border-[#DBDBDB]  dark:border-[#3D3B45] p-[9px] rounded-[8px] max-w-[427px] min-w-[340px] md:min-w-[289px] ">
      <div className="text-[#202020] dark:text-text-primary-dark font-semibold leading-[24px] ">
        <strong className="text-[16px]">{`${item.name}`} </strong>
        <span className="text-[14px]">{` (${
          item.addressTypeAttribute == '6617b871a86bb50e82fda3ce'
            ? 'Business'
            : item.addressTypeAttribute == '6617b87aa86bb50e82fda3cf'
            ? 'Residence'
            : 'Other'
        })`}</span>
      </div>
      <p className="text-[#57585A] dark:text-[#929293] text-[12px] md:text-[14px] leading-[18px] md:leading-[21px] py-[15px]">
        {item.addressLine1}
      </p>
      <div className="flex-grow"></div>
      <div className="w-full flex justify-between ">
        <button
          onClick={() => {
            defaultButtonHandler(item._id);
          }}
          className={
            (item.isDefault
              ? 'bg-brand-color text-[#FFFFFF]'
              : 'text-brand-color  dark:bg-bg-primary-dark bg-[white]') +
            ' border border-brand-color text-[12px] leading-[18px] rounded-[36px] py-[4px] px-[16px] '
          }
        >
          {item.isDefault ? 'Default' : 'Make Default'}
        </button>
        <div className="flex gap-[16px]">
          <EditIcon
            className="hidden sm:inline-block"
            onClick={() => {
              editButtonHandler(item);
            }}
            alt={'white_edit_icon'}
            primaryColor={theme ? '#FFFFFF' : '#000000'}
          />

          <EditIcon
            className="sm:hidden"
            onClick={() => {
              mobileEditBtn(item);
            }}
            alt={'white_edit_icon'}
            primaryColor={theme ? '#FFFFFF' : '#000000'}
          />

          <DeleteIcon
            onClick={() => {
              deleteButtonHandler(item._id);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            alt={'white_delete_icon'}
            primaryColor={isHovered ? '#FF0000' : theme ? '#FFF' : '#000000'}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressCard;

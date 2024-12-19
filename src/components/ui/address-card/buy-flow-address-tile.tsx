import React, { FC} from 'react';
import EditIcon from '../../../../public/assets/svg/edit-icon';
import { UserInfoType } from '@/store/types/profile-type';
import { CHANGE, DEFAULT, EDIT_ADDRESS, MAKE_DEFAULT } from '@/constants/texts';

export type Props = {
  item: UserInfoType;
  defaultButton: boolean;
  deleteButtonHandler: (_id: string) => void;
  editButtonHandler: (_item: UserInfoType) => void;
  defaultButtonHandler: (_id: string) => void;
  handleChangeClick: (_type: string) => void;
  showAllAddresses: boolean;
};
const BuyFlowAddressTile: FC<Props> = ({
  item,
  deleteButtonHandler,
  editButtonHandler,
  defaultButtonHandler,
  handleChangeClick,
  showAllAddresses
}) => {

  return (

    <div className={`bg-[white] flex flex-col dark:bg-bg-primary-dark  mobile:p-4 p-6 rounded-[8px] dark:border-b-border-tertiary-dark   w-full ${!showAllAddresses ? 'border border-border-tertiary-light  dark:border-border-tertiary-dark' : 'border-b mobile:border-border-tertiary-dark  rounded-none'}`}>
      {!showAllAddresses && <div className='flex justify-between'>
        <h2 className="text-xl font-semibold  dark:text-white mb-4">{'Address'}</h2>
        {/* change address icon for mobile */}
        <EditIcon
          className='mobile:!block hidden'
          onClick={()=>{
            handleChangeClick('mobile');
          }}
          alt={'white_edit_icon'}
          primaryColor={'var(--brand-color)'}
          width='22'
          height='22'
        />
      </div>}
      <div className="text-text-primary-light dark:text-text-primary-dark font-medium leading-[24px] ">
        <div className='flex justify-between'>
          <div>
            <strong className='text-[16px]'>{`${item.name} `} </strong>
            <span className='text-[14px]'>{` (${item.addressTypeAttribute == '6617b871a86bb50e82fda3ce' ? 'Business' : item.addressTypeAttribute == '6617b87aa86bb50e82fda3cf' ? 'Residence' : 'Other'})  ${item.isDefault && !showAllAddresses ? '- Default' : ''}`}</span>
          </div>
          <div>
            {showAllAddresses && <button
              onClick={() => {
                defaultButtonHandler(item._id);
              }}
              className={
                (item.isDefault ? 'border border-gray-400  text-gray' : ' text-brand-color border-brand-color dark:bg-bg-primary-dark bg-[white]') +
                ' border text-[12px] leading-[18px] rounded-[36px] py-[8px] px-[16px] h-fit font-medium mobile:py-[6px] mobile:px-[14px]'
              }
            >
              {item.isDefault ? DEFAULT : MAKE_DEFAULT}
            </button>}
          </div>
        </div>
      </div>
      <div className='flex justify-between'>
        <p className={`text-text-tertiary-light   dark:text-text-septenary-light text-[12px] md:text-[14px] leading-[18px] md:leading-[21px] lg:py-[15px] lg:!pt-0 w-[80%] mobile:!w-full mobile:!pt-2 mobile:!pb-0 ${showAllAddresses && 'mobile:!pb-[15px]'}`}>
          <span className={`${!showAllAddresses && 'block lg:mt-2'}`} >{item.addressLine1}  {showAllAddresses && <span> | <button className='text-brand-color cursor-pointer' onClick={() => editButtonHandler(item)} >{EDIT_ADDRESS}</button> |  <button className='text-red-500 cursor-pointer' onClick={() => deleteButtonHandler(item._id)}>Delete </button> </span>}</span>
        </p>

        {!showAllAddresses && <button
          onClick={() => handleChangeClick('desktop')}
          className="hidden lg:!block w-fit h-fit text-[12px] border border-brand-color text-brand-color dark:text-brand-color py-[7px] px-[27px] rounded transition duration-200 my-auto font-semibold "
        >
          {CHANGE}
        </button>}
      </div>
    </div>

  );
};

export default BuyFlowAddressTile;

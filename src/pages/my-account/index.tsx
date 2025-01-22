import Header from '@/components/sections/header';
import Button from '@/components/ui/button';
import { ADD_NEW_ACCOUNT, ADD_NEW_ACCOUNT_PLACEHOLDER, CONTINUE, MANAGE_ACCOUNTS } from '@/constants/texts';
import { useTheme } from '@/hooks/theme';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react'
import LeftArrowIcon from '../../../public/assets/svg/left-arrow-icon';
import Placeholder from '@/containers/placeholder/placeholder';
import { NO_ACCOUNT } from '../../../public/images/placeholder';
import { addressApi } from '@/store/api-slices/profile/address-api';
import PaymentOptionForm from '@/components/form/payment-option-form';
import { myAccountApi } from '@/store/api-slices/my-account/my-account';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AddBankAccount from './payment';


const MyAccount = () => {
    const {userInfo} = useSelector((state: RootState) => state.auth);
    const { refetch, data: addressData } = addressApi.useGetAllSavedAddressQuery();
    const [selectedAddress, setSelectedAddress] = useState(addressData?.data?.filter((item) => item.isDefault)?.[0]);
      useEffect(() => {
        if (addressData?.data?.length! > 0) {
          const defaultAddress = addressData?.data?.find((item: any) => item.isDefault);
          setSelectedAddress(defaultAddress || addressData?.data?.[0]);
        }
      }, [addressData?.data]);
    const {theme} = useTheme();
    const {data: accountsData, isFetching: isFetchingAccounts} = myAccountApi.useGetAllAccountsQuery({userId: userInfo?._id || ''});
    console.log(accountsData, 'accountsData');
  return (
    <div className="w-full text-text-primary-light min-h-screen  overflow-x-hidden dark:text-text-secondary-light">
      <div className=" hidden md:block text-text-primary-light dark:text-text-secondary-light">
        <Header stickyHeaderWithSearchBox />
      </div>
      <div className="max-w-[1440px] mx-auto px-[4%] md:px-[64px] h-full md:mt-[69px] flex flex-col text-text-primary-light dark:text-text-secondary-light">
        <div className="w-full max-w-[1440px] mx-auto px-[4%] md:px-[64px] flex justify-center md:justify-between items-center h-fit py-5 md:h-[76px] fixed top-0 left-0 right-0 md:mt-[69px] bg-white dark:bg-bg-primary-dark">
          <LeftArrowIcon
            primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
            height="15"
            width="15"
            className="md:hidden absolute left-4"
          />
          <h1 className="text-lg md:text-2xl font-semibold">Payment Methods</h1>
          {/* <Button className="w-[198px] mb-0 mobile:hidden">{CONTINUE}</Button> */}
        </div>
        {((accountsData?.financialConnectionsData && accountsData?.financialConnectionsData?.length > 0) ||
          isFetchingAccounts) && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-[76px] mb-[70px]">
            <div className="w-full hidden md:block cursor-pointer p-5 border text-brand-color text-center border-border-tertiary-light dark:border-border-tertiary-dark rounded-lg">
              {MANAGE_ACCOUNTS}
            </div>
            {accountsData?.financialConnectionsData &&
              accountsData?.financialConnectionsData?.length > 0 &&
              accountsData?.financialConnectionsData?.map((item) => (
                <div
                  key={item.id}
                  className="w-full p-5 border border-border-tertiary-light dark:border-border-tertiary-dark rounded-lg"
                >
                  {`${item?.us_bank_account?.bank_name || ''} xxxx ${item?.us_bank_account?.last4 || ''}`}
                </div>
              ))}
            {isFetchingAccounts && [...Array(10)].map((_, index) => <Skeleton key={index} height={60} width="100%" />)}
          </div>
        )}

        {(!isFetchingAccounts && (!accountsData || accountsData?.financialConnectionsData?.length < 1 ))&& (
          <div className="w-full px-4 max-w-[413px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Placeholder src={NO_ACCOUNT} title={ADD_NEW_ACCOUNT} description={ADD_NEW_ACCOUNT_PLACEHOLDER} />
            <Button className="w-full mb-0 mt-7 md:block hidden">{ADD_NEW_ACCOUNT}</Button>
          </div>
        )}
        <div className="w-full bg-white dark:bg-bg-primary-dark fixed bottom-0 left-0 right-0 px-4 py-2 flex justify-center items-center md:hidden">
          <Button className="w-full !mb-0 !m-0">{MANAGE_ACCOUNTS}</Button>
        </div>
      </div>
      <PaymentOptionForm selectedAddressId={selectedAddress?._id ?? ''} />
      <AddBankAccount />
    </div>
  );
}

export default MyAccount;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
}
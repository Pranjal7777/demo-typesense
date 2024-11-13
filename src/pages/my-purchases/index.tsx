import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useRef, useState } from 'react';
import LeftArrowIcon from '../../../public/assets/svg/left-arrow-icon';
import TabbedSearch from '@/components/tabs-search';
import PurchaseContainer from '@/containers/purchase';
import Header from '@/components/sections/header';
import { useRouter } from 'next/router';
import SoldContainer from '@/containers/sold';
import { buildQueryString } from '@/helper/build-query-string';
import { myPurchaseApi } from '@/store/api-slices/my-purchase/my-purchase-api';
import debounce from 'lodash.debounce';
import FilterBarIcon from '../../../public/assets/svg/filter-bar-icon';
import FilterPopup from '@/components/ui/filter-popup';
import { useTheme } from '@/hooks/theme';

const tabs = ['Purchased', 'Sold'];
const MyPurchases = () => {
  const router = useRouter();
  const {theme} = useTheme()
  const [currenTab, setCurrenTab] = useState('Purchased');
  const [showPurchaseDetailsMobile, setShowPurchaseDetailsMobile] = useState<boolean>(false);
  const [showSoldDetailsMobile, setShowSoldDetailsMobile] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const debouncedSetSearchTerm = debounce(setDebouncedSearchText, 300);
const [showMobileFilterPopup, setShowMobileFilterPopup] = useState(false)
const [isMobile, setIsMobile] = useState(false);
const [showOrderId, setShowOrderId] = useState('');
const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (selectedValues: string[]) => {
    setSelectedFilters(selectedValues);
  };

  const filterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Last month', value: '1' },
    { label: 'Last 2 months', value: '2' },
    { label: 'Last 3 Months', value: '3' },
    { label: 'Last 4 Months', value: '4' },
    { label: 'Last 5 Months', value: '5' },
  ];

  useEffect(() => {
    debouncedSetSearchTerm(searchText);
  }, [searchText]);

  const onTabChange = (tab: string) => {
    setCurrenTab(tab);
  };
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const { data, refetch, isFetching } = myPurchaseApi.useGetAllPurchasesQuery({
    queryParams: buildQueryString({
      ...(debouncedSearchText && { searchText: debouncedSearchText }),
      ...(selectedFilters.length > 0 && selectedFilters[0] != 'ALL' && { timeFilter: selectedFilters[0] }),
    }),
  });

  useEffect(() => {
    refetch();
  }, [selectedFilters]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && showPurchaseDetailsMobile && showSoldDetailsMobile) {
        setShowPurchaseDetailsMobile(false);
        setShowSoldDetailsMobile(false);
      }
      if (window.innerWidth < 768 && showPurchaseDetailsMobile && showSoldDetailsMobile) {
        setShowPurchaseDetailsMobile(false);
        setShowSoldDetailsMobile(false);
      }
      if (window.innerWidth < 768 && !isMobile) {
        setIsMobile(true);
      }
      if (window.innerWidth > 768) {
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event:MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowMobileFilterPopup(false)
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onFilterBarIconClick = ()=>{   
      setShowMobileFilterPopup(prev=>!prev);
  }

  return (
    <div className="w-full text-text-primary-light h-screen overflow-hidden dark:text-text-secondary-light">
      <div className=" hidden md:block text-text-primary-light dark:text-text-secondary-light">
        <Header stickyHeaderWithSearchBox />
      </div>
      <div className="max-w-[1440px] mx-auto px-[4%] md:px-[64px] h-full md:mt-[69px] flex flex-col text-text-primary-light dark:text-text-secondary-light">
        {showPurchaseDetailsMobile || showSoldDetailsMobile ? (
          <div className="w-full md:hidden">
            <div className=" relative flex flex-col justify-center md:justify-start items-center text-lg md:text-2xl font-semibold py-5">
              <LeftArrowIcon
              primaryColor={theme ? '#FFF' : '#202020'} 
                onClick={() => {
                  setShowPurchaseDetailsMobile(false);
                  setShowSoldDetailsMobile(false);
                }}
                height="15"
                width="15"
                className="md:hidden absolute left-0"
              />
              <h1 className='text-base'> Order Details</h1>
              <span className=' text-sm font-normal text-text-septenary-light'>OID:{showOrderId}</span>
            </div>
          </div>
        ) : null}

        {!showPurchaseDetailsMobile && !showSoldDetailsMobile && (
          <div className="w-full md:hidden">
            <div className=" relative  flex justify-center md:justify-start items-center text-lg md:text-2xl font-semibold py-5">
              <LeftArrowIcon onClick={()=>router.back()} primaryColor={theme ? '#FFF' : '#202020'}  height="15" width="15" className="md:hidden absolute left-0 " />
              <h1>My purchases</h1>
              <FilterBarIcon primaryColor={theme ? '#FFF' : '#202020'} onClick={onFilterBarIconClick} className='md:hidden absolute right-0'/>
            </div>
            <TabbedSearch
              isFilterInclude={true}
              searchValue={searchText}
              onInputChange={onInputChange}
              tabs={tabs}
              onTabChange={onTabChange}
              currenActiveTab={currenTab}
              onSelectionChange={handleFilterChange}
              selectedFilters={selectedFilters}
              filterOptions={filterOptions}
              filterIconWrapperClass='hidden md:block'
            />
            {
              showMobileFilterPopup && <FilterPopup
              ref = {popupRef}
              selectedValues={selectedFilters || []}
                containerClass={'right-[10px]'}
                options={filterOptions}
                onSelectionChange={handleFilterChange}
                filterType={ "RADIO"}
                filterHeaderText = { 'Filter'}
              />
            }
          </div>
        )}

        {!isMobile && (
          <div className="w-full hidden md:block">
            <div className=" relative  flex justify-center md:justify-start items-center text-lg md:text-2xl font-semibold py-5">
              <LeftArrowIcon primaryColor={theme ? '#FFF' : '#202020'} height="15" width="15" className="md:hidden absolute left-0 " />
              <h1>My purchases</h1>
            </div>
            <TabbedSearch
              isFilterInclude={true}
              searchValue={searchText}
              onInputChange={onInputChange}
              tabs={tabs}
              onTabChange={onTabChange}
              currenActiveTab={currenTab}
              onSelectionChange={handleFilterChange}
              selectedFilters={selectedFilters}
              filterOptions={filterOptions}
            />
          </div>
        )}

        <div
          className={`tab-content text-text-primary-light dark:text-text-secondary-light ${showPurchaseDetailsMobile ? 'mt-0' : 'mt-3'} ${
            currenTab == 'Sold' ? 'mt-3' : ''
          } md:mt-5 flex gap-4 flex-1 overflow-y-scroll`}
        >
          {currenTab == 'Purchased' ? (
            <PurchaseContainer
            setShowOrderId = {setShowOrderId}
              isMobile={isMobile}
              data={data}
              isPurchaseDetailsFetching={isFetching}
              showPurchaseDetailsMobile={showPurchaseDetailsMobile}
              setShowPurchaseDetailsMobile={setShowPurchaseDetailsMobile}
            />
          ) : currenTab == 'Sold' ? (
            <SoldContainer
            setShowOrderId={setShowOrderId}
            isMobile={isMobile}
              data={data}
              isPurchaseDetailsFetching={isFetching}
              showSoldDetailsMobile={showSoldDetailsMobile}
              setShowSoldDetailsMobile={setShowSoldDetailsMobile}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyPurchases;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
}

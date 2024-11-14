/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import { GOOGLE_MAPS_KEY, STATIC_IMAGE_URL } from '@/config';
import { productsApi } from '@/store/api-slices/products-api';
import { SearchItems, SearchUsers } from '@/store/types';
import { useDebounce } from '@/hooks/use-debounce';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { HydrationGuard } from '../hydration-guard';
import SearchUserAndCategoryDrower from '@/components/search-box/search-user-and-category-drower';
import Button from '../button';
import LocationTargetIcon from '../../../../public/assets/svg/location-target-icon';
import { appClsx } from '@/lib/utils';
import { useNewWindowScroll } from '@/hooks/new-use-window-scroll';
import styles from '../../../styles/enable-scroolbar.module.css';
import { useRouter } from 'next/router';
import Spinner from '../loader';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';
import { useTheme } from '@/hooks/theme';
import CloseIcon from '../../../../public/assets/svg/close-icon';
import FullScreenSpinner from '../full-screen-spinner';
import { RootState } from '@/store/store';
import SearchIcon from '../../../../public/assets/svg/search-icon';
import LocationSvg from '../../../../public/assets/svg/location';
import UpArrowRoundedEdge from '../../../../public/assets/svg/up-arrow-rounded-edge';
import { routeToCategories, routeSellerProfile } from '@/store/utils/route-helper';
import { Hits, InstantSearch, Configure, connectStateResults } from 'react-instantsearch-dom';
import SearchBox from '@/components/typesense/SearchBox';
import SearchResults from '@/components/typesense/SearchResults';
import Image from 'next/image';
import HistoryIcon from '../../../../public/images/history-icon.svg';
import { CustomSearchResults } from './custom-hits';
import Link from 'next/link';
import { FormDataT } from '@/components/sections/hero-section';

export type NewSearchBoxProps = {
  windowWidth: number;
  className?: string;
  stickyHeaderWithSearchBox?: boolean;
  handleGetLocationHelper: () => Promise<boolean>;
  handleRemoveLocationHelper: () => void;
  selectedOption: 'Items' | 'Users';
  setSelectedOption: React.Dispatch<React.SetStateAction<'Items' | 'Users'>>;
  searchClient: any;
  formData: FormDataT;
  setFormData: React.Dispatch<React.SetStateAction<FormDataT>>;
};

export type heroSection = {
  title: string;
  desc: string;
  searchUserandItem: { users: string; items: string };
  searchItem: { placeholder: string };
  searchPlace: { placeholder: string };
  button: string;
  popularSearch: string;
  locationPlaceholder: string;
  searchPlaceholder: string;
};

interface Hit {
  title: {
    en: string;
  };
  categories: {
    id: string;
  }[];
  mainCategory: string;
}

const NewSearchBox: FC<NewSearchBoxProps> = ({
  stickyHeaderWithSearchBox = false,
  handleGetLocationHelper,
  handleRemoveLocationHelper,
  className,
  searchClient,
  selectedOption,
  setSelectedOption,
  formData,
  setFormData,
}) => {
  const { t } = useTranslation('common');
  const heroSection = t('page.header.heroSection', { returnObjects: true }) as heroSection;

  const { theme } = useTheme();
  const minThreshold = useNewWindowScroll(180);
  const router = useRouter();

  const { myLocation } = useAppSelector((state: RootState) => state.auth);

  const { setUpdateLocationDispatch, setMyLocationDispatch } = useActions();

  const [searchItemAndUserDrower, setSearchItemAndUserDrower] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [, setCrossAndLocationImage] = useState(false);
  const [isRecentSearchOpen, setIsRecentSearchOpen] = useState(false);
  const [isAutoCompleteLocationBoxOpen, setIsAutoCompleteLocationBoxOpen] = useState(false);
  const [isSearchProductOrUserOpen, setIsSearchProductOrUserOpen] = useState(false);
  const debouncedLocationSearchTerm: string = useDebounce(formData.location, 200);

  const debouncedSearchTerm: string = useDebounce(formData.search, 200); // Debounce input
  const [isUserOrProduct, setIsUserOrProduct] = useState<SearchUsers[] | SearchItems[]>([]);
  const IsUserOrItemFlag = selectedOption === 'Users' ? '&type=2' : '';

  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
    apiKey: GOOGLE_MAPS_KEY,
  });
  const [selectLocationLoading, setSelectLocationLoading] = useState(false);
  const { data: recentSearchData, isFetching: isRecentSearchDataFetching } = productsApi.useGetRecentSearchDataQuery(
    undefined,
    { skip: !isRecentSearchOpen }
  );
  const [trigger] = productsApi.useLazyAddRecentSearchDataQuery();
  const [triggerSingleProductSearch] = productsApi.useLazyAddRecentSearchDataWithSingleProductQuery();
  const [triggerAddUserDataToRecentSearch] = productsApi.useAddUserDataToRecentSearchMutation();
  const [searchResults, setSearchResults] = useState([]);
  const [showRecentSearchResultsFromTypesense, setShowRecentSearchResultsFromTypesense] = useState(false);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));
  }, []);

  const addItemToRecentSearch = (assetId: string, search: string) => {
    triggerSingleProductSearch({ assetId, search });
  };
  const addUserToRecentSearch = (clickeduserId: string) => {
    triggerAddUserDataToRecentSearch({ clickeduserId });
  };

  const categoryRoute = async (categoryId: string, search: string) => {
    setFormData((prevState) => ({
      ...prevState,
      search: search,
      resultDropdown: router?.pathname === '/categories/[id]' ? false : prevState.resultDropdown,
    }));
    const url = routeToCategories({ category: { id: categoryId } });
    const query = search ? { search } : {};
    router.push({ pathname: url, query });
  };
  const sellerProfileRoute = (userId: string) => {
    router.push(routeSellerProfile(userId));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    setIsUserOrProduct([]);
    setSelectedOption(option as 'Items' | 'Users');
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));
    setShowRecentSearchResultsFromTypesense(false);
    setIsOpen(false);
  };

  const handleRemoveSearchHelper = () => {
    setShowRecentSearchResultsFromTypesense(false);
    setFormData({ ...formData, search: '' });
  };

  const handleInstantSearchOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    // setIsUserOrProduct([]);
    const { name, value } = e.target;
    console.log(router?.pathname, 'router?.pathname==>>');
    setFormData((prevState) => ({
      ...prevState,
      resultDropdown: true,
      [name]: value,
    }));
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsUserOrProduct([]);
    setShowRecentSearchResultsFromTypesense(false);
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const data = {
      address: value,
      city: '',
      country: '',
      latitude: '',
      longitude: '',
    };
    if (name == 'location' && debouncedLocationSearchTerm.length > 2) {
      setUpdateLocationDispatch(data);
      getPlacePredictions({ input: e.target.value });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && formData.location.length === 1) {
      setIsAutoCompleteLocationBoxOpen(false);
    }
  };

  const onFocusSearchBoxHandle = () => {
    formData.search === '' && setIsRecentSearchOpen(true);
  };
  // recent search api end --------------------------
  const handleSearchEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (formData.search !== '' && selectedOption !== 'Users') {
        trigger(formData.search);
      }
    }
    if (formData.search !== '') {
      setIsSearchProductOrUserOpen(true);
    }
  };

  const selectItemOrUserToSearch = async (searchStr: string, shouldShowResults: boolean = true) => {
    const { results } = await searchClient.search([
      {
        indexName: selectedOption === 'Items' ? 'kwibal_asset' : 'kwibal_accounts',
        params: {
          query: searchStr,
          query_by: selectedOption === 'Items' ? 'title.en,description' : 'first_name,last_name',
          hitsPerPage: 10,
        },
      },
    ]);
    if (shouldShowResults) {
      setShowRecentSearchResultsFromTypesense(true);
    }
    setSearchResults(results[0].hits);
    setFormData({ ...formData, search: searchStr });
  };

  const selectedAddressFromLocationBox = (key: number) => {
    setIsAutoCompleteLocationBoxOpen(false);
    setSelectLocationLoading(true);

    placesService?.getDetails(
      {
        placeId: placePredictions[key].place_id,
      },
      (placeDetails) => {
        // eslint-disable-next-line
        const geocoder = new google.maps.Geocoder();
        // @ts-ignore: Object is possibly 'null'.
        geocoder.geocode({ address: placeDetails?.formatted_address }, (results, status) => {
          // @ts-ignore: Object is possibly 'null'.
          if (status === 'OK' && results[0]) {
            // @ts-ignore: Object is possibly 'null'.
            const { lat, lng } = results[0].geometry.location;
            const latitude = lat().toString();
            const longitude = lng().toString();

            const country =
              placeDetails?.address_components?.find((item) => item.types.includes('country'))?.long_name || '';
            const city =
              placeDetails?.address_components?.find((item) => item.types.includes('administrative_area_level_3'))
                ?.long_name || '';

            const data = {
              address: placeDetails?.formatted_address || '',
              city: city,
              country: country,
              latitude: latitude,
              longitude: longitude,
            };
            setMyLocationDispatch(data);
            setSelectLocationLoading(false);

            // setUpdateLocationDispatch(data);
          } else {
            console.error('Geocode was not successful for the following reason:', status);
          }
          setSelectLocationLoading(false);
        });
      }
    );
  };

  const fetchCurrentLocation = async () => {
    const isLocationUpdated = await handleGetLocationHelper();
    if (!isLocationUpdated) {
      formData.location === '' && setFormData({ ...formData, location: myLocation.address });
    }
  };

  useEffect(() => {
    setFormData({ ...formData, location: myLocation?.address });
  }, [myLocation, myLocation?.address]);

  useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (placePredictions.length) setIsAutoCompleteLocationBoxOpen(true);
  }, [placePredictions]);

  useEffect(() => {
    if (myLocation?.address) {
      setCrossAndLocationImage(true);
    } else {
      setCrossAndLocationImage(false);
    }
  }, [myLocation, myLocation?.address]);

  return (
    <>
      {/* @todo */}
      {/* // desktop,letop,tab screen  */}

      <div
        className={appClsx(
          `mobile:order-3 border-error text-text-primary-light dark:text-text-primary-dark z-[1] w-full  flex mobile:items-center flex-col sticky top-[69px] ${
            stickyHeaderWithSearchBox &&
            'dark:border-b  dark:border-b-border-tertiary-dark flex items-center min-w-full bg-bg-secondary-light dark:bg-bg-primary-dark !fixed top-[69px] px-16 '
          } ${
            minThreshold
              ? '!fixed top-[69px] sm:px-[64px] w-full bg-bg-secondary-light dark:bg-bg-primary-dark'
              : 'max-w-[1083px] '
          } `,
          className
        )}
      >
        {/* here h1 was */}

        {/* desktop search box start*/}
        <div
          className={` border-error text-sm mobile:hidden ${
            stickyHeaderWithSearchBox && 'w-full bg-bg-tertiary-light dark:!bg-bg-quinary-dark '
          }  h-11 w-full max-w-[1083px] mobile:min-w-0 xl:max-w-[1312px] my-4 bg-bg-secondary-light rounded text-black flex 
          ${
            minThreshold
              ? ' dark:!bg-bg-secondary-dark dark:text-text-primary-dark bg-bg-tertiary-light w-full xl:max-w-[1312px] mx-auto transition-all duration-300 ease-in'
              : ''
          }`}
        >
          <div
            className={`border-r  rtl:border-r-0 rtl:border-l relative rtl:rounded-r rtl:rounded-l-none rounded-l w-full h-full flex-[1.5] 2lg:flex-[1.8]  ${
              minThreshold && theme ? 'dark:border-border-tertiary-dark' : 'border-border-undenary-light'
            } `}
          >
            <button
              type="button"
              onClick={toggleDropdown}
              onBlur={() => setTimeout(() => setIsOpen(false), 300)}
              className={` border-error ${stickyHeaderWithSearchBox && 'dark:!text-text-primary-dark'} ${
                minThreshold ? 'dark:text-text-primary-dark' : 'dark:text-text-secondary-dark'
              }  hover:bg-bg-tertiary-light dark:hover:bg-bg-octonary-dark dark:hover:text-text-secondary-dark rtl:rounded-r rtl:rounded-l-none rounded-l w-full h-full outline-none flex items-center justify-center`}
            >
              {selectedOption === 'Items'
                ? heroSection?.searchUserandItem?.items
                : heroSection?.searchUserandItem?.users}
              {isOpen ? (
                <UpArrowRoundedEdge
                  primaryColor={`${minThreshold && theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`}
                  className="ml-2 rtl:ml-0 rtl:mr-2"
                />
              ) : (
                <DownArrowRoundedEdge
                  primaryColor={`${minThreshold && theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`}
                  className="ml-2 rtl:ml-0 rtl:mr-2"
                />
              )}
            </button>

            {isOpen && (
              <div
                className={`flex flex-col ${
                  stickyHeaderWithSearchBox && 'dark:!text-text-primary-dark dark:bg-bg-quinary-dark'
                }  absolute z-10 w-full  bg-bg-secondary-light 
                dark:bg-bg-secondary-dark dark:text-text-primary-dark
                shadow-lg text-center rounded-b-md`}
              >
                <button
                  className={` p-2 cursor-pointer  hover:bg-bg-octonary-light 
                    dark:text-text-primary-dark dark:hover:bg-menu-hover dark:hover:text-text-secondary-dark
                  hover:rounded-b-md`}
                  onClick={() => handleOptionSelect('Items')}
                >
                  {heroSection?.searchUserandItem?.items}
                </button>
                <button
                  className={` border-error p-2 cursor-pointer hover:bg-bg-octonary-light
                    dark:text-text-primary-dark dark:hover:bg-menu-hover dark:hover:text-text-secondary-dark
                  hover:rounded-b-md `}
                  onClick={() => handleOptionSelect('Users')}
                >
                  {heroSection?.searchUserandItem?.users}
                </button>
              </div>
            )}
          </div>
          <div
            className={
              'relative flex-[15] flex items-center justify-center 2lg:flex-[10] lg:flex-[8] md:flex-[6] sm:flex-[4] '
            }
          >
            <SearchIcon width={17} height={17} className="absolute left-4 rtl:right-4 " />
            <InstantSearch
              searchClient={searchClient}
              indexName={selectedOption === 'Items' ? 'kwibal_asset' : 'kwibal_accounts'}
            >
              <Configure
                query={formData.search}
                hitsPerPage={10}
                attributesToRetrieve={
                  selectedOption === 'Items'
                    ? ['assetId', 'assetTitle', 'images', 'categoryPath', 'inSection']
                    : ['userId', 'accountId', 'firstName', 'lastName', 'userName', 'profilePic']
                }
              />
              <SearchBox
                extraStyles={`pr-10 truncate border-r ${
                  minThreshold && theme ? 'dark:border-border-tertiary-dark' : 'border-border-undenary-light'
                } dark:text-text-primary-light placeholder-text-denary-light /*dark:text-text-primary-dark*/ ${
                  stickyHeaderWithSearchBox &&
                  'bg-bg-tertiary-light dark:!bg-bg-quinary-dark dark:!text-text-primary-dark dark:hover:!text-text-primary-dark'
                } dark:hover:bg-bg-octonary-dark hover:!bg-bg-tertiary-light hover:dark:!text-text-primary-light cursor-text h-full w-full outline-none pl-12 rtl:pr-12 ${
                  minThreshold ? 'dark:bg-bg-secondary-dark dark:!text-text-primary-dark bg-bg-tertiary-light' : ''
                }`}
                inputValue={formData.search}
                name="search"
                onChangeHandeler={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleInstantSearchOnChange(e);
                }}
                placeholder={heroSection?.searchItem?.placeholder}
                onFocusHandeler={() => onFocusSearchBoxHandle()}
                onBlurHandeler={() =>
                  setTimeout(() => {
                    setIsSearchProductOrUserOpen(false);
                    setIsRecentSearchOpen(false);
                  }, 300)
                }
                onKeyDownHandeler={handleSearchEnterKeyDown}
              />

              {showRecentSearchResultsFromTypesense && (
                <SearchResults>
                  <div className="absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px]">
                    {searchResults?.length ? (
                      searchResults?.map((hit: Hit) => (
                        <div
                          className="flex dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                          onClick={async () => {
                            categoryRoute(hit.categories[0].id, hit.title.en);
                            setShowRecentSearchResultsFromTypesense(false);
                          }}
                        >
                          <div className="truncate ml-3 flex">
                            <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                              {hit?.title?.en}
                            </div>
                            <div className="font-semibold text-sm text-brand-color ml-1">in </div>
                            <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark ml-1">
                              {hit.mainCategory}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-14 text-text-primary-light dark:text-text-primary-dark">
                        No results found
                      </div>
                    )}
                  </div>
                </SearchResults>
              )}

              {!!formData?.search && !showRecentSearchResultsFromTypesense && formData.resultDropdown && (
                <SearchResults>
                  <div className="absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px]">
                    <CustomSearchResults searchQuery={formData.search}>
                      <Hits
                        hitComponent={({ hit }) => {
                          return selectedOption === 'Items' ? (
                            <div
                              className="flex dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                              onClick={async () => {
                                // @ts-ignore
                                await addItemToRecentSearch(hit.id, hit.title.en);
                                // @ts-ignore
                                await selectItemOrUserToSearch(hit.title.en);
                                setShowRecentSearchResultsFromTypesense(false);
                                // @ts-ignore
                                categoryRoute(hit.categories[0].id, hit.title.en);
                                setIsOpen(false);
                              }}
                            >
                              <div className="truncate ml-3 flex">
                                <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                                  {/* @ts-ignore */}
                                  {hit?.title?.en}
                                </div>
                                <div className="font-semibold text-sm text-brand-color ml-1">in </div>
                                <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark ml-1">
                                  {hit.mainCategory}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="w-full flex dark:hover:text-text-primary-dark text-text-secondary-light dark:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                              onClick={async () => {
                                console.log(hit, 'hit==>>');
                                selectItemOrUserToSearch(`${hit.first_name} ${hit.last_name}`, false);
                                // await addUserToRecentSearch(hit.id);
                                await triggerAddUserDataToRecentSearch({clickeduserId: hit.user_id}).unwrap();
                                sellerProfileRoute(hit.id);
                              }}
                            >
                              <div className="truncate ml-3 flex">
                                <div className="border-3 font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                                  {hit.first_name} {hit.last_name}
                                </div>
                              </div>
                            </button>
                          );
                        }}
                      />
                    </CustomSearchResults>
                  </div>
                </SearchResults>
              )}
            </InstantSearch>

            {formData.search !== '' ? (
              <CloseIcon
                width={'17'}
                height={'17'}
                className={
                  'absolute right-4 rtl:right-[95%] hover:cursor-pointer transition duration-75 hover:scale-105'
                }
                primaryColor={`${minThreshold && theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`}
                onClick={() => {
                  handleRemoveSearchHelper();
                }}
              />
            ) : null}

            {/* {selectedOption === 'Items' && isSearchProductOrUserOpen ? (
              <>
                <div
                  className={` absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark  left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px] ${styles.myScrollableDiv}`}
                >
                  {isSearchProductsAndUsersFetching ? (
                    <div className='flex items-center justify-center h-[120px]'>
                      <Spinner/>
                    </div>
                  ) : isUserOrProduct.length ? (
                  
                    (isUserOrProduct as SearchItems[])?.map((item, index) => (
                      <>
                        <Link
                          href={''}
                          className="flex dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark "
                          key={index}
                          onClick={async() => {
                            //  addItemToRecentSearch(item.assetId,item.assetTitle);
                            await triggerSingleProductSearch({ assetId:item.assetId, search:item.assetTitle }).unwrap();
                             selectItemOrUserToSearch(`${item.assetTitle}`);
                            categoryRoute(item.categoryPath[0].id);
                          }}
                        >
                          <div className="ml-3 h-8 w-8">
                            <Image
                              className="rounded-full w-full h-full dark:inline hidden"
                              width={32}
                              height={32}
                              src={
                                (item?.images?.[0].type === 'VIDEO'
                                  ? item?.images?.[0]?.thumbnailUrl?.includes('https')
                                    ? item?.images?.[0]?.thumbnailUrl
                                    : `${STATIC_IMAGE_URL}/${item?.images?.[0]?.thumbnailUrl}`
                                  : item?.images?.[0].url?.includes('https')
                                    ? item?.images?.[0]?.url
                                    : `${STATIC_IMAGE_URL}/${item?.images?.[0]?.url}`) ||
                                '/images/user-profile-icon-black.svg'
                              }
                              alt={''}
                            />
                            <Image
                              className="rounded-full w-full h-full dark:hidden inline"
                              width={32}
                              height={32}
                              src={
                                (item?.images?.[0].type === 'VIDEO'
                                  ? item?.images?.[0]?.thumbnailUrl?.includes('https')
                                    ? item?.images?.[0]?.thumbnailUrl
                                    : `${STATIC_IMAGE_URL}/${item?.images?.[0]?.thumbnailUrl}`
                                  : item?.images?.[0].url?.includes('https')
                                    ? item?.images?.[0]?.url
                                    : `${STATIC_IMAGE_URL}/${item?.images?.[0]?.url}`) ||
                                '/images/user-profile-icon-white.svg'
                              }

                              alt={''}
                            />
                          </div>
                          <div className="truncate ml-3 flex">
                            <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                              {item.assetTitle}&nbsp; in &nbsp;
                            </div>
                            <div className="text-sm font-normal text-brand-color truncate">{item.inSection}</div>
                          </div>
                        </Link>
                      </>
                    ))
                  
                  ) : (
                    <div className=" top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark  left-0 right-0 rounded-md py-4">
                      <p className="truncate ml-3 flex dark:text-text-primary-dark ">No Found!</p>
                    </div>
                  )}
                </div>
              </>
            ) : null} */}

            {/* {selectedOption === 'Users' && isSearchProductOrUserOpen ? (
              <>
                <div
                  className={`absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px] ${styles.myScrollableDiv}`}
                >
                  {isSearchProductsAndUsersFetching ? (
                    <div className=' flex items-center justify-center h-[120px]'>
                      <Spinner/>

                    </div>
                  ) : isUserOrProduct.length ? (
                  
                    (isUserOrProduct as SearchUsers[])?.map((user, index) => (
                      <button
                        className="w-full flex dark:hover:text-text-primary-dark text-text-secondary-light dark:text-text-primary-dark  border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark "
                        key={index}
                        onClick={async () => {
                          selectItemOrUserToSearch(`${user.firstName} ${user.lastName}`);
                          //  addUserToRecentSearch(user.userId); 
                         await triggerAddUserDataToRecentSearch({clickeduserId: user.userId}).unwrap();
                          sellerProfileRoute(user.accountId);
                        }}
                      >
                        <div className="ml-3 h-8 w-8">
                          <Image
                            className="rounded-full w-full h-full dark:inline hidden"
                            width={32}
                            height={32}
                            src={
                              user.profilePic
                                ? `${STATIC_IMAGE_URL}/${user.profilePic}`
                                : '/images/user-profile-icon-black.svg'
                            }
                            // src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                            alt={''}
                          />
                          <Image
                            className="rounded-full w-full h-full dark:hidden inline"
                            width={32}
                            height={32}
                            src={
                              user.profilePic
                                ? `${STATIC_IMAGE_URL}/${user.profilePic}`
                                : '/images/user-profile-icon-white.svg'
                            }
                            alt={''}
                          />
                        </div>
                        <div className="truncate ml-3 flex">
                          <div className="border-3 font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                            {user.firstName} {user.lastName}&nbsp;
                          </div>
                          <div className="text-sm font-normal text-brand-color truncate">{user.userName}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className=" top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark  left-0 right-0 rounded-md py-4">
                      <p className="truncate ml-3 flex dark:text-text-primary-dark ">No User Found!</p>
                    </div>
                  )}
                </div>

              </>
            ) : null} */}

            {isRecentSearchOpen === true && !formData.search ? (
              <div
                className={`absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px] ${styles.myScrollableDiv}`}
              >
                {!!recentSearchData?.data?.data && (
                  <div className="ml-4 mt-3 mb-3 dark:text-text-primary-dark">Recent Searches</div>
                )}
                {isRecentSearchDataFetching ? (
                  <div className=" flex items-center justify-center h-[120px]">
                    <Spinner />
                  </div>
                ) : (
                  recentSearchData?.data.data.length === 0 && (
                    <h4 className="ml-4 mt-3 mb-3 text-text-primary-light dark:text-text-primary-dark">
                      No Recent Searches
                    </h4>
                  )
                )}
                {selectedOption === 'Items' &&
                  recentSearchData?.data?.data.map((search, index) => (
                    <div
                      className="flex dark:border-none  dark:hover:text-text-secondary-dark border-border-tertiary-light h-9 items-center cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark  "
                      key={index}
                      onClick={() => selectItemOrUserToSearch(`${search.searchText}`)}
                    >
                      <div className=" ml-4">
                        <Image width={14} height={14} src={HistoryIcon} alt="history-icon" />
                      </div>
                      <div className="truncate ml-2 flex">
                        <div className="font-normal text-sm dark:text-text-primary-dark text-text-primary-light ">
                          {search.searchText}&nbsp;
                        </div>
                      </div>
                    </div>
                  ))}
                {selectedOption === 'Users' &&
                  recentSearchData?.data?.user.map((search, index) => (
                    <Link
                      href={''}
                      className="flex dark:border-none  dark:hover:text-text-secondary-dark border-border-tertiary-light h-9 items-center cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark  "
                      key={index}
                      onClick={() => selectItemOrUserToSearch(`${search.searchText}`)}
                  >
                    <div className=" ml-4">
                      <Image
                        width={14}
                        height={14}
                        src={HistoryIcon}
                        // loader={gumletLoader}
                        alt="history-icon"
                      />
                    </div>
                    <div className="truncate ml-2 flex">
                      <div className="font-normal text-sm dark:text-text-primary-dark text-text-primary-light ">
                        {search.searchText}&nbsp;
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-[8] items-center justify-center 2lg:flex-[10] lg:flex-[8] md:flex-[6] sm:flex-[4]">
            <div className="relative h-full w-full items-center flex justify-center ">
              <LocationSvg width={'17'} height={'17'} className="absolute left-4 rtl:right-4 " />

              {/* add location searchbox */}

              <input
                className={`truncate dark:text-text-primary-light placeholder-text-denary-light /*dark:text-text-primary-dark*/${
                  stickyHeaderWithSearchBox &&
                  ' !bg-bg-tertiary-light dark:!bg-bg-quinary-dark dark:!text-text-primary-dark dark:hover:!text-text-primary-dark'
                } dark:hover:bg-bg-octonary-dark hover:bg-bg-tertiary-light hover:dark:!text-text-primary-light cursor-text h-full w-full pl-11 pr-9 rtl:pr-11 outline-none ${
                  minThreshold ? 'dark:bg-bg-secondary-dark dark:!text-text-primary-dark  bg-bg-tertiary-light' : ''
                }`}
                placeholder={heroSection?.searchPlace?.placeholder}
                autoComplete="off"
                value={formData.location}
                onChange={(e) => {
                  handleOnChange(e);
                }}
                onBlur={() => setTimeout(() => setIsAutoCompleteLocationBoxOpen(false), 300)}
                onKeyDown={handleKeyDown}
                name="location"
              />
              <div
                className={` absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[200px] ${styles.myScrollableDiv}`}
              >
                {selectLocationLoading ? (
                  <FullScreenSpinner />
                ) : isPlacePredictionsLoading ? (
                  <div className=" flex items-center justify-center h-[220px]">
                    <Spinner />
                  </div>
                ) : isAutoCompleteLocationBoxOpen ? (
                  placePredictions.map((search, index) => (
                    <span
                      onClick={() => selectedAddressFromLocationBox(index)}
                      className="flex pr-3 dark:hover:text-text-secondary-dark border-border-tertiary-light h-12 items-center cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark "
                      key={index}
                      tabIndex={0}
                      role="button"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectedAddressFromLocationBox(index);
                        }
                      }}
                    >
                      <div className=" ml-4">
                        <LocationSvg className="border-error " width={'18'} height={'18'} />
                      </div>
                      <div className="truncate ml-2 flex">
                        <div className="truncate font-normal text-sm text-text-primary-light dark:text-text-primary-dark">
                          {search.description}&nbsp;
                        </div>
                      </div>
                    </span>
                  ))
                ) : null}
              </div>

              {formData.location ? (
                <CloseIcon
                  width={'17'}
                  height={'17'}
                  className={
                    'absolute right-4 rtl:right-[95%] hover:cursor-pointer transition duration-75 hover:scale-105'
                  }
                  primaryColor={`${minThreshold && theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`}
                  onClick={() => {
                    setFormData({ ...formData, location: '' });
                    // handleRemoveLocationHelper();
                    setIsAutoCompleteLocationBoxOpen(false);
                  }}
                />
              ) : (
                <>
                  <LocationTargetIcon
                    width={'17'}
                    height={'17'}
                    className={
                      ' absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 '
                    }
                    color="var(--brand-color)"
                    onClick={fetchCurrentLocation}
                  />
                </>
              )}
            </div>
            <Button
              buttonType={'quaternary'}
              className="bg-btn-quaternary-light text-text-secondary-light  hover:text-text-primary-light dark:hover:text-text-primary-dark dark:text-text-primary-dark h-[36px] focus:outline-none hover:bg-btn-quinary-light font-medium rounded text-sm px-5 mr-1 rtl:ml-1"
              type="button"
              onClick={() => router.push('/categories')}
            >
              {heroSection.button}
            </Button>
          </div>
        </div>
        {/* desktop search box end*/}

        {/* mobile search box start */}
        <div
          className={` mobile:order-3 sm:hidden ${
            stickyHeaderWithSearchBox && '!fixed top-[69px] bg-bg-secondary-light dark:bg-bg-secondary-dark'
          }  z-49 sticky top-[69px] ${
            minThreshold
              ? '!fixed top-[69px] mobile:px-4 w-full bg-bg-secondary-light dark:bg-bg-primary-dark'
              : 'max-w-[1083px] mobile:px-4'
          } mobile:inline-block mx-5 relative w-full max-w-[638px] `}
        >
          <button
            className={`relative  ${
              stickyHeaderWithSearchBox && 'hidden'
            } bg-bg-tertiary-light w-full pr-2 hover:bg-bg-tertiary-light rounded-lg h-[42px] mobile:mt-0 mt-3 flex items-center `}
            onClick={() => setSearchItemAndUserDrower(!searchItemAndUserDrower)}
          >
            <LocationSvg
              width={'14'}
              height={'14'}
              className="absolute mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3"
            />
            <span className="text-base dark:text-text-secondary-dark mobile:text-sm ml-9 rtl:ml-0 rtl:mr-9 truncate">
              <HydrationGuard>
                {myLocation?.address ? myLocation?.address : heroSection.locationPlaceholder}
              </HydrationGuard>
            </span>
          </button>
          <button
            className={`relative ${
              stickyHeaderWithSearchBox && '!bg-bg-octonary-light dark:bg-bg-quinary-dark text-text-tertiary-dark '
            } bg-bg-tertiary-light w-full pr-2 hover:bg-bg-tertiary-light text-text-secondary-color rounded-lg h-[42px] mobile:mb-3 mt-3 flex items-center`}
            onClick={() => setSearchItemAndUserDrower(!searchItemAndUserDrower)}
          >
            <SearchIcon
              width={14}
              height={14}
              className="absolute  mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3 "
            />
            <span
              className={`text-base  ml-9 mobile:text-sm rtl:ml-0 rtl:mr-9 truncate ${
                router?.query?.search ? '' : 'text-text-denary-light'
              }`}
            >
              {router?.query?.search ? (router.query.search as string) : heroSection.searchPlaceholder}
            </span>
          </button>
        </div>
        {/* mobile search box start */}

        {/* p tag was here */}
      </div>

      {/* mobile screen DROWER */}
      <SearchUserAndCategoryDrower
        isPlacePredictionsLoading={isPlacePredictionsLoading}
        isSearchProductsAndUsersFetching={false}
        className={`sm:hidden mobile:inline-block ${searchItemAndUserDrower && '!hidden'}`}
        searchItemAndUserDrower={searchItemAndUserDrower}
        setSearchItemAndUserDrower={setSearchItemAndUserDrower}
        handleGetLocationHelper={handleGetLocationHelper}
        handleRemoveLocationHelper={handleRemoveLocationHelper}
        address={myLocation?.address}
        handleOnChange={handleOnChange}
        placesService={placesService}
        placePredictions={placePredictions}
        getPlacePredictions={getPlacePredictions}
        selectedAddressFromLocationBox={selectedAddressFromLocationBox}
        formData={formData}
        setFormData={setFormData}
        products={isUserOrProduct}
        handleOptionSelect={handleOptionSelect}
        selectedOption={selectedOption}
        searchClient={searchClient}
        handleInstantSearchOnChange={handleInstantSearchOnChange}
        setSelectedOption={setSelectedOption}
      />
    </>
  );
};

export default NewSearchBox;

import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import SearchUserAndCategoryCard from './search-user-and-category-card';
import { appClsx } from '@/lib/utils';
import SearchLocationAutocompleteCard from './search-location-autocomplete-card';
import { SearchItems, SearchUsers } from '@/store/types';
import SearchItemsAndCategoryCard from './search-items-and-category-card copy';
import { HydrationGuard } from '../ui/hydration-guard';
import Spinner from '../ui/loader';
import LocationTargetIcon from '../../../public/assets/svg/location-target-icon';
import { useTheme } from '@/hooks/theme';
import { useAppSelector } from '@/store/utils/hooks';
import { RootState } from '@/store/store';
import CloseIcon from '../../../public/assets/svg/close-icon';
import SearchIcon from '../../../public/assets/svg/search-icon';
import HistoryIcon from '../../../public/images/history-icon.svg';
import LocationSvg from '../../../public/assets/svg/location';
import { routeSellerProfile, routeToCategories, routeToSearch } from '@/store/utils/route-helper';
import keyDownHandler from '@/helper/key-down-handler';
import { useRouter } from 'next/router';
import { Configure } from 'react-instantsearch-dom';
import { InstantSearch } from 'react-instantsearch-dom';
import { Hits } from 'react-instantsearch-dom';
import SearchResults from '../typesense/SearchResults';
import { CustomSearchResults } from '../ui/search-box/custom-hits';
import { productsApi } from '@/store/api-slices/products-api';
import LeftArrowIcon from '../../../public/assets/svg/left-arrow-icon';
import Image from 'next/image';

interface PlacePredictions {
  place_id: string;
  description: string;
}

interface Hit {
  title: {
    en: string;
  };
  categories: {
    id: string;
  }[];
  mainCategory: string;
}

interface SearchState {
  search: string;
  location: string;
  resultDropdown: boolean;
}

export type Props = {
  isPlacePredictionsLoading?: boolean;
  isSearchProductsAndUsersFetching?: boolean;
  className: string;
  searchItemAndUserDrower: boolean;
  setSearchItemAndUserDrower: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<SearchState>>;
  handleGetLocationHelper: () => Promise<boolean>;
  handleRemoveLocationHelper: () => void;
  handleOnChange: (_e: ChangeEvent<HTMLInputElement>) => void;
  selectItemOrUserToSearch?: (_searchText: string) => void;
  address: string;
  placesService: {
    getDetails: (
      _options: {
        placeId: string;
      },
      _callback: () => void
    ) => void;
  } | null;
  placePredictions: PlacePredictions[];
  // eslint-disable-next-line
  getPlacePredictions: (_opt: google.maps.places.AutocompletionRequest) => void;
  selectedAddressFromLocationBox: (_key: number) => void;
  formData: {
    search: string;
    location: string;
  };
  products: SearchItems[] | SearchUsers[];
  handleOptionSelect: (_option: string) => void;
  selectedOption: string;
  handleInstantSearchOnChange?: (_e: ChangeEvent<HTMLInputElement>) => void;
  showRecentSearchResultsFromTypesense?: boolean;
  searchResults?: any;
  searchClient?: any;
  setSelectedOption?: React.Dispatch<React.SetStateAction<'Items' | 'Users'>>;
};

export type heroSection = {
  title: string;
  searchUserandItem: { users: string; items: string };
  searchItem: { placeholder: string };
  searchPlace: { placeholder: string };
  button: string;
  popularSearch: string;
};

const SearchUserAndCategoryDrower: FC<Props> = ({
  isPlacePredictionsLoading,
  isSearchProductsAndUsersFetching,
  className,
  searchItemAndUserDrower,
  setSearchItemAndUserDrower,
  handleGetLocationHelper,
  // handleRemoveLocationHelper,
  // address,
  handleOnChange,
  placePredictions,
  getPlacePredictions,
  selectedAddressFromLocationBox,
  formData,
  products,
  handleOptionSelect,
  selectedOption,
  setFormData,
  handleInstantSearchOnChange,
  showRecentSearchResultsFromTypesense,
  searchResults,
  searchClient,
  setSelectedOption,
  selectItemOrUserToSearch,
}) => {
  // please do not remove this -> this code is for translation of this page
  // const { t } = useTranslation('common');
  //   const heroSection:heroSection = t('page.header.heroSection', { returnObjects: true });
  const { myLocation } = useAppSelector((state: RootState) => state.auth);

  const { theme } = useTheme();
  const router = useRouter();
  const [isUserOrItem, setIsUserOrItem] = useState(true);
  const [isLocationTextBoxFocused, setIsLocationTextBoxFocused] = useState(true);
  const [triggerSingleProductSearch] = productsApi.useLazyAddRecentSearchDataWithSingleProductQuery();

  // please do not remove this -> this code is for removing user location form redux
  // const removeLocation = () => {
  //   handleRemoveLocationHelper();
  //   setIsLocationTextBoxFocused(false);
  // };
const [isRecentSearchOpen, setIsRecentSearchOpen] = useState(false);
    const { data: recentSearchData, isFetching: isRecentSearchDataFetching } = productsApi.useGetRecentSearchDataQuery(
      undefined,
      { skip: !isRecentSearchOpen }
    );

  const removeUserAndItem = () => {
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));
  };

  const handleFocusSearchBox = () => {
    setIsRecentSearchOpen(true);
    setIsLocationTextBoxFocused(true);
  };

  const clearLocationFromLocationSearchBox = () => {
    setFormData((prevState) => ({
      ...prevState,
      location: '',
    }));
  };

  const fetchCurrentLocation = async () => {
    const isLocationUpdated = await handleGetLocationHelper();
    if (!isLocationUpdated) {
      formData.location === '' &&
        setFormData((prevState) => ({
          ...prevState,
          location: myLocation.address,
        }));
    }
  };

  const categoryRoute = (categoryId: string, search: string, hit?: Hit) => {
    setFormData((prevState) => ({
      ...prevState,
      search: search,
      resultDropdown: router?.pathname === '/categories/[id]' ? false : prevState.resultDropdown,
    }));
    // const url = routeToCategories({ category: { id: categoryId } });
    // const searchUrl = routeToSearch({ category: { id: categoryId } });
    const searchUrl = routeToSearch({ category: { id: categoryId, name: search || '' } });
    router.push({
      pathname: searchUrl,
      // query: {
      //   search: search || undefined,
      // },
    });
    // const query = {
    //     selectedCategory: hit?.mainCategory || '',
    //     search: search || undefined,
    //   };
    // router.push({ pathname: url, query });
    setSearchItemAndUserDrower(!searchItemAndUserDrower);
  };
  const sellerProfileRoute = (userId: string) => {
    router.push(routeSellerProfile(userId));
    setSearchItemAndUserDrower(!searchItemAndUserDrower);
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      location: myLocation?.address,
    }));
  }, [myLocation, myLocation?.address]);

   const handleSearchEnterKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
     if (event.key === 'Enter') {
       if (formData.search !== '') {
         await selectItemOrUserToSearch?.(formData.search);       
       }
     }
   };

  return (
    <div
      className={appClsx(
        'z-50 h-full overflow-y-scroll fixed flex-col dark:bg-bg-primary-dark dark:text-text-primary-dark bg-bg-secondary-light inset-0 flex ',
        className
      )}
    >
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
        <div className="sticky top-0 py-2  bg-bg-secondary-light dark:bg-bg-primary-dark">
          <div className="relative mx-4 flex items-center justify-center my-3 transition delay-0 ease-in duration-1000">
            <LeftArrowIcon
              primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`}
              className="hover:cursor-pointer hover:scale-125 absolute left-1"
              onClick={() => {
                const { search, ...restQuery } = router.query;
                router.push({
                  pathname: router.pathname,
                  query: restQuery,
                });
                setSearchItemAndUserDrower(!searchItemAndUserDrower);
              }}
            />
            <span className="text-lg font-bold">Search</span>
          </div>

          <div className="truncate relative mx-4 flex items-center mb-4">
            <SearchIcon
              width={20}
              height={20}
              primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`}
              className="absolute left-4 rtl:right-4"
            />

            <input
              className="truncate border-border-tertiary-light dark:border-border-tertiary-dark dark:bg-bg-quinary-dark focus:border-2 focus:!border-brand-color dark:text-bg-tertiary-light px-11 rtl:px-5 pr-9 rtl:pr-12 text-sm outline-none border rounded-md h-12 w-full focus:border-primary bg-bg-tertiary-light"
              type="text"
              name="search"
              onFocus={handleFocusSearchBox}
              value={formData.search}
              onBlur={() =>
                setTimeout(() => {
                  setIsRecentSearchOpen(false);
                }, 300)
              }
              onChange={(e) => handleInstantSearchOnChange?.(e)}
              onKeyDown={handleSearchEnterKeyDown}
              autoComplete="off"
            />

            {showRecentSearchResultsFromTypesense && (
              <SearchResults>
                <div className="absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px]">
                  {searchResults?.length ? (
                    searchResults?.map((hit: Hit) => (
                      <div
                        className="flex dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                        onClick={async () => {}}
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
            {!!formData?.search && !showRecentSearchResultsFromTypesense && (
              <SearchResults>
                <div className="absolute top-[48px] shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-y-auto max-h-[263px]">
                  {selectedOption === 'Items' ? (
                    <Hits
                      hitComponent={({ hit }) => {
                        return (
                          <div
                            className="flex dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                            onClick={async () => {
                              // @ts-ignore
                              await addItemToRecentSearch(hit.id, hit.title.en);
                              // @ts-ignore
                              await selectItemOrUserToSearch(hit.title.en);
                              // @ts-ignore
                              categoryRoute(hit.categories[0].id, hit.title.en, hit);
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
                        );
                      }}
                    />
                  ) : (
                    <Hits
                      hitComponent={({ hit }) => {
                        return (
                          <button
                            className="w-full flex dark:hover:text-text-primary-dark text-text-secondary-light dark:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                            onClick={async () => {
                              // selectItemOrUserToSearch(`${hit.first_name} ${hit.last_name}`);
                              // await addUserToRecentSearch(hit.user_id);
                              // sellerProfileRoute(hit.id);
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
                  )}
                </div>
              </SearchResults>
            )}

            <HydrationGuard>
              {formData.search !== '' ? (
                <>
                  <CloseIcon
                    width={'17'}
                    height={'17'}
                    className={'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105'}
                    primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`}
                    onClick={removeUserAndItem}
                  />
                </>
              ) : null}
            </HydrationGuard>
          </div>

          <div className="relative mx-4 flex items-center mb-4">
            <LocationSvg
              width={'20'}
              height={'20'}
              color={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`}
              className="absolute left-4 rtl:right-4"
            />
            <input
              className="truncate border-border-tertiary-light dark:border-border-tertiary-dark dark:bg-bg-quinary-dark focus:border-2 focus:!border-brand-color dark:text-bg-tertiary-light px-11 rtl:px-5 pr-10 rtl:pr-12  text-sm outline-none border rounded-md h-12 w-full focus:border-primary bg-bg-tertiary-light"
              name="location"
              autoComplete="off"
              type="text"
              onFocus={() => setIsLocationTextBoxFocused(false)}
              value={formData.location}
              onChange={(e) => {
                handleOnChange(e);
                getPlacePredictions({ input: e.target.value });
              }}
            />

            <>
              {formData.location ? (
                <>
                  <CloseIcon
                    width={'17'}
                    height={'17'}
                    className={
                      'absolute right-4 rtl:right-[95%] hover:cursor-pointer transition duration-75 hover:scale-105'
                    }
                    primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`}
                    onClick={clearLocationFromLocationSearchBox}
                  />
                </>
              ) : null}
            </>
          </div>
        </div>

        {isLocationTextBoxFocused ? (
          <>
            <div className="sticky top-[196px] dark:bg-bg-primary-dark  bg-bg-secondary-light flex items-center justify-around mb-4 h-12 border-b-2 dark:border-b-border-tertiary-dark border-border-tertiary-light">
              <div
                className="hover:cursor-pointer h-[98%] w-[25%] flex flex-col items-center justify-center"
                onClick={() => {
                  setIsUserOrItem(true);
                  // handleOptionSelect('Items');
                  setSelectedOption?.('Items');
                }}
                tabIndex={0}
                role="button"
                onKeyUp={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsUserOrItem(true);
                    handleOptionSelect('Items');
                  }
                }}
              >
                <div
                  className={` h-full w-full ${isUserOrItem ? 'text-primary' : ''}  flex items-center justify-center `}
                >
                  Items
                </div>
                <div
                  className={`transition-all duration-100 ease-in ${
                    isUserOrItem ? 'border-brand-color border-[3px] rounded-t-2xl' : ''
                  }  w-full`}
                ></div>
              </div>

              {/* <div
                className="h-[98%] w-[25%] flex flex-col items-center justify-center"
                onClick={() => {
                  setIsUserOrItem(false);
                  // handleOptionSelect('Users');
                  setSelectedOption?.('Users');
                }}
                role="button"
                tabIndex={0}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionSelect('Users');
                  }
                }}
              >
                <div
                  className={` hover:cursor-pointer ${
                    !isUserOrItem ? 'text-primary' : ''
                  } h-full w-full flex items-center justify-center`}
                >
                  Users
                </div>
                <div
                  className={`transition-all duration-100 ease-in ${
                    !isUserOrItem ? 'border-brand-color border-[3px] rounded-t-2xl' : ''
                  } w-full `}
                ></div>
              </div> */}
            </div>

            <div className="h-fit overflow-y-scroll border-primary px-4 divide-y-2 dark:divide-border-tertiary-dark divide-border-tertiary-light">
              {isSearchProductsAndUsersFetching ? (
                <div className=" flex items-center justify-center h-[50%]">
                  <Spinner />
                </div>
              ) : formData.search ? (
                selectedOption == 'Items' ? (
                  <CustomSearchResults searchQuery={formData.search}>
                    <Hits
                      hitComponent={({ hit }) => {
                        return (
                          <div
                            tabIndex={0}
                            role="button"
                            key={hit.id}
                            onClick={() => {
                              // @ts-ignore
                              categoryRoute(hit.categories[0]?.id, hit.title.en, hit);
                              // @ts-ignore
                              triggerSingleProductSearch({ assetId: hit.id, search: hit.title.en });
                            }}
                            // onKeyDown={(e) => keyDownHandler(e, ()=>categoryRoute(hit.categoryPath[0].id as string))}
                          >
                            {/* @ts-ignore */}
                            <SearchItemsAndCategoryCard item={hit} />
                          </div>
                        );
                      }}
                    />
                  </CustomSearchResults>
                ) : (
                  <CustomSearchResults searchQuery={formData.search}>
                    <Hits
                      hitComponent={({ hit }) => {
                        return (
                          <div
                            key={hit.id}
                            tabIndex={0}
                            role="button"
                            onClick={() => sellerProfileRoute(hit.id)}
                            // onKeyDown={(e) => keyDownHandler(e, ()=>categoryRoute(item.userId))}
                          >
                            {/* @ts-ignore */}
                            <SearchUserAndCategoryCard item={hit} />
                          </div>
                        );
                      }}
                    />
                  </CustomSearchResults>
                )
              ) : null}
            </div>
          </>
        ) : placePredictions.length ? (
          <>
            <div className="h-full overflow-y-scroll border-primary px-4 divide-y-2 dark:divide-border-tertiary-dark divide-border-tertiary-light">
              <div
                className="flex items-center my-4 hover:cursor-pointer"
                onClick={fetchCurrentLocation}
                tabIndex={0}
                role="button"
                onKeyUp={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              >
                <LocationTargetIcon primaryColor={`${theme ? 'var(--brand-color)' : 'var(--brand-color)'}`} />

                <div className=" text-xs ml-2 font-medium">Current location</div>
              </div>
              {isPlacePredictionsLoading ? (
                <div className=" flex items-center justify-center h-[50%]">
                  <Spinner />
                </div>
              ) : (placePredictions.length === 0 && !isPlacePredictionsLoading && !isRecentSearchOpen) ? (
                <div className=" border-error bg-bg-secondary-light dark:bg-bg-primary-dark flex items-center h-[50%] justify-center">
                  <p className="truncate ml-3 flex dark:text-text-primary-dark ">No Data Found!</p>
                </div>
              ) : (
                placePredictions.map((item, index) => (
                  <>
                    <SearchLocationAutocompleteCard
                      key={index}
                      cardNumber={index}
                      item={item}
                      selectedAddressFromLocationBox={selectedAddressFromLocationBox}
                      setIsLocationTextBoxFocused={setIsLocationTextBoxFocused}
                      setSearchItemAndUserDrower={setSearchItemAndUserDrower}
                    />
                    {/* <p> {item?.description}</p>  */}
                  </>
                ))
              )}
            </div>
          </>
        ) : (
          <div className=" px-4 h-full flex flex-col overflow-y-scroll">
            <div
              className="flex fixed items-center my-1 hover:cursor-pointer"
              onClick={fetchCurrentLocation}
              tabIndex={0}
              role="button"
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                }
              }}
            >
              <LocationTargetIcon
                width="20"
                height="20"
                primaryColor={`${theme ? 'var(--brand-color)' : 'var(--brand-color)'}`}
              />

              <div className=" text-xs ml-2 font-medium">Current location</div>
            </div>
          </div>
        )}
        {/* //// new added */}
        {isRecentSearchOpen === true && !formData.search ? (
          <div
            className="h-fit overflow-y-scroll border-primary px-4 divide-y-2 dark:divide-border-tertiary-dark divide-border-tertiary-light"
            style={{
              overflowY: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <div className="overflow-y-auto">
              {isRecentSearchDataFetching ? (
                <div className="flex items-center justify-center h-[120px]">
                  <Spinner />
                </div>
              ) : recentSearchData?.data.data.length === 0 ? (
                <div className="px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark">
                  <h3 className="text-sm pt-4 flex items-center px-3 font-semibold">Recent Searches</h3>
                  <p className="text-sm font-normal">No Recent Searches</p>
                </div>
              ) : (
                <>
                  <h3 className="text-sm pt-4 flex text-text-primary-light dark:text-text-primary-dark items-center px-3 font-semibold">
                    Recent Searches
                  </h3>
                  {selectedOption === 'Items' &&
                    recentSearchData?.data?.data?.map((search, index) => (
                      <div
                        className="flex dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                        key={index}
                        onClick={() => selectItemOrUserToSearch?.(`${search.searchText}`)}
                      >
                        <Image src={HistoryIcon} alt={''} width={16} height={16} className="ml-3" />
                        <div className="truncate ml-3 flex">
                          <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                            {search.searchText}
                          </div>
                          {/* {search.mainCategory && (
                                <>
                                  <div className="font-semibold text-sm text-brand-color ml-1">in</div>
                                  <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark ml-1">
                                    {search.mainCategory}
                                  </div>
                                </>
                              )} */}
                        </div>
                      </div>
                    ))}

                  {selectedOption === 'Users' &&
                    recentSearchData?.data?.user.map((search, index) => (
                      <button
                        className="w-full flex dark:hover:text-text-primary-dark text-text-secondary-light dark:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                        key={index}
                        onClick={() => selectItemOrUserToSearch?.(`${search.searchText}`)}
                      >
                        <Image src={HistoryIcon} alt={''} width={16} height={16} className="ml-3" />
                        <div className="truncate ml-3 flex">
                          <div className="border-3 font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                            {search.searchText}
                          </div>
                        </div>
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>
        ) : null}
        {/* //// */}
      </InstantSearch>
    </div>
  );
};

export default SearchUserAndCategoryDrower;

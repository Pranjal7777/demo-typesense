/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import { GOOGLE_MAPS_KEY, HIDE_SELLER_FLOW, STATIC_IMAGE_URL } from '@/config';
import isUserAuthenticated from '@/helper/validation/check-user-authentication';
import { productsApi } from '@/store/api-slices/products-api';
import { Product, SearchItems, SearchUsers } from '@/store/types';
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
import { routeToCategories, routeSellerProfile, routeToSearch } from '@/store/utils/route-helper';
import { Hits, InstantSearch, Configure, connectStateResults } from 'react-instantsearch-dom';
import SearchBox from '@/components/typesense/SearchBox';
import SearchResults from '@/components/typesense/SearchResults';
import Image from 'next/image';
import HistoryIcon from '../../../../public/images/history-icon.svg';
import { CustomSearchResults } from './custom-hits';
import Link from 'next/link';
import { FormDataT } from '@/components/sections/hero-section';
import { getCookie, setCookie } from '@/utils/cookies';
import { SearchResponse } from '@/types';
import LeftArrowIcon from '../../../../public/assets/svg/left-arrow-icon';
import { getUserLocation } from '@/helper/get-location';
import getAddressFromLatLng from '@/helper/get-address-by-lat-lng';
import { IMAGES } from '@/lib/images';

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
  mobileContainerClassName?: string;
  showBackArrow?: boolean;
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
  mobileContainerClassName,
  showBackArrow = false,
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
  const [showRecentSearch, setShowRecentSearch] = useState(false);
  const recentSearchRef = useRef<HTMLDivElement | null>(null);

   const handleClickOutside = (event: MouseEvent) => {
     if (
       recentSearchRef.current &&
       !recentSearchRef.current.contains(event.target as Node)
     ) {
       setShowRecentSearch(false);
     }
   };

   useEffect(() => {
     document.addEventListener('mousedown', handleClickOutside);
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, []);


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
  const [hasValidSearchResults, setHasValidSearchResults] = useState(false);
  const isUserLogin = isUserAuthenticated();

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));
  }, []);

  useEffect(() => {
    const searchQuery = router.query.search as string;
    if (searchQuery) {
      searchClient
        .search([
          {
            indexName: selectedOption === 'Items' ? 'kwibal_asset' : 'kwibal_accounts',
            params: {
              query: searchQuery,
              query_by: selectedOption === 'Items' ? 'title.en' : 'first_name,last_name',
              hitsPerPage: 1,
            },
          },
        ])
        .then(({ results }: SearchResponse) => {
          // setHasValidSearchResults(results[0]?.hits?.length > 0);
          setFormData((prev) => ({
            ...prev,
            search: searchQuery,
            resultDropdown: false,
          }));
        });
    }
  }, [router.query.search, selectedOption]);

  const addItemToRecentSearch = (assetId: string, search: string) => {
    triggerSingleProductSearch({ assetId, search });
  };
  const addUserToRecentSearch = (clickeduserId: string) => {
    triggerAddUserDataToRecentSearch({ clickeduserId });
  };

  const categoryRoute = async (categoryId: string, search: string, hit?: Hit) => {
    // const url = routeToCategories({ category: { id: categoryId, name: hit?.mainCategory || '' } });
    const searchUrl = routeToSearch({ category: { id: categoryId, name: search || '' } });
    router.push({
      pathname: searchUrl,
      // query: {
      //   search: search || undefined,
      // },
    });
  };

  const sellerProfileRoute = (userId: string, searchText: string) => {
    router.push({
      pathname: routeSellerProfile(userId),
      query: {
        search: searchText,
      },
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    const newOption = option as 'Items' | 'Users';
    setIsUserOrProduct([]);
    setSelectedOption(newOption);
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));
    setIsOpen(false);
    setShowRecentSearch(false);

    // Store selection in cookie
    setCookie('searchType', newOption);
  };

  const handleRemoveSearchHelper = () => {
    setFormData({ ...formData, search: '' });
  };

  const handleInstantSearchOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setShowRecentSearch(true);
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      resultDropdown: true,
      [name]: value,
    }));

    if (value.trim()) {
      const { results } = await searchClient.search([
        {
          indexName: selectedOption === 'Items' ? 'kwibal_asset' : 'kwibal_accounts',
          params: {
            query: value,
            query_by: selectedOption === 'Items' ? 'title.en' : 'first_name,last_name',
            hitsPerPage: 1,
          },
        },
      ]);
      setHasValidSearchResults(results[0]?.hits?.length > 0);
    } else {
      setHasValidSearchResults(!!router.query.search);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsUserOrProduct([]);
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
  const handleSearchEnterKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    // if (event.key === 'Enter' && hasValidSearchResults) {
    if (event.key === 'Enter') {
      if (formData.search !== '') {
        await selectItemOrUserToSearch(formData.search);
        if (selectedOption !== 'Users') {
          trigger(formData.search);
        }
      }
    }
  };

  const selectItemOrUserToSearch = async (searchText: string) => {
    try {
      const currentOption = getCookie('searchType') as 'Items' | 'Users';
      const { results } = await searchClient.search([
        {
          indexName: currentOption === 'Items' ? 'kwibal_asset' : 'kwibal_accounts',
          params: {
            query: searchText,
            query_by: currentOption === 'Items' ? 'title.en' : 'first_name,last_name',
            hitsPerPage: 1,
          },
        },
      ]);

      // if (results[0]?.hits?.length > 0) {
        const hit = results[0].hits[0];
        if (currentOption === 'Items') {
          categoryRoute(hit?.categories[0]?.id || '', searchText, hit);
        } else {
          sellerProfileRoute(hit?.id || '', searchText);
        }
        setIsOpen(false);
      // }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSearchButtonClick = async () => {
    setIsOpen(false);
    let searchText = formData.search.trim();

    // If no text is typed, use the first recent search
    if (!searchText) {
      searchText = getFirstAvailableRecentSearch() || '';
    }

    if (searchText) {
      await selectItemOrUserToSearch(searchText);
    }
  };

  useEffect(() => {
    getUserLocation().then((userCurrentLocation) => {
      const lat = userCurrentLocation.latitude;
      const lng = userCurrentLocation.longitude;
      getAddressFromLatLng(lat, lng).then((address) => {
        const data = {
          address: (address?.addressLine1 as string) || '',
          city: (address?.city as string) || '',
          country: (address?.country as string) || '',
          latitude: lat.toString(),
          longitude: lng.toString(),
        };
        setMyLocationDispatch(data);
      });
    });
  }, []);

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

  // Add this function to handle the first available recent search
  const getFirstAvailableRecentSearch = () => {
    if (recentSearchData) {
      if (selectedOption === 'Items' && recentSearchData?.data?.data?.length > 0) {
        return recentSearchData.data.data[0].searchText;
      } else if (selectedOption === 'Users' && recentSearchData?.data?.user?.length > 0) {
        return recentSearchData.data.user[0].searchText;
      }
    }
    return null;
  };

  // Update the button's disabled state to consider recent searches
  const isSearchButtonEnabled = () => {
    if (hasValidSearchResults) return true;
    if (!formData.search.trim() && recentSearchData) {
      return (
        (selectedOption === 'Items' && recentSearchData?.data?.data?.length > 0) ||
        (selectedOption === 'Users' && recentSearchData?.data?.user?.length > 0)
      );
    }
    return false;
  };

  useEffect(() => {
    // Get initial value from cookie
    const savedOption = getCookie('searchType') as 'Items' | 'Users';
    if (savedOption && (savedOption === 'Items' || savedOption === 'Users')) {
      setSelectedOption(savedOption);
    } else {
      // Set default value if no cookie exists
      setCookie('searchType', 'Items');
      setSelectedOption('Items');
    }
  }, []); // Run once on mount

  // Add this helper function at the top of the component
  const getPrimaryColor = () => {
    const isSellerProfilePage =
      router.pathname.startsWith('/seller-profile/') || router.pathname.startsWith('/product');

    if (isSellerProfilePage) {
      return theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)';
    }

    return minThreshold && theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)';
  };

  const getSearchItemImageUrl = (hit: any) => {
    return hit.images[0].type === 'VIDEO'
      ? hit.images[0].thumbnailUrl?.includes('https')
        ? hit.images[0].thumbnailUrl
        : `${STATIC_IMAGE_URL}/${hit.images[0].thumbnailUrl}` || (theme ? IMAGES.FALLBACK_IMAGE_DARK : IMAGES.FALLBACK_IMAGE_LIGHT)
      : hit.images[0].url?.includes('https')
      ? hit.images[0].url
      : `${STATIC_IMAGE_URL}/${hit.images[0].url}` || (theme ? IMAGES.FALLBACK_IMAGE_DARK : IMAGES.FALLBACK_IMAGE_LIGHT);
  };

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
          {!HIDE_SELLER_FLOW && (
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
                {!HIDE_SELLER_FLOW &&
                  (isOpen ? (
                    <UpArrowRoundedEdge primaryColor={getPrimaryColor()} className="ml-2 rtl:ml-0 rtl:mr-2" />
                  ) : (
                    <DownArrowRoundedEdge primaryColor={getPrimaryColor()} className="ml-2 rtl:ml-0 rtl:mr-2" />
                  ))}
              </button>

              {!HIDE_SELLER_FLOW && isOpen && (
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
                  {!HIDE_SELLER_FLOW && (
                    <button
                      className={` border-error p-2 cursor-pointer hover:bg-bg-octonary-light
                    dark:text-text-primary-dark dark:hover:bg-menu-hover dark:hover:text-text-secondary-dark
                  hover:rounded-b-md `}
                      onClick={() => handleOptionSelect('Users')}
                    >
                      {heroSection?.searchUserandItem?.users}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

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
                } dark:text-text-primary-light placeholder-text-denary-light ${
                  stickyHeaderWithSearchBox &&
                  'bg-bg-tertiary-light dark:!bg-bg-quinary-dark dark:!text-text-primary-dark'
                } dark:hover:bg-bg-octonary-dark hover:bg-bg-tertiary-light cursor-text h-full w-full outline-none pl-12 rtl:pr-12 ${
                  minThreshold ? 'dark:bg-bg-secondary-dark dark:!text-text-primary-dark bg-bg-tertiary-light' : ''
                }
                 ${minThreshold && theme ? 'dark:bg-bg-secondary-dark dark:hover:!text-black bg-bg-tertiary-light' : ''}
                `}
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

              {!!formData?.search && formData.resultDropdown && showRecentSearch && (
                <SearchResults>
                  <div
                    ref={recentSearchRef}
                    className="absolute top-[48px] z-50 shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-hidden max-h-[263px]"
                  >
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
                                // @ts-ignore
                                categoryRoute(hit.categories[0].id, hit.title.en, hit);
                                setIsOpen(false);
                              }}
                            >
                              <div className="truncate ml-3 flex items-center gap-2">
                                <Image
                                  src={getSearchItemImageUrl(hit)}
                                  alt={'search-product-image'}
                                  width={40}
                                  height={40}
                                  className=" h-8 w-8 rounded-full"
                                />
                                <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                                  {/* @ts-ignore */}
                                  {hit?.title?.en}
                                </div>
                                <div className="font-semibold text-sm text-brand-color ml-1">in </div>
                                <div className="font-medium text-sm text-brand-color ml-1">{hit.mainCategory}</div>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="w-full flex dark:hover:text-text-primary-dark text-text-secondary-light dark:text-text-primary-dark border-border-tertiary-light h-14 items-center cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark"
                              onClick={async () => {
                                const fullName = `${hit.first_name} ${hit.last_name}`;
                                sellerProfileRoute(hit.id, fullName);
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
                width={'14'}
                height={'14'}
                className={
                  'absolute right-4 rtl:right-[95%] hover:cursor-pointer transition duration-75 hover:scale-105'
                }
                primaryColor={getPrimaryColor()}
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

            {isUserLogin && isRecentSearchOpen === true && !formData.search ? (
              <div
                className="absolute top-[48px] z-50 shadow-2xl bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md max-h-[263px] no-scrollbar"
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
                            onClick={() => selectItemOrUserToSearch(`${search.searchText}`)}
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
                            onClick={() => selectItemOrUserToSearch(`${search.searchText}`)}
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
          </div>

          <div className="flex flex-[8] items-center justify-center 2lg:flex-[10] lg:flex-[8] md:flex-[6] sm:flex-[4]">
            <div className="relative h-full w-full items-center flex justify-center ">
              <LocationSvg width={'17'} height={'17'} className="absolute left-4 rtl:right-4 " />

              {/* add location searchbox */}

              <input
                className={`truncate dark:text-text-primary-light placeholder-text-denary-light /*dark:text-text-primary-dark*/${
                  stickyHeaderWithSearchBox &&
                  ' !bg-bg-tertiary-light dark:!bg-bg-quinary-dark dark:!text-text-primary-dark dark:hover:!text-text-primary-dark'
                } dark:hover:bg-bg-octonary-dark hover:bg-bg-tertiary-light  cursor-text h-full w-full pl-11 pr-9 rtl:pr-11 outline-none ${
                  minThreshold
                    ? 'dark:bg-bg-secondary-dark dark:!text-text-primary-dark dark:hover:!text-black  bg-bg-tertiary-light'
                    : ''
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
                className={` absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-b-md overflow-hidden max-h-[200px]`}
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
                  width={'14'}
                  height={'14'}
                  className={
                    'absolute right-4 rtl:right-[95%] hover:cursor-pointer transition duration-75 hover:scale-105'
                  }
                  primaryColor={getPrimaryColor()}
                  onClick={() => {
                    setFormData({ ...formData, location: '' });
                    // handleRemoveLocationHelper();
                    setIsAutoCompleteLocationBoxOpen(false);
                  }}
                />
              ) : (
                <>
                  <LocationTargetIcon
                    width={'14'}
                    height={'14'}
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
              className={`bg-btn-quaternary-light text-text-secondary-light hover:text-text-primary-light dark:hover:text-text-primary-dark dark:text-text-primary-dark h-[36px] focus:outline-none hover:bg-btn-quinary-light font-medium rounded text-sm px-5 mr-1 rtl:ml-1 ${
                !isSearchButtonEnabled() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="button"
              onClick={handleSearchButtonClick}
              disabled={!isSearchButtonEnabled()}
            >
              {heroSection.button}
            </Button>
          </div>
        </div>
        {/* desktop search box end*/}

        {/* mobile search box start */}
        <div
          className={appClsx(
            ` mobile:order-3 sm:hidden ${
              stickyHeaderWithSearchBox && '!fixed top-[69px] bg-bg-secondary-light dark:bg-bg-secondary-dark'
            }  z-50 sticky top-[69px] ${
              minThreshold
                ? '!fixed top-[69px] mobile:px-4 w-full bg-bg-secondary-light dark:bg-bg-primary-dark'
                : 'max-w-[1083px] mobile:px-4'
            } mobile:inline-block mx-5 relative w-full max-w-[638px] `,
            mobileContainerClassName
          )}
        >
          {showBackArrow && (
            <LeftArrowIcon
              onClick={() => router.back()}
              primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
              className="absolute top-6 left-4"
            />
          )}
          <button
            className={`relative mb-2  ${
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
            } bg-bg-tertiary-light w-full pr-2 hover:bg-bg-tertiary-light text-text-secondary-color rounded-lg h-[42px] mobile:mb-3 flex items-center`}
            onClick={() => setSearchItemAndUserDrower(!searchItemAndUserDrower)}
          >
            <SearchIcon
              width={16}
              height={16}
              className="absolute  mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3 "
            />
            <span
              className={`text-base  ml-9 mobile:text-sm rtl:ml-0 rtl:mr-9 truncate text-text-secondary-dark ${
                formData.search ? '' : 'text-text-denary-light'
              }`}
            >
              {formData.search ? formData.search : heroSection.searchPlaceholder}
            </span>
          </button>
        </div>
        {/* mobile search box start */}

        {/* p tag was here */}
      </div>

      {/* mobile screen DROWER */}
      <SearchUserAndCategoryDrower
        selectItemOrUserToSearch={selectItemOrUserToSearch}
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

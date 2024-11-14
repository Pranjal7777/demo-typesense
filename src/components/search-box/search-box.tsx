import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import SearchUserAndCategoryDrower from './search-user-and-category-drower';
import Image from 'next/image';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Button from '../ui/button';
import { useTranslation } from 'next-i18next';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import { GOOGLE_MAPS_KEY, STATIC_IMAGE_URL } from '@/config';
import { productsApi } from '@/store/api-slices/products-api';
import Link from 'next/link';
import { SearchItems, SearchUsers } from '@/store/types';
import { useDebounce } from '@/hooks/use-debounce';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { HydrationGuard } from '../ui/hydration-guard';
import LocationTargetIcon from '../../../public/assets/svg/location-target-icon';


export type Props = {
  windowScroll: number;
  windowWidth: number;
  // content: {
  //   heading: string,
  //   trendingSearchText: string
  // },
  stickyHeaderWithSearchBox?: boolean;
  handleGetLocationHelper: () => Promise<boolean>;
  handleRemoveLocationHelper: () => void;
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

const SearchBox: FC<Props> = ({
  stickyHeaderWithSearchBox = false,
  windowScroll,
  windowWidth,
  handleGetLocationHelper,
  handleRemoveLocationHelper,
}) => {
  const { t } = useTranslation('common');
  const heroSection = t('page.header.heroSection', { returnObjects: true }) as heroSection;

  const [searchItemAndUserDrower, setSearchItemAndUserDrower] = useState(true);

  //1st DropDown
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Items');
  const [, setCrossAndLocationImage] = useState(false);

  const address = useAppSelector((state) => state.auth.myLocation?.address);
  const { setUpdateLocationDispatch, setMyLocationDispatch } = useActions();

  const { placesService, placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (placePredictions.length) setIsAutoCompleteLocationBoxOpen(true);
  }, [placePredictions]);

  useEffect(() => {
    if (address) {
      setCrossAndLocationImage(true);
    } else {
      setCrossAndLocationImage(false);
    }
  }, [address]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    products = [];
    setSelectedOption(option);
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));

    setIsOpen(false);
  };
  //----end //1st DropDown

  // const [search,setSearch]=useState("");
  const [formData, setFormData] = useState({
    search: '',
    location: '',
    resultDropdown: false,
  });

  const handleRemoveSearchHelper = () => {
    setFormData({ ...formData, search: '' });
  };

  const [isRecentSearchOpen, setIsRecentSearchOpen] = useState(false);
  const [isAutoCompleteLocationBoxOpen, setIsAutoCompleteLocationBoxOpen] = useState(false);
  const [isSearchProductOrUserOpen, setIsSearchProductOrUserOpen] = useState(false);

  const debouncedLocationSearchTerm: string = useDebounce(formData.location, 200);
  useEffect(() => {
    if (debouncedLocationSearchTerm.length > 2) {
      getPlacePredictions({ input: debouncedLocationSearchTerm });
    }
  }, [debouncedLocationSearchTerm]);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    if (name == 'location') {
      setUpdateLocationDispatch(data);

      // getPlacePredictions({ input: e.target.value });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && formData.location.length === 1) {
      setIsAutoCompleteLocationBoxOpen(false);
    }
  };

  // const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm: string = useDebounce(formData.search, 200); // Debounce input
  const IsUserOrItemFlag = selectedOption === 'Users' ? '&type=2' : '';
  const { data: searchProductsAndUsers } = productsApi.useSearchProductsAndUsersQuery(
    {
      serachQuery: debouncedSearchTerm,
      IsUserOrItemFlag,
    },
    {
      skip: !debouncedSearchTerm.trim(),
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  // //#change todo
  // let products: SearchItems[] | SearchUsers[] = [];

  // // Check if the search query is not empty and then proceed
  // if (formData.search !== '') {
  //   // First, check if 'searchProductsAndUsers' is not undefined or null
  //   if (searchProductsAndUsers !== undefined && searchProductsAndUsers !== null) {
  //     // Check if 'searchProductsAndUsers' has 'data' property
  //     if ('data' in searchProductsAndUsers) {
  //       products = searchProductsAndUsers.data;
  //     }
  //     // Separately, check if 'searchProductsAndUsers' has 'users' property
  //     else if ('users' in searchProductsAndUsers) {
  //       products = searchProductsAndUsers.users;
  //     }
  //   }
  // }
  // // If the search query is empty, keep 'products' as an empty array
  // else {
  //   products = [];
  // }

  // recent search api start -----------------------------------
  const { data: recentSearchData } = productsApi.useGetRecentSearchDataQuery(undefined, { skip: !isRecentSearchOpen });

  const onFocusSearchBoxHandle = () => {
    formData.search === '' && setIsRecentSearchOpen(true);
  };
  const onBlurSearchBoxHandle = () => {
    setIsRecentSearchOpen(false);
    setIsSearchProductOrUserOpen(false);
  };
  // recent search api end --------------------------

  const [trigger] = productsApi.useLazyAddRecentSearchDataQuery();
  const [triggerSingleProductSearch] = productsApi.useLazyAddRecentSearchDataWithSingleProductQuery();

  const handleSearchEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (formData.search !== '') {
        trigger(formData.search);
      }
    }
    if (formData.search !== '') {
      setIsSearchProductOrUserOpen(true);
    }
  };

  //#change todo
  let products: SearchItems[] | SearchUsers[] = [];

  // Check if the search query is not empty and then proceed
  if (formData.search !== '') {
    // First, check if 'searchProductsAndUsers' is not undefined or null
    if (searchProductsAndUsers !== undefined && searchProductsAndUsers !== null) {
      // Check if 'searchProductsAndUsers' has 'data' property
      if ('data' in searchProductsAndUsers) {
        products = searchProductsAndUsers.data;
      }
      // Separately, check if 'searchProductsAndUsers' has 'users' property
      else if ('users' in searchProductsAndUsers) {
        products = searchProductsAndUsers.users;
      }
    }
  }

  // If the search query is empty, keep 'products' as an empty array
  else {
    products = [];
  }

  const selectedAddressFromLocationBox = (key: number) => {
    setIsAutoCompleteLocationBoxOpen(false);

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
            // setUpdateLocationDispatch(data);
          } else {
            console.error('Geocode was not successful for the following reason:', status);
          }
        });
      }
    );
  };

  return (
    <HydrationGuard>
      {/* @todo */}
      {/* // desktop,letop,tab screen  */}
      <div
        className={`mobile:mt-12 mobile:px-4 ${
          stickyHeaderWithSearchBox && 'dark:border-b  dark:border-b-border-tertiary-dark'
        } text-text-primary-light dark:text-text-primary-dark z-[2] w-full sm:mx-[64px] flex mobile:items-center flex-col sticky top-[69px] ${
          stickyHeaderWithSearchBox &&
          ' flex items-center min-w-full bg-bg-secondary-light dark:bg-bg-primary-dark !fixed top-[69px] px-16 '
        } ${windowScroll > 130 ? '!fixed top-[69px] sm:px-[64px]' : ''}  ${
          !(windowScroll > 130) ? 'max-w-[1083px]' : 'w-full bg-bg-secondary-light dark:bg-bg-primary-dark'
        } transition-all duration-300 ease-in`}
      >
        <h1
          className={`mobile:text-2xl mobile:font-semibold mobile:leading-9 mobile:text-center mobile:order-1 text-text-secondary-light dark:text-text-primary-dark text-4xl  font-semibold  ${
            stickyHeaderWithSearchBox && 'hidden'
          } ${!(windowScroll > 130) ? '' : 'hidden'} transition-all duration-300 ease-in`}
        >
          {heroSection.title}
        </h1>

        {/* desktop search box start*/}
        <div
          className={`text-sm mobile:hidden ${
            stickyHeaderWithSearchBox && 'bg-bg-tertiary-light dark:!bg-bg-quinary-dark '
          }  h-11 w-full max-w-[1083px] mobile:min-w-0 my-4 bg-bg-secondary-light rounded text-black flex ${
            stickyHeaderWithSearchBox && 'xl:max-w-[1312px] '
          } ${
            !(windowScroll > 130)
              ? ''
              : ' dark:!bg-bg-secondary-dark dark:text-text-primary-dark bg-bg-tertiary-light w-full xl:max-w-[1312px] mx-auto transition-all duration-300 ease-in'
          }`}
        >
          <div className="border-r  rtl:border-r-0 rtl:border-l relative rtl:rounded-r rtl:rounded-l-none rounded-l w-full h-full flex-[2] border-[#DEE2E6] dark:border-[#3D3B45] ">
            <button
              type="button"
              onClick={toggleDropdown}
              className={`${stickyHeaderWithSearchBox && 'dark:!text-text-primary-dark'} ${
                !(windowScroll > 130) ? 'dark:text-text-secondary-dark' : 'dark:text-text-primary-dark'
              }  hover:bg-bg-tertiary-light dark:hover:bg-bg-octonary-dark dark:hover:text-text-secondary-dark rtl:rounded-r rtl:rounded-l-none rounded-l w-full h-full outline-none flex items-center justify-center`}
            >
              {selectedOption === 'Items'
                ? heroSection?.searchUserandItem?.items
                : heroSection?.searchUserandItem?.users}

              {windowScroll > 130 ? (
                <>
                  <Image
                    width={10}
                    height={6}
                    className="ml-2 rtl:ml-0 rtl:mr-2 dark:hidden inline"
                    src={IMAGES.DOWN_ARROW_ICON_BLACK}
                    loader={gumletLoader}
                    alt="down-arrow-icon"
                  />
                  <Image
                    width={10}
                    height={6}
                    className="ml-2 rtl:ml-0 rtl:mr-2 dark:inline hidden"
                    src={IMAGES.DOWN_ARROW_ICON_WHITE}
                    loader={gumletLoader}
                    alt="down-arrow-icon"
                  />
                </>
              ) : (
                <>
                  <Image
                    width={10}
                    height={6}
                    className="ml-2 rtl:ml-0 rtl:mr-2 "
                    src={IMAGES.DOWN_ARROW_ICON_BLACK}
                    loader={gumletLoader}
                    alt="down-arrow-icon"
                  />
                </>
              )}
            </button>

            {isOpen && (
              <ul
                className={`${
                  stickyHeaderWithSearchBox && 'dark:!text-text-primary-dark dark:bg-bg-quinary-dark'
                }  absolute z-10 w-full  bg-bg-secondary-light 
                dark:bg-bg-secondary-dark dark:text-text-primary-dark
                shadow-lg text-center rounded-b-md`}
              >
                <li
                  className={`p-2 cursor-pointer  hover:bg-bg-octonary-light 
                    dark:text-text-primary-dark dark:hover:bg-menu-hover dark:hover:text-text-secondary-dark
                   hover:rounded-b-md`}
                >
                  <span
                    onClick={() => handleOptionSelect('Items')}
                    tabIndex={0}
                    role="button"
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOptionSelect('Items');
                      }
                    }}
                  >
                    {heroSection?.searchUserandItem?.items}
                  </span>
                </li>
                <li
                  className={`p-2 cursor-pointer hover:bg-bg-octonary-light
                    dark:text-text-primary-dark dark:hover:bg-menu-hover dark:hover:text-text-secondary-dark
                   hover:rounded-b-md `}
                >
                  <span
                    onClick={() => handleOptionSelect('Users')}
                    tabIndex={0}
                    role="button"
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOptionSelect('Users');
                      }
                    }}
                  >
                    {heroSection?.searchUserandItem?.users}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div
            className={
              'relative flex-[15] flex items-center justify-center 2lg:flex-[10] lg:flex-[8] md:flex-[6] sm:flex-[4] '
            }
          >
            <Image
              width={17}
              height={17}
              className="absolute left-4 rtl:right-4 "
              src={IMAGES.SEARCH_ICON_BLACK}
              loader={gumletLoader}
              alt="search-icon"
            />

            <input
              className={`pr-10 truncate border-r border-[#DEE2E6] dark:border-[#3D3B45] dark:text-text-primary-light placeholder-text-denary-light /*dark:text-text-primary-dark*/ ${
                stickyHeaderWithSearchBox &&
                'bg-bg-tertiary-light dark:!bg-bg-quinary-dark dark:!text-text-primary-dark dark:hover:!text-text-primary-dark'
              } dark:hover:bg-bg-octonary-dark hover:!bg-bg-tertiary-light hover:dark:!text-text-primary-light cursor-pointer h-full w-full outline-none pl-12 rtl:pr-12 ${
                !(windowScroll > 130)
                  ? ''
                  : 'dark:bg-bg-secondary-dark dark:!text-text-primary-dark bg-bg-tertiary-light'
              }`}
              value={formData.search}
              name="search"
              onChange={(e) => {
                handleOnChange(e);
                formData.search === '' && setIsRecentSearchOpen(false);
              }}
              type="text"
              placeholder={heroSection?.searchItem?.placeholder}
              autoComplete="off"
              // onClick={() => { setIsRecentSearchOpen(true); formData.search !== "" && setIsRecentSearchOpen(false); formData.search === "" && setIsRecentSearchOpen(!isRecentSearchOpen); }}
              onFocus={() => onFocusSearchBoxHandle()}
              onBlur={() => onBlurSearchBoxHandle()}
              onKeyDown={handleSearchEnterKeyDown}
            />

            {formData.search !== '' ? (
              windowScroll > 130 ? (
                <>
                  <Image
                    width={17}
                    height={17}
                    className={
                      'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 dark:hidden inline'
                    }
                    src={IMAGES.CROSS_ICON}
                    alt="location-target-icon"
                    loader={gumletLoader}
                    onClick={() => handleRemoveSearchHelper()}
                  />
                  <Image
                    width={17}
                    height={17}
                    className={
                      'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 dark:inline hidden'
                    }
                    src={IMAGES.CROSS_ICON_WHITE}
                    alt="location-target-icon"
                    loader={gumletLoader}
                    onClick={() => handleRemoveSearchHelper()}
                  />
                </>
              ) : (
                <Image
                  width={17}
                  height={17}
                  className={'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 '}
                  src={IMAGES.CROSS_ICON}
                  alt="location-target-icon"
                  loader={gumletLoader}
                  onClick={() => handleRemoveSearchHelper()}
                />
              )
            ) : null}

            {selectedOption === 'Items' && isSearchProductOrUserOpen ? (
              <>
                {products.length ? (
                  <div className=" absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark  left-0 right-0 rounded-md">
                    {(products as SearchItems[])?.map((item, index) => (
                      <>
                        <Link
                          href={'/product'}
                          className="flex border-b dark:border-none dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center rounded-md cursor-pointer hover:bg-bg-octonary-light dark:hover:bg-bg-duodenary-dark "
                          key={index}
                          onClick={() => triggerSingleProductSearch({ assetId: item.assetId, search: item.assetTitle })}
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
                              // src={item.images?.[0]?.url ?  `${STATIC_IMAGE_URL}/${item.images[0].url}` : '/images/user-profile-icon-black.svg'}

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
                              // src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"

                              alt={''}
                            />
                          </div>
                          <div className="truncate ml-3 flex">
                            <div className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark">
                              {item.assetTitle}&nbsp; in &nbsp;
                            </div>
                            <div className="text-sm font-normal text-brand-color truncate">{item.inSection}</div>
                            {/* <div className="font-bold text-sm">{item.price}</div> */}
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                ) : (
                  <div className=" absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark  left-0 right-0 rounded-md py-4">
                    <p className="truncate ml-3 flex dark:text-text-primary-dark">No Product Found!</p>
                  </div>
                )}
              </>
            ) : null}

            {selectedOption === 'Users' && isSearchProductOrUserOpen ? (
              <>
                {products.length ? (
                  <div className="absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-md">
                    {(products as SearchUsers[])?.map((user, index) => (
                      <Link
                        href={'/product'}
                        className="flex border-b dark:border-none dark:hover:text-text-primary-dark border-border-tertiary-light h-14 items-center rounded-md cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark "
                        key={index}
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
                            // src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                            alt={''}
                          />
                        </div>
                        <div className="truncate ml-3 flex">
                          <div className="font-medium text-sm ">
                            {user.firstName} {user.lastName}&nbsp;
                          </div>
                          <div className="text-sm font-normal text-brand-color truncate">{user.userName}</div>
                          {/* <div className="font-bold text-sm">{item.price}</div> */}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className=" absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark  left-0 right-0 rounded-md py-4">
                    <p className="truncate ml-3 flex dark:text-text-primary-dark">No User Found!</p>
                  </div>
                )}
              </>
            ) : null}

            {isRecentSearchOpen === true ? (
              <div className=" absolute top-[48px] bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-md">
                <div className="ml-4 mt-3 mb-3 dark:text-text-primary-dark">Recent Searches</div>
                {recentSearchData?.data.data.length === 0 && (
                  <h4 className="ml-4 mt-3 mb-3 text-text-primary-light dark:text-text-primary-dark">No Data</h4>
                )}
                {recentSearchData?.data.data?.slice(0, 5).map((search, index) => (
                  <Link
                    href={'/product'}
                    className="flex border-b dark:border-none  dark:hover:text-text-secondary-dark border-border-tertiary-light h-9 items-center rounded-md cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark  "
                    key={index}
                  >
                    <div className=" ml-4">
                      <Image
                        width={14}
                        height={14}
                        src={IMAGES.HISTORY_ICON}
                        loader={gumletLoader}
                        alt="history-icon"
                      />
                    </div>
                    <div className="truncate ml-2 flex">
                      <div className="font-normal text-sm dark:text-text-primary-dark text-text-primary-light ">
                        {search.searchText}&nbsp;
                      </div>
                      {/* <div className="text-sm font-normal text-brand-color truncate">{user.userName}</div> */}
                      {/* <div className="font-bold text-sm">{item.price}</div> */}
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="  flex flex-[8] items-center justify-center 2lg:flex-[10] lg:flex-[8] md:flex-[6] sm:flex-[4]">
            <div className="relative h-full w-full items-center flex justify-center ">
              <Image
                width={17}
                height={17}
                className="absolute left-4 rtl:right-4 "
                src={IMAGES.LOCATION_ICON_BLACK}
                loader={gumletLoader}
                alt="location-icon"
              />

              {/* add location searchbox */}

              <input
                className={`truncate dark:text-text-primary-light placeholder-text-denary-light /*dark:text-text-primary-dark*/${
                  stickyHeaderWithSearchBox &&
                  ' !bg-bg-tertiary-light dark:!bg-bg-quinary-dark dark:!text-text-primary-dark dark:hover:!text-text-primary-dark'
                } dark:hover:bg-bg-octonary-dark hover:bg-bg-tertiary-light hover:dark:!text-text-primary-light  cursor-pointer h-full w-full pl-11 pr-9 rtl:pr-11 outline-none ${
                  !(windowScroll > 130)
                    ? ''
                    : 'dark:bg-bg-secondary-dark dark:!text-text-primary-dark  bg-bg-tertiary-light'
                }`}
                placeholder={heroSection?.searchPlace?.placeholder}
                autoComplete="off"
                value={address || formData.location}
                onChange={(e) => {
                  handleOnChange(e);
                }}
                onKeyDown={handleKeyDown}
                name="location"
              />
              {isAutoCompleteLocationBoxOpen ? (
                <>
                  <div className=" absolute top-[46px] bg-bg-secondary-light dark:bg-bg-secondary-dark left-0 right-0 rounded-md">
                    {placePredictions.slice(0, 5).map((search, index) => (
                      <span
                        onClick={() => selectedAddressFromLocationBox(index)}
                        className="flex border-b dark:border-none dark:hover:text-text-secondary-dark border-border-tertiary-light h-9 items-center rounded-md cursor-pointer hover:bg-bg-octonary-light  dark:hover:bg-bg-duodenary-dark "
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
                          <Image
                            className=" border-error max-w-[14px] max-h-[18px] "
                            width={14}
                            height={14}
                            src={IMAGES.LOCATION_ICON_BLACK}
                            loader={gumletLoader}
                            alt="history-icon"
                          />
                        </div>
                        <div className="truncate ml-2 flex">
                          <div className="truncate font-normal text-sm text-text-primary-light dark:text-text-primary-dark">
                            {search.description}&nbsp;
                          </div>
                          {/* <div className="text-sm font-normal text-brand-color truncate">{user.userName}</div> */}
                          {/* <div className="font-bold text-sm">{item.price}</div> */}
                        </div>
                      </span>
                    ))}
                  </div>
                </>
              ) : null}

              {formData.location || address ? (
                <>
                  <Image
                    width={17}
                    height={17}
                    className={
                      'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 dark:hidden inline'
                    }
                    src={IMAGES.CROSS_ICON}
                    alt="location-target-icon"
                    loader={gumletLoader}
                    onClick={() => {
                      setFormData({ ...formData, location: '' });
                      handleRemoveLocationHelper();
                      setIsAutoCompleteLocationBoxOpen(false);
                    }}
                  />
                  <Image
                    width={17}
                    height={17}
                    className={
                      'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 dark:inline hidden'
                    }
                    src={IMAGES.CROSS_ICON_WHITE}
                    alt="location-target-icon"
                    loader={gumletLoader}
                    onClick={() => {
                      setFormData({ ...formData, location: '' });
                      handleRemoveLocationHelper();
                      setIsAutoCompleteLocationBoxOpen(false);
                    }}
                  />
                </>
              ) : (
                <>
                  {/* <Image
                    width={17}
                    height={17}
                    className={` absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 `}
                    src={IMAGES.LOCATION_TARGET_ICON}
                    alt="location-target-icon"
                    loader={gumletLoader}
                    onClick={() => handleGetLocationHelper()}
                  /> */}
                  <LocationTargetIcon
                    width={'17'}
                    height={'17'}
                    className={
                      ' absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 '
                    }
                    color="var(--brand-color)"
                    onClick={() => handleGetLocationHelper()}
                  />
                </>
              )}
            </div>
            <Button
              buttonType={'quaternary'}
              className="bg-btn-quaternary-light text-text-secondary-light  hover:text-text-primary-light dark:hover:text-text-primary-dark dark:text-text-primary-dark h-[36px] focus:outline-none hover:bg-btn-quinary-light font-medium rounded text-sm px-5 mr-1 rtl:ml-1"
              type="button"
            >
              {heroSection.button}
            </Button>
          </div>
          {/* </form> */}
        </div>
        {/* desktop search box end*/}

        {/* mobile search box start */}
        <div
          className={` mobile:order-3  ${
            stickyHeaderWithSearchBox && '!fixed top-[69px] bg-bg-secondary-light dark:bg-bg-secondary-dark'
          } z-10  z-49 sticky top-[69px] ${windowScroll > 130 ? '!fixed top-[69px] mobile:px-4' : ''} ${
            !(windowScroll > 130) ? 'max-w-[1083px]' : 'w-full  bg-bg-secondary-light dark:bg-bg-primary-dark'
          } mobile:inline-block ${
            windowWidth >= 639 && 'hidden'
          } mx-5 relative w-full max-w-[638px] transition-all duration-300 ease-in-out`}
        >
          <button
            className={`relative  ${
              stickyHeaderWithSearchBox && 'hidden'
            } bg-bg-tertiary-light w-full hover:bg-bg-tertiary-light rounded-lg h-[42px] mobile:mt-0 mt-3 flex items-center `}
            onClick={() => setSearchItemAndUserDrower(!searchItemAndUserDrower)}
          >
            <Image
              width={14}
              height={14}
              className="absolute mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3"
              src={IMAGES.LOCATION_ICON_BLACK}
              loader={gumletLoader}
              alt="location-icon"
            />
            <span className="text-base dark:text-text-secondary-dark mobile:text-sm ml-9 rtl:ml-0 rtl:mr-9 truncate">
              <HydrationGuard>{address ? address : heroSection.locationPlaceholder}</HydrationGuard>
            </span>
          </button>
          <button
            className={`relative ${
              stickyHeaderWithSearchBox && '!bg-bg-octonary-light dark:bg-bg-quinary-dark text-text-tertiary-dark '
            } bg-bg-tertiary-light w-full hover:bg-bg-tertiary-light text-text-secondary-color rounded-lg h-[42px] mobile:mb-3 mt-3 flex items-center`}
            onClick={() => setSearchItemAndUserDrower(!searchItemAndUserDrower)}
          >
            <Image
              width={14}
              height={14}
              className="absolute  mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3 "
              src={IMAGES.SEARCH_ICON_BLACK}
              loader={gumletLoader}
              alt="search-icon"
            />
            <span className="text-base text-text-denary-light ml-9 mobile:text-sm rtl:ml-0 rtl:mr-9 truncate">
              {heroSection.searchPlaceholder}
            </span>
          </button>
        </div>
        {/* mobile search box start */}

        <p
          className={`mobile:mt-2 mobile:mb-7 mobile:text-[10px] mobile:leading-4 mobile:font-medium mobile:text-center mobile:order-2 text-text-secondary-light dark:text-text-primary-dark text-base font-medium text-secondary transition-all duration-700 ease-in ${
            stickyHeaderWithSearchBox && 'hidden'
          } ${!(windowScroll > 130) ? '' : 'hidden'}`}
        >
          {heroSection.popularSearch}
        </p>
      </div>

      {/* mobile screen DROWER */}
      <SearchUserAndCategoryDrower
        className={`sm:hidden mobile:inline-block ${searchItemAndUserDrower && '!hidden'}`}
        searchItemAndUserDrower={searchItemAndUserDrower}
        setSearchItemAndUserDrower={setSearchItemAndUserDrower}
        handleGetLocationHelper={handleGetLocationHelper}
        handleRemoveLocationHelper={handleRemoveLocationHelper}
        address={address}
        handleOnChange={handleOnChange}
        placesService={placesService}
        placePredictions={placePredictions}
        getPlacePredictions={getPlacePredictions}
        selectedAddressFromLocationBox={selectedAddressFromLocationBox}
        formData={formData}
        setFormData={setFormData}
        products={products}
        handleOptionSelect={handleOptionSelect}
        selectedOption={selectedOption}
      />
    </HydrationGuard>
  );
};

export default SearchBox;

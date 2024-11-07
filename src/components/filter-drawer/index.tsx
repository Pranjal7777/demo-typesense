import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import Button, { BUTTON_TYPE_CLASSES } from '../ui/button';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import { gumletLoader } from '@/lib/gumlet';
import RightArrowSVG from '../../../public/images/subcategorypage/filter/right-arrow-svg';
import { useTheme } from '@/hooks/theme';
import TypeCard from '../ui/type-card/type-card';
import ConditionCard from '../ui/conditions-card/condition-card';
import { FormDropdown } from '../form/form-dropdown';
import { countries } from '@/helper/countries-list';
import { GOOGLE_MAPS_KEY } from '@/config';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { useTranslation } from 'next-i18next';
import { heroSection } from '../search-box/search-user-and-category-drower';
import LocationTargetIcon from '../../../public/assets/svg/location-target-icon';
import { getLocationName, getUserLocation } from '@/helper/get-location';
import CategoriesDrawer from '../categories-drawer';
// import DistanceRangeInput from '../u-i/distance-range-input';
import TextWrapper from '../ui/text-wrapper';
import FilterTab from '../ui/filter-tab';
import PriceTab from '../ui/price-tab';
import CustomRangeInput from '../ui/custom-range-input';

type SortingParam = {
  id: number;
  label: string;
  buttonType: 'primary' | 'tertiary';
};

type PostedWithinTypes = {
  id: number;
  label: string;
  buttonType: 'primary' | 'tertiary';
};

export type filterTypes = {
  type: string;
  condition: string;
  postedWithin: string;
  zipcode: string;
  pendingOffer: string;
  price: string;
  distance: string;
  address: string;
};

type FilterDrawerProps = {
  filtersDrawer: boolean;
  closeFilter: () => void;
  changeItems: (_item: {}) => void;
  selectedItemsFromFilterSection: filterTypes;
  setSelectedItemsFromFilterSection: React.Dispatch<React.SetStateAction<filterTypes>>;
  addFiltersToQuery: (_item: filterTypes) => void;
};

type pendingOffersTypes = {
  id: number;
  label: string;
};

//  Data
const pendingOffersData = [{ id: 1, label: 'Pending Offer' }];

const typeData = [
  {
    id: 1,
    label: 'All',
  },
  {
    id: 2,
    label: 'Buy Now',
  },
  {
    id: 3,
    label: 'Make Offer',
  },
  {
    id: 4,
    label: 'Trades',
  },
];

const postedWithinData: PostedWithinTypes[] = [
  { id: 1, label: 'All Listings', buttonType: 'tertiary' },
  { id: 2, label: 'Last 24 Hours', buttonType: 'tertiary' },
  { id: 3, label: 'Last 7 days', buttonType: 'tertiary' },
  { id: 4, label: 'Last 30 days', buttonType: 'tertiary' },
  { id: 5, label: 'Last 6 Months', buttonType: 'tertiary' },
];

const conditionData = [
  {
    id: 1,
    label: 'All',
  },
  {
    id: 2,
    label: 'New',
  },
  {
    id: 3,
    label: 'Used',
  },
];

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filtersDrawer,
  closeFilter,
  changeItems,
  selectedItemsFromFilterSection,
  setSelectedItemsFromFilterSection,
  addFiltersToQuery,
}) => {
  const { theme } = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<filterTypes>({
    type: '',
    condition: '',
    postedWithin: '',
    zipcode: '',
    pendingOffer: '',
    price: '',
    distance: '',
    address: '',
  });

  const [sortingParams, setSortingParams] = useState<SortingParam[]>([
    { id: 1, label: 'Newest First', buttonType: 'tertiary' },
    { id: 2, label: 'Oldest First', buttonType: 'tertiary' },
    { id: 3, label: 'Distance', buttonType: 'tertiary' },
    { id: 4, label: 'Price: Low To High', buttonType: 'tertiary' },
    { id: 5, label: 'Price: High To Low', buttonType: 'tertiary' },
  ]);
  const [pendingOffers] = useState<pendingOffersTypes[]>(pendingOffersData);
  const [types] = useState<pendingOffersTypes[]>(typeData);
  const [conditions] = useState<pendingOffersTypes[]>(conditionData);
  const [postedWithins, setPostedWithins] = useState<PostedWithinTypes[]>(postedWithinData);
  const [isSearchCategoriesDrower, setIsSearchCategoriesDrower] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(2500);
  const [maxPrice, setMaxPrice] = useState<number>(7500);
  const [inputFocus, setInputFocus] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [isAutoCompleteLocationBoxOpen, setIsAutoCompleteLocationBoxOpen] = useState(false);
  const { placesService, placePredictions } = usePlacesService({
    apiKey: GOOGLE_MAPS_KEY,
  });
  const { setUpdateLocationDispatch, setMyLocationDispatch } = useActions();
  const { t } = useTranslation('common');
  const heroSection: heroSection = t('page.header.heroSection', { returnObjects: true });
  const address = useAppSelector((state) => state.auth.myLocation?.address);
  const [formData, setFormData] = useState({
    location: '',
    address: '',
  });
  const [zipCode, setZipCode] = useState('');

  const toggleButtonType = (itemId: number) => {
    setSortingParams((prevParams) =>
      prevParams.map((param) =>
        param.id === itemId ? { ...param, buttonType: 'primary' } : { ...param, buttonType: 'tertiary' }
      )
    );
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'input-min') {
      setMinPrice(parseInt(value));
      setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
    } else if (name === 'input-max') {
      setMaxPrice(parseInt(value));
      setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
    }
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'range-min') {
      setMinPrice(parseInt(value));
      setInputFocus('min');
      setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
    } else if (name === 'range-max') {
      setMaxPrice(parseInt(value));
      setInputFocus('max');
      setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${maxPrice}` });
    }
  };

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const selectedAddressFromLocationBox = (key: number) => {
    setIsAutoCompleteLocationBoxOpen(false);

    placesService?.getDetails(
      {
        placeId: placePredictions[key].place_id,
      },
      (placeDetails) => {
        /* this commented code is needed for eslint */
        // eslint-disable-next-line
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: placeDetails!.formatted_address }, (results, status) => {
          // @ts-ignore: Object is possibly 'null'.
          if (status === 'OK' && results[0]) {
            // @ts-ignore: Object is possibly 'null'.
            const { lat, lng } = results[0]!.geometry.location;
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
          } else {
            console.error('Geocode was not successful for the following reason:', status);
          }
        });
      }
    );
  };

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
      setSelectedFilters({ ...selectedFilters, address: data.address });
      setUpdateLocationDispatch(data);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && formData.location.length === 1) {
      setIsAutoCompleteLocationBoxOpen(false);
    }
  };

  const handleGetLocationHelper = useCallback(async () => {
    try {
      const getLocation = await getUserLocation();
      if (getLocation) {
        try {
          const placeName = await getLocationName(getLocation.latitude, getLocation.longitude);
          setMyLocationDispatch({
            address: String(placeName.address),
            latitude: String(getLocation.latitude),
            longitude: String(getLocation.longitude),
            city: String(placeName.city),
            country: String(placeName.country),
          });
          setSelectedFilters({ ...selectedFilters, address: placeName.city });
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.error('Error retrieving user location:', error);
    }
  }, [setMyLocationDispatch]);

  const changMenu = () => {
    setIsSearchCategoriesDrower(!isSearchCategoriesDrower);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleSubmit = () => {
    setSelectedFilters({ ...selectedFilters, zipcode: zipCode });
  };

  const handleClearLocations = () => {
    setFormData({ ...formData, address: '', location: '' });
    setMyLocationDispatch({
      address: '',
      latitude: '',
      longitude: '',
      city: '',
      country: '',
    });
  };

  const handleReset = () => {
    setMaxPrice(7500);
    setMinPrice(2500);
    setPostedWithins((prevParams) => prevParams.map((param) => (param = { ...param, buttonType: 'tertiary' })));
    setSelectedFilters({
      type: '',
      condition: '',
      postedWithin: '',
      zipcode: '',
      pendingOffer: '',
      price: '',
      distance: '',
      address: '',
    });
    setInputFocus('');
    setZipCode('');
    handleClearLocations();
  };

  const handleFilterClick = (filterType: keyof filterTypes, label: string) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType] === label ? '' : label,
    }));
  };

  const handleDistance = (value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      distance: value === 'Country' || value === 'World' ? value : `distance ${value} km`,
    });
  };

  const toggleButtonTypePosted = (itemId: number) => {
    setPostedWithins((prevParams) =>
      prevParams.map((param) => {
        return param.id === itemId ? { ...param, buttonType: 'primary' } : { ...param, buttonType: 'tertiary' };
      })
    );
  };

  const handlePostedWithinClick = (label: string, id: number) => {
    const selectedItem = postedWithins.find((param) => param.id === id && param.buttonType === 'primary');

    if (selectedItem) {
      setSelectedFilters({ ...selectedFilters, postedWithin: '' });
      toggleButtonTypePosted(0);
    } else {
      toggleButtonTypePosted(id);
      setSelectedFilters({ ...selectedFilters, postedWithin: label });
    }
  };

  const handleApplyFilters = () => {
    setSelectedItemsFromFilterSection({ ...selectedFilters });
    closeFilter();
    addFiltersToQuery(selectedFilters);
  };

  useEffect(() => {
    setSelectedFilters({ ...selectedItemsFromFilterSection });

    if (!selectedFilters?.postedWithin) {
      setPostedWithins((prevParams) => prevParams.map((param) => (param = { ...param, buttonType: 'tertiary' })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersDrawer, selectedItemsFromFilterSection]);

  return (
    <>
      <CategoriesDrawer isSearchCategoriesDrower={isSearchCategoriesDrower} changMenu={changMenu} />
      <div className={`${filtersDrawer ? 'block' : 'hidden'}`}>
        <div
          className={`z-50 mobile:hidden transition-opacity ease-in duration-200 ${
            !filtersDrawer ? 'opacity-0 pointer-events-none hidden' : 'opacity-100 inline-block'
          } fixed w-full h-full right-0`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={closeFilter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              closeFilter();
            }
          }}
        ></div>

        <div
          className={`z-50 fixed h-full right-0 top-0 bottom-0 overflow-y-scroll dark:bg-bg-nonary-dark bg-bg-secondary-light text-text-primary-light dark:text-text-secondary-light lg:max-w-[35%] max-w-full transition-all ease-in duration-200  ${
            filtersDrawer ? 'w-full md:w-[40%] lg:w-[30%] opacity-100 inline-block' : 'w-0 opacity-0 hidden'
          } `}
        >
          <div className="relative">
            <div className="w-full flex md:flex-row items-center justify-between font-semibold text-2xl sticky top-0 flex-row-reverse z-10 px-5 dark:bg-[#1A1A1A] bg-bg-secondary-light md:py-6 py-5 border-b border-[#DBDBDB] dark:border-[#202020]">
              <TextWrapper className="md:text-xl md:leading-8 md:font-semibold md:text-left w-full text-center text-lg leading-7">
                Filters
              </TextWrapper>
              <Image
                width={15}
                height={15}
                className="cursor-pointer hover:scale-110 dark:md:hidden md:inline-block hidden"
                src={IMAGES.CROSS_ICON}
                alt="cross_icon"
                onClick={closeFilter}
                loader={gumletLoader}
              />
              <Image
                width={15}
                height={15}
                className="cursor-pointer hover:scale-110 md:hidden hidden dark:md:inline-block"
                src={IMAGES.CROSS_ICON_WHITE}
                alt="cross_icon"
                onClick={closeFilter}
                loader={gumletLoader}
              />
              <Image
                className="cursor-pointer hover:scale-110 dark:hidden inline-block md:hidden"
                width={15}
                height={15}
                src={IMAGES.BACK_ARROW_ICON_BLACK}
                alt="back-arrow-icon"
                onClick={closeFilter}
                loader={gumletLoader}
              />
              <Image
                className="cursor-pointer hover:scale-110 dark:inline-block dark:md:hidden hidden md:hidden"
                width={15}
                height={15}
                src={IMAGES.BACK_ARROW_ICON_WHITE}
                onClick={closeFilter}
                alt="back-arrow-icon"
                loader={gumletLoader}
              />
            </div>
            <div className="pb-5 pt-2 p-6 sticky top-0 w-full dark:bg-[#1A1A1A] bg-bg-secondary-light">
              <div className="sortby mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">Sort By</TextWrapper>
                <div className="mt-[16px] flex flex-wrap gap-2 ">
                  {sortingParams.map((item) => (
                    <Button
                      key={item.id}
                      buttonType={
                        item.buttonType === 'tertiary' ? BUTTON_TYPE_CLASSES.tertiary : BUTTON_TYPE_CLASSES.primary
                      }
                      className="w-[30%] mobile:text-[11px] text-[13px] font-normal mb-0"
                      onClick={() => toggleButtonType(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="type mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6">Type</TextWrapper>
                <div
                  className="flex justify-between items-center cursor-pointer mt-[16px] border border-[#DBDBDB] dark:border-[#3D3B45] p-[12px] w-full rounded"
                  onClick={() => changMenu()}
                  role="button"
                  tabIndex={0}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      changMenu();
                    }
                  }}
                >
                  <TextWrapper className="text-sm font-normal leading-5">Select Type</TextWrapper>
                  <RightArrowSVG primaryColor={theme ? '#fff' : '#000'} />
                </div>
              </div>
              <div className="pendingoffers mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6">Pending Offers</TextWrapper>
                {pendingOffers?.map((offer: { id: number; label: string }) => (
                  <FilterTab
                    key={offer.id}
                    className={`backdrop:text-[13px] mobile:text-[11px] ${
                      selectedFilters.pendingOffer === offer.label ? ' !border-[#6D3EC1]  bg-[#6D3EC10D]' : ''
                    } mt-[16px] w-[120px] px-[10px] py-[10px] font-normal`}
                    buttonType={BUTTON_TYPE_CLASSES.tertiary}
                    onClick={() => handleFilterClick('pendingOffer', offer.label)}
                    text={offer.label}
                  />
                ))}
              </div>
              <div className="price mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6">Price</TextWrapper>
                <div className="w-full mt-[14px]">
                  <div className="flex w-full gap-4 justify-between items-center">
                    <PriceTab
                      currency="USD"
                      focus="min"
                      handlePriceInputChange={handlePriceInputChange}
                      inputFocus={inputFocus}
                      price={minPrice}
                    />
                    <PriceTab
                      currency="USD"
                      focus="max"
                      handlePriceInputChange={handlePriceInputChange}
                      inputFocus={inputFocus}
                      price={maxPrice}
                    />
                  </div>
                  <div className="slider mt-[24px] h-[5px] relative bg-[#DBDBDB] dark:bg-[#242424] rounded-sm">
                    <div
                      className="progress h-full left-[25%] right-[25%] absolute rounded-sm bg-[#6D3EC1] height: 100%"
                      style={{
                        left: `${((minPrice / 10000) * 100).toFixed(2)}%`,
                        right: `${((1 - maxPrice / 10000) * 100).toFixed(2)}%`,
                      }}
                    />
                  </div>
                  <div className="range-input">
                    <input
                      type="range"
                      name="range-min"
                      className="range-min"
                      min="50"
                      max="10000"
                      value={minPrice}
                      step="100"
                      onChange={handleRangeInputChange}
                    />
                    <input
                      type="range"
                      name="range-max"
                      className="range-max"
                      min="250"
                      max="10000"
                      value={maxPrice}
                      step="100"
                      onChange={handleRangeInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="types mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">Type</TextWrapper>
                <div className="flex gap-3 flex-wrap mt-[14px] w-full">
                  {types?.map((type) => (
                    <TypeCard
                      name={type.label}
                      key={type.id}
                      isSelected={type.label === selectedFilters.type}
                      onClick={() => handleFilterClick('type', type.label)}
                    />
                  ))}
                </div>
              </div>
              <div className="condition mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">Condition</TextWrapper>
                <div className="flex gap-2 w-full overflow-x-scroll mt-[12px]">
                  {conditions?.map((condition) => (
                    <ConditionCard
                      name={condition.label}
                      key={condition.id}
                      isSelected={condition.label === selectedFilters.condition}
                      onClick={() => handleFilterClick('condition', condition.label)}
                    />
                  ))}
                </div>
              </div>
              <div className="location mt-[24px]">
                <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">Location</TextWrapper>
                <div className="country flex flex-col mt-[12px]">
                  <span className="text-sm font-medium">Country</span>
                  <FormDropdown
                    required={true}
                    label=""
                    options={countries.data}
                    selectedValue={selectedCountry}
                    onSelect={(e) => {
                      handleCountryChange(e);
                      changeItems({ country: selectedCountry });
                    }}
                    id="country-selector"
                    name="country"
                    className="rounded"
                  />
                </div>
                <div className="location flex flex-col h-[86px] mt-[12px]">
                  <span className="text-sm font-medium">Location</span>
                  <div className="relative w-full mt-2 items-center flex border border-[#DBDBDB] dark:border-[#3D3B45] h-[45px] justify-center rounded">
                    <Image
                      width={17}
                      height={17}
                      className="absolute left-3"
                      src={IMAGES.LOCATION_ICON_BLACK}
                      loader={gumletLoader}
                      alt="location-icon"
                    />

                    <input
                      className={
                        'truncate h-full mr-12 text-sm bg-transparent w-[65%] dark:text-white placeholder-text-denary-light '
                      }
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
                              <div className="ml-4">
                                <Image
                                  className="border-error max-w-[14px] max-h-[18px]"
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
                          onClick={handleClearLocations}
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
                          onClick={handleClearLocations}
                        />
                      </>
                    ) : (
                      <>
                        <LocationTargetIcon
                          width={'20'}
                          height={'20'}
                          className={
                            ' absolute right-3 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 '
                          }
                          color="var(--brand-color)"
                          onClick={handleGetLocationHelper}
                        />
                      </>
                    )}
                  </div>
                </div>
                <TextWrapper className="text-center text-sm md:text-base">{'Or'}</TextWrapper>
                <div className="zipcode flex flex-col h-[86px] mt-[12px]">
                  <span className="text-sm font-semibold">Enter ZIP/Postal Code</span>
                  <div className="flex mt-2 border dark:border-[#3D3B45] rounded h-[45px] overflow-hidden">
                    <input
                      type="number"
                      className="w-[100%] h-full bg-transparent p-4"
                      value={zipCode}
                      onChange={handleInputChange}
                    />
                    <Button
                      buttonType={BUTTON_TYPE_CLASSES.primary}
                      className="w-[150px] text-sm md:text-base rounded-tl-none rounded-bl-none rounded-tr-[4px] rounded-br-[4px]"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                <div className="distance mt-[12px]">
                  <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">
                    Distance (mi)
                  </TextWrapper>
                  {/* <DistanceRangeInput onMouseDown={() => {}} onTouchStart={() => {}} /> */}
                  <CustomRangeInput
                    handleDistance={handleDistance}
                    presentValue={selectedFilters.distance.split(' ')[1]}
                  />
                </div>
              </div>
              <div className="postedwithin mt-[30px] pb-24">
                <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">
                  Posted Within
                </TextWrapper>
                <div className="mt-[16px] flex flex-wrap gap-2 ">
                  {postedWithins?.map((post) => (
                    <Button
                      key={post.id}
                      buttonType={
                        post.buttonType === 'tertiary' ? BUTTON_TYPE_CLASSES.tertiary : BUTTON_TYPE_CLASSES.primary
                      }
                      className="w-[30%] text-[13px] mobile:text-[11px] font-thin mb-0"
                      onClick={() => handlePostedWithinClick(post.label, post.id)}
                    >
                      {post.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky z-[999] bottom-0 flex gap-2 items-center mx-auto px-3 w-full h-[80px] dark:bg-[#1A1A1A] bg-bg-secondary-light">
              <Button
                buttonType="secondary"
                className="py-3 px-14 md:px-9 text-base !text-[#6D3EC1] !border-[#6D3EC1] bg-bg-secondary-light dark:bg-[#1A1A1A]"
                style={{ border: '1px solid' }}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button buttonType="primary" className="py-3 px-14 md:px-9 text-base" onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          input:focus {
            border: none;
            outline: none;
          }
          .range-input {
            position: relative;
          }
          .range-input input {
            position: absolute;
            width: 100%;
            height: 5px;
            top: -5px;
            background: none;
            pointer-events: none;
            -webkit-appearance: none;
            -moz-appearance: none;
          }
          input[type='range']::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #6d3ec1;
            pointer-events: auto;
            -webkit-appearance: none;
            cursor: pointer;
          }
          input[type='range']::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border: none;
            border-radius: 50%;
            background: #6d3ec1;
            pointer-events: auto;
            -moz-appearance: none;
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

export default FilterDrawer;

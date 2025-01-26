import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState, useMemo, useRef } from 'react';
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
import TextWrapper from '../ui/text-wrapper';
import PriceTab from '../ui/price-tab';
import CustomRangeInput from '../ui/custom-range-input';
import { FilterParameter, FilterParameterResponse } from '@/types/filter';
import CrossIconWhite from '../../../public/images/cross_icon_white.svg';
import CrossIcon from '../../../public/images/cross-icon.svg';
import MyLocationIcon from '../../../public/images/location-icon.svg';
import { useDebounce } from '@/hooks/use-debounce';
import SelectCategoryDrawer from '../categories-drawer/select-category-drawer';
import { categories } from '@/store/types';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { toggleScrollLock } from '@/utils/scroll-lock';

export type filterTypes = {
  type: string;
  condition: string;
  postedWithin: string;
  zipcode: string;
  pendingOffer: string;
  price: string | { min: number; max: number };
  distance: string;
  address: string;
  category: { title: string; _id: string };
  latitude:string,
  longitude:string,
  country:string,
  sort:string
};

type FilterDrawerProps = {
  filtersDrawer: boolean;
  closeFilter: () => void;
  changeItems: (_item: {}) => void;
  selectedItemsFromFilterSection: filterTypes;
  setSelectedItemsFromFilterSection: React.Dispatch<React.SetStateAction<filterTypes>>;
  addFiltersToQuery: (_item: filterTypes) => void;
  updateFilters: (_item: any) => void;
  filterParameters: FilterParameterResponse;
};

type pendingOffersTypes = {
  id: number;
  label: string;
};

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


const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filtersDrawer,
  closeFilter,
  changeItems,
  selectedItemsFromFilterSection,
  setSelectedItemsFromFilterSection,
  addFiltersToQuery,
  updateFilters,
  filterParameters
}) => {
  
  const { theme } = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<filterTypes>({
    category: { title: '', _id: '' },
    type: '',
    condition: '',
    postedWithin: '',
    zipcode: '',
    pendingOffer: '',
    price: '',
    distance: '',
    address: '',
    latitude:'',
    longitude:'',
    country:'',
    sort:''
  });
  const searchParams = useSearchParams();

  const [types] = useState<pendingOffersTypes[]>(typeData);
  const [isSearchCategoriesDrower, setIsSearchCategoriesDrower] = useState(false);

  const [inputFocus, setInputFocus] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'India');
  const [isAutoCompleteLocationBoxOpen, setIsAutoCompleteLocationBoxOpen] = useState(false);
  const { placesService, placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: GOOGLE_MAPS_KEY,
  });
  const { setUpdateLocationDispatch, setMyLocationDispatch } = useActions();
  const { t } = useTranslation('common');
  const heroSection = t('page.header.heroSection', { returnObjects: true }) as heroSection;
  const address = useAppSelector((state) => state.auth.myLocation?.address);
  const [zipCode, setZipCode] = useState('');
  const [formData, setFormData] = useState({
    location: searchParams.get('address') || '',
    selectedLocation: searchParams.get('address') ? true : false,
    address: '',
  });
  const [selectedLocationFromBox, setSelectedLocationFromBox] = useState(searchParams.get('address') || '');
  console.log(selectedLocationFromBox, 'selectedLocationFromBox');
  
  const priceFilter = filterParameters?.data.filters.find((f) => f.typeCode === 3);
  const initialMinPrice = priceFilter?.data?.[0]?.minPrice ?? 2500;
  const initialMaxPrice = priceFilter?.data?.[0]?.maxPrice ?? 7500;
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const filterRef = useRef<HTMLDivElement>(null);
  const [rangeValue, setRangeValue] = useState<number>(8);


  useEffect(() => {
    if (priceFilter?.data?.[0]) {
      setMinPrice(priceFilter.data[0].minPrice ?? initialMinPrice);
      setMaxPrice(priceFilter.data[0].maxPrice ?? initialMaxPrice);
    }
  }, [filterParameters]);

  const debouncedLocationSearchTerm: string = useDebounce(formData.location, 200);

  useEffect(() => {
    if (debouncedLocationSearchTerm.length > 2 && !formData.selectedLocation) {
      getPlacePredictions({ input: debouncedLocationSearchTerm });
    }
  }, [debouncedLocationSearchTerm]);

  useEffect(() => {
    if (placePredictions.length) setIsAutoCompleteLocationBoxOpen(true);
  }, [placePredictions]);

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
      setSelectedFilters({ ...selectedFilters, price: `$${parseInt(value)} - $${maxPrice}` });
    } else if (name === 'range-max') {
      setMaxPrice(parseInt(value));
      setInputFocus('max');
      setSelectedFilters({ ...selectedFilters, price: `$${minPrice} - $${parseInt(value)}` });
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
            setSelectedLocationFromBox(placeDetails?.formatted_address || '');
            setTimeout(() => setIsAutoCompleteLocationBoxOpen(false), 0);
            setSelectedFilters((prev) => ({ ...prev, address: data.address }));
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
      selectedLocation: false,
      ['location']: value,
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
          setSelectedLocationFromBox(placeName.city);
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

  const handleSubmit = async () => {
    if (!zipCode) return;

    try {
      // @ts-ignore: Google maps types
      const geocoder = new google.maps.Geocoder();

      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: zipCode }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Invalid ZIP code'));
          }
        });
      });

      // @ts-ignore: Response typing
      const { lat, lng } = response.geometry.location;
      const latitude = lat();
      const longitude = lng();

      // @ts-ignore: Response typing
      const formattedAddress = response.formatted_address;

      const data = {
        address: formattedAddress,
        city: '',
        country: '',
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      };

      setMyLocationDispatch(data);
      // setFormData(prev => ({ ...prev, location: formattedAddress }))
      setSelectedLocationFromBox(formattedAddress);
      setSelectedFilters((prev) => ({
        ...prev,
        // zipcode: zipCode,
        address: formattedAddress,
      }));
      setTimeout(() => setIsAutoCompleteLocationBoxOpen(false), 0);
    } catch (error) {
      console.error('Error validating ZIP code:', error);
      toast.error('Please enter a valid ZIP code');
      setZipCode('');
    }
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
    setSelectedFilters((prev) => ({ ...prev, address: '' }));
    setSelectedLocationFromBox('');
  };
  const handleReset = () => {
    setMaxPrice(initialMaxPrice);
    setMinPrice(initialMinPrice);
    let initialData = {
      type: '',
      condition: '',
      postedWithin: '',
      zipcode: '',
      pendingOffer: '',
      price: '',
      distance: 'Country',
      address: '',
      category: { title: '', _id: '' },
      latitude:'',
      longitude:'',
      country:'India',
      sort:''
    };
    setSelectedFilters(initialData);
    setInputFocus('');
    setZipCode('');
    handleClearLocations();
    setRangeValue(0);
  };

  const handleFilterClick = (filterType: keyof filterTypes, label: string) => {
    console.log(filterType, label, 'filterType, label');
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType] === label ? '' : label,
    }));
  };

  const handleDistance = (value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      distance: value === 'Country' || value === 'World' ? value : value,
    });
  };

  const handleApplyFilters = () => {
    let filters = { ...selectedFilters };
    if (selectedLocationFromBox?.length) {
      filters.address = selectedLocationFromBox;
    }
    setSelectedItemsFromFilterSection({ ...selectedFilters });
    closeFilter();

    const cleanFilters = {
      ...selectedFilters,
      category: { title: selectedFilters.category?.title || '', _id: selectedFilters.category?._id || '' },
    };
    addFiltersToQuery(cleanFilters);

    const selectedFiltersData = { ...cleanFilters };
    if (selectedFiltersData.price && typeof selectedFiltersData.price === 'string') {
      const [min, max] = selectedFiltersData.price.replace(/\$/g, '').split(' - ');
      selectedFiltersData.price = {
        min: parseInt(min),
        max: parseInt(max),
      };
    }
    updateFilters(selectedFiltersData);
    setFormData({
      location: '',
      address: '',
      selectedLocation: false,
    });
    setZipCode('');
  };

  useEffect(() => {
    setSelectedFilters({ ...selectedItemsFromFilterSection });

    // Handle price initialization from query
    if (selectedItemsFromFilterSection.price) {
      const priceString = selectedItemsFromFilterSection.price;
      if (typeof priceString === 'string') {
        const [min, max] = priceString.replace(/\$/g, '').split(' - ').map(Number);
        setMinPrice(min);
        setMaxPrice(max);
      }
    } else {
      setMinPrice(initialMinPrice);
      setMaxPrice(initialMaxPrice);
    }
  }, [filtersDrawer, selectedItemsFromFilterSection]);

  const renderFilterSection = (filter: FilterParameter) => {
    switch (filter.typeCode) {
      // case 6: // Category type
      //   return (
      //     <div className="type">
      //       <TextWrapper className="text-base font-semibold leading-6">Category Type</TextWrapper>
      //       <div
      //         className="flex justify-between items-center cursor-pointer mt-[16px] border border-[#DBDBDB] dark:border-[#3D3B45] p-[12px] w-full rounded"
      //         onClick={() => changMenu()}
      //         role="button"
      //         tabIndex={0}
      //         onKeyUp={(e) => {
      //           if (e.key === 'Enter' || e.key === ' ') {
      //             e.preventDefault();
      //             changMenu();
      //           }
      //         }}
      //       >
      //         <TextWrapper className="text-sm font-normal leading-5">
      //           {' '}
      //           {selectedFilters?.category?.title ? selectedFilters?.category?.title : 'Select Type'}
      //         </TextWrapper>
      //         <RightArrowSVG primaryColor={theme ? '#fff' : '#000'} />
      //       </div>
      //     </div>
      //   );

      case 3: // Price
        return (
          <div className="price mt-[24px]">
            <TextWrapper className="text-base font-semibold leading-6">{filter.name}</TextWrapper>
            <div className="w-full mt-[14px]">
              <div className="flex w-full gap-4 justify-between items-center">
                <PriceTab
                  currency={filter.currencySymbol || 'USD'}
                  focus="min"
                  handlePriceInputChange={handlePriceInputChange}
                  inputFocus={inputFocus}
                  price={minPrice}
                />
                <PriceTab
                  currency={filter.currencySymbol || 'USD'}
                  focus="max"
                  handlePriceInputChange={handlePriceInputChange}
                  inputFocus={inputFocus}
                  price={maxPrice}
                />
              </div>
              <div className="slider mt-[24px] h-[5px] relative bg-[#DBDBDB] dark:bg-[#242424] rounded-sm">
                <div
                  className="progress h-full absolute rounded-sm bg-brand-color"
                  style={{
                    left: `${((minPrice / initialMaxPrice) * 100).toFixed(2)}%`,
                    right: `${(100 - (maxPrice / initialMaxPrice) * 100).toFixed(2)}%`,
                  }}
                />
              </div>
              <div className="range-input">
                <input
                  type="range"
                  name="range-min"
                  className="range-min"
                  min={initialMinPrice}
                  max={initialMaxPrice}
                  value={minPrice}
                  step={(initialMaxPrice - initialMinPrice) / 100}
                  onChange={handleRangeInputChange}
                />
                <input
                  type="range"
                  name="range-max"
                  className="range-max"
                  min={initialMinPrice}
                  max={initialMaxPrice}
                  value={maxPrice}
                  step={(initialMaxPrice - initialMinPrice) / 100}
                  onChange={handleRangeInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 19: // Type
        return (
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
        );

      case 20: // Condition
        return (
          <div className="condition mt-[24px]">
            <TextWrapper className="text-base font-semibold leading-6 text-bg-primary-light">Condition</TextWrapper>
            <div className="flex gap-2 w-full overflow-x-scroll mt-[12px]">
              {filter.data?.map((condition) => (
                <ConditionCard
                  name={condition.name}
                  key={condition.value}
                  isSelected={condition.value === selectedFilters.condition}
                  onClick={() => handleFilterClick('condition', condition.name)}
                />
              ))}
            </div>
          </div>
        );
      case 7: // Location
        return (
          <>
            <div className="location mt-[24px] mobile:pb-[100px]">
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
                    changeItems({ country: e.target.value });
                  }}
                  id="country-selector"
                  name="country"
                  className="rounded"
                />
              </div>
              <div className="location flex flex-col h-[86px] mt-[12px]">
                <span className="text-sm font-medium">Location</span>
                <div className="relative w-full mt-2 items-center gap-1 px-4 flex border border-[#DBDBDB] dark:border-[#3D3B45] h-[45px] rounded">
                  <Image
                    width={17}
                    height={17}
                    className=""
                    // src={IMAGES.LOCATION_ICON_BLACK}
                    // loader={gumletLoader}
                    src={MyLocationIcon}
                    alt="location-icon"
                  />

                  <input
                    className={
                      'truncate h-full mr-12 text-sm bg-transparent w-[65%] dark:text-white placeholder-text-denary-light '
                    }
                    placeholder={heroSection?.searchPlace?.placeholder}
                    autoComplete="off"
                    value={selectedLocationFromBox}
                    onChange={(e) => {
                      setSelectedLocationFromBox(e.target.value);
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
                                // src={IMAGES.LOCATION_ICON_BLACK}
                                // loader={gumletLoader}
                                src={MyLocationIcon}
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
                        // src={IMAGES.CROSS_ICON}
                        src={CrossIcon}
                        alt="location-target-icon"
                        // loader={gumletLoader}
                        onClick={handleClearLocations}
                      />
                      <Image
                        width={17}
                        height={17}
                        className={
                          'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105 dark:inline hidden'
                        }
                        // src={IMAGES.CROSS_ICON_WHITE}
                        src={CrossIconWhite}
                        alt="location-target-icon"
                        // loader={gumletLoader}
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
                <CustomRangeInput 
                  handleDistance={handleDistance} 
                  presentValue={selectedFilters.distance}
                  value={rangeValue}
                  setValue={setRangeValue}
                />
              </div>
            </div>
          </>
        );
    }
  };

  const handleSelectCategory = (category: categories) => {
    setSelectedFilters({ ...selectedFilters, category: { title: String(category.title), _id: String(category._id) } });
  };

  useEffect(() => {
    toggleScrollLock(filtersDrawer);

    return () => {
      toggleScrollLock(false);
    };
  }, [filtersDrawer]);

  return (
    <>
      <SelectCategoryDrawer
        filterParameters={filterParameters}
        isSearchCategoriesDrower={isSearchCategoriesDrower}
        changMenu={changMenu}
        handleSelectCategory={handleSelectCategory}
      />
      <div className={`${filtersDrawer ? 'block' : 'hidden'}`}>
        <div
          ref={filterRef}
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
          className={`z-50 fixed w-full h-full max-w-[460px] right-0 top-0 bottom-0 overflow-y-scroll dark:bg-bg-nonary-dark bg-bg-secondary-light text-text-primary-light dark:text-text-secondary-light lg:max-w-[35%]  transition-all ease-in duration-200  ${
            filtersDrawer ? 'w-full max-w-[460px] opacity-100 inline-block' : 'w-0 opacity-0 hidden'
          } `}
        >
          <div className="relative h-screen flex flex-col">
            <div className="w-full flex md:flex-row items-center justify-between font-semibold text-2xl sticky top-0 flex-row-reverse z-10 px-5 dark:bg-[#1A1A1A] bg-bg-secondary-light md:py-6 py-5 border-b border-[#DBDBDB] dark:border-[#202020]">
              <TextWrapper className="md:text-xl md:leading-8 md:font-semibold md:text-left w-full text-center text-lg leading-7">
                Filters
              </TextWrapper>
              <Image
                width={15}
                height={15}
                className="cursor-pointer hover:scale-110 dark:md:hidden md:inline-block hidden"
                // src={IMAGES.CROSS_ICON}
                alt="cross_icon"
                onClick={closeFilter}
                // loader={gumletLoader}
                src={CrossIcon}
              />
              <Image
                width={15}
                height={15}
                className="cursor-pointer hover:scale-110 md:hidden hidden dark:md:inline-block"
                // src={IMAGES.CROSS_ICON_WHITE}
                src={CrossIconWhite}
                alt="cross_icon"
                onClick={closeFilter}
                // loader={gumletLoader}
              />
              <Image
                className="cursor-pointer hover:scale-110 dark:hidden inline-block md:hidden"
                width={15}
                height={15}
                // src={IMAGES.BACK_ARROW_ICON_BLACK}
                src={CrossIcon}
                alt="back-arrow-icon"
                onClick={closeFilter}
                // loader={gumletLoader}
              />
              <Image
                className="cursor-pointer hover:scale-110 dark:inline-block dark:md:hidden hidden md:hidden"
                width={15}
                height={15}
                // src={IMAGES.BACK_ARROW_ICON_WHITE}
                src={CrossIconWhite}
                onClick={closeFilter}
                alt="back-arrow-icon"
                // loader={gumletLoader}
              />
            </div>
            <div className=" flex-1 overflow-y-scroll pt-2 p-6 sticky top-0 w-full dark:bg-[#1A1A1A] bg-bg-secondary-light">
              {/* dyanamic filter section */}
              {filterParameters?.data.filters.map((filter, index) => (
                <React.Fragment key={index}>{renderFilterSection(filter)}</React.Fragment>
              ))}
            </div>
            <div className="sticky z-[999] bottom-0 flex gap-2 items-center mx-auto px-3 w-full h-[80px] dark:bg-[#1A1A1A] bg-bg-secondary-light">
              <Button
                buttonType="secondary"
                className="py-3 px-14 md:px-9 text-base !text-brand-color !border-brand-color bg-bg-secondary-light dark:bg-[#1A1A1A]"
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

      <style global jsx>
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
            background: var(--brand-color);
            pointer-events: auto;
            -webkit-appearance: none;
            cursor: pointer;
          }
          input[type='range']::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border: none;
            border-radius: 50%;
            background: var(--brand-color);
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

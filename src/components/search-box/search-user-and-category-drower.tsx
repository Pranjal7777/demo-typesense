import React, { ChangeEvent, FC, useEffect, useState } from 'react';
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
import LocationSvg from '../../../public/assets/svg/location';
import LeftArrowRoundedEdgeIcon from '../../../public/assets/svg/left-arrow-rounded-edge';
import { routeSellerProfile, routeToCategories } from '@/store/utils/route-helper';
import keyDownHandler from '@/helper/key-down-handler';
import { useRouter } from 'next/router';

interface PlacePredictions {
  place_id: string;
  description: string;
}

export type Props = {
  isPlacePredictionsLoading?: boolean;
  isSearchProductsAndUsersFetching?: boolean;
  className: string;
  searchItemAndUserDrower: boolean;
  setSearchItemAndUserDrower: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<{ search: string; location: string }>>;
  handleGetLocationHelper: () => Promise<boolean>;
  handleRemoveLocationHelper: () => void;
  handleOnChange: (_e: ChangeEvent<HTMLInputElement>) => void;
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
}) => {
  // please do not remove this -> this code is for translation of this page
  // const { t } = useTranslation('common');
  //   const heroSection:heroSection = t('page.header.heroSection', { returnObjects: true });
  const { myLocation } = useAppSelector((state: RootState) => state.auth);

  const {theme}=useTheme();
  const router = useRouter();
  const [isUserOrItem, setIsUserOrItem] = useState(true);
  const [isLocationTextBoxFocused, setIsLocationTextBoxFocused] = useState(true);
  
  // please do not remove this -> this code is for removing user location form redux 
  // const removeLocation = () => {
  //   handleRemoveLocationHelper();
  //   setIsLocationTextBoxFocused(false);
  // };
  const removeUserAndItem = () => {
    setFormData((prevState) => ({
      ...prevState,
      search: '',
    }));
  };

  const clearLocationFromLocationSearchBox=()=>{
    setFormData({ ...formData, location: '' });
    // handleRemoveLocationHelper()
  };

  const fetchCurrentLocation=async()=>{
    const isLocationUpdated=await handleGetLocationHelper(); 
    if(!isLocationUpdated){
      formData.location==='' && setFormData({ ...formData, location: myLocation.address });
    }
  };

  const categoryRoute=(categoryId:string)=>{
    router.push(routeToCategories({category:{id:categoryId}}));
    setSearchItemAndUserDrower(!searchItemAndUserDrower);
  };
  const sellerProfileRoute=(userId:string)=>{
    router.push(routeSellerProfile(userId));
    setSearchItemAndUserDrower(!searchItemAndUserDrower);
  };

  useEffect(() => {
    setFormData({ ...formData, location: myLocation?.address });
  }, [myLocation,myLocation?.address]);

  return (
    <div
      className={appClsx(
        'z-[10] h-full overflow-y-scroll fixed flex-col dark:bg-bg-primary-dark dark:text-text-primary-dark bg-bg-secondary-light inset-0 flex ',
        className
      )}
    >
      <div className="sticky top-0 py-2  bg-bg-secondary-light dark:bg-bg-primary-dark">
        <div className="relative mx-4 flex items-center justify-center my-3 transition delay-0 ease-in duration-1000">
          <LeftArrowRoundedEdgeIcon primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`} className='hover:cursor-pointer hover:scale-125 absolute left-1' onClick={() => setSearchItemAndUserDrower(!searchItemAndUserDrower)}/>
          <span className="text-lg font-bold">Search</span>
        </div>

        <div className="truncate relative mx-4 flex items-center mb-4">

          <SearchIcon width={20} height={20} primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`} className='absolute left-4 rtl:right-4'/>
          <input
            className="truncate border-border-tertiary-light dark:border-border-tertiary-dark dark:bg-bg-quinary-dark focus:border-2 focus:!border-brand-color dark:text-bg-tertiary-light px-11 rtl:px-5 pr-9 rtl:pr-12 text-sm outline-none border rounded-md h-12 w-full focus:border-primary bg-bg-tertiary-light"
            type="text"
            name="search"
            onFocus={() => setIsLocationTextBoxFocused(true)}
            value={formData.search}
            onChange={(e) => handleOnChange(e)}
          />

          <HydrationGuard>
            {formData.search !== '' ? (
              <>
                <CloseIcon width={'17'} height={'17'} className={'absolute right-4 rtl:right-[95%] cursor-pointer transition duration-75 hover:scale-105'} primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`} onClick={removeUserAndItem}/>
              </>
            ) : null}
          </HydrationGuard>
        </div>

        <div className="relative mx-4 flex items-center mb-4">
          

          <LocationSvg width={'20'} height={'20'} color={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`} className='absolute left-4 rtl:right-4'/> 
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
                <CloseIcon width={'17'} height={'17'} className={'absolute right-4 rtl:right-[95%] hover:cursor-pointer transition duration-75 hover:scale-105'} primaryColor={`${theme ? 'var(--icon-primary-dark)' : 'var( --icon-primary-light)'}`} onClick={clearLocationFromLocationSearchBox}/>
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
                handleOptionSelect('Items');
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

            <div
              className="h-[98%] w-[25%] flex flex-col items-center justify-center"
              onClick={() => {
                setIsUserOrItem(false);
                handleOptionSelect('Users');
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
            </div>
          </div>

          <div className="h-full overflow-y-scroll border-primary px-4 divide-y-2 dark:divide-border-tertiary-dark divide-border-tertiary-light">
            {isSearchProductsAndUsersFetching ? (
              <div className=" flex items-center justify-center h-[50%]">
                <Spinner />
              </div>
            ) : (
              products.length === 0 ? (
                <div className=" border-error bg-bg-secondary-light dark:bg-bg-primary-dark flex items-center h-[50%] justify-center">
                  <p className="truncate ml-3 fixed flex dark:text-text-primary-dark ">No Data Found!</p>
                </div>
              ) : (selectedOption == 'Items' ? 
                (products as SearchItems[])?.map((item, index) => (
                  <div
                    tabIndex={0}
                    role="button"
                    key={index} 
                    onClick={()=>categoryRoute(item.categoryPath[0].id as string)} 
                    onKeyDown={(e) => keyDownHandler(e, ()=>categoryRoute(item.categoryPath[0].id as string))}>
                    <SearchItemsAndCategoryCard  item={item} />
                  </div>
                )) : (products as SearchUsers[])?.map((item, index) => (
                  <div key={index} 
                    tabIndex={0}
                    role="button"
                    onClick={()=>sellerProfileRoute(item.userId)} 
                    onKeyDown={(e) => keyDownHandler(e, ()=>categoryRoute(item.userId))}
                  >
                    <SearchUserAndCategoryCard  item={item} />
                  </div>
                )))
            )}
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
              <LocationTargetIcon primaryColor={`${theme ? 'var(--brand-color)' : 'var(--brand-color)'}`}/>

              <div className=" text-xs ml-2 font-medium">Current location</div>
            </div>
            {isPlacePredictionsLoading ? (
              <div className=" flex items-center justify-center h-[50%]">
                <Spinner />
              </div>
            ) : placePredictions.length === 0 ? (
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
            <LocationTargetIcon width='20' height='20' primaryColor={`${theme ? 'var(--brand-color)' : 'var(--brand-color)'}`}/>

            <div className=" text-xs ml-2 font-medium">Current location</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUserAndCategoryDrower;

import React, { FC, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { appClsx } from '@/lib/utils';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import { RootState } from '@/store/store';
import authApi from '@/store/api-slices/auth';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';

import { getLocationName, getUserLocation } from '@/helper/get-location';

const Header = dynamic(() => import('@/components/sections/header'), { ssr: true });
const CustomHeader = dynamic(() => import('../ui/custom-header'), { ssr: true });
const HeroSection = dynamic(() => import('../sections/hero-section'), { ssr: true });
const Footer = dynamic(() => import('../sections/footer-section'), { ssr: true });
const Schema = dynamic(() => import('../html-header'), { ssr: true });

import ProgressBar from '../ui/progress-bar';

import { SchemaItem } from '@/types';
import { MyLocationFromIp } from '@/store/types/location-types';
import { ResponseGetAllCategoriesPayload, ResponseGetAllGrandParentCategoriesPayload, Token } from '@/store/types';

export type Props = {
  // content:Content,
  excludeHeader?:boolean,
  stickyHeader?:boolean,
  excludeHeroSection?:boolean,
  stickyHeroSection?:boolean,
  excludeFooter?:boolean,
  containerClass?: string,
  title?: string;
  keywords?: string;
  description?: string;
  tokenFromServer?: Token;
  categories?: ResponseGetAllGrandParentCategoriesPayload;
  categoriesWithChildCategories?: ResponseGetAllCategoriesPayload;
  myLocationFromServer?: MyLocationFromIp;
  children: React.ReactNode;
};

// Define the type for the schema object

const Layout: FC<Props> = ({
  excludeHeader=false,
  stickyHeader=false,
  excludeHeroSection=false,
  stickyHeroSection=false,
  excludeFooter=false,
  children,
  tokenFromServer,
  categories,
  categoriesWithChildCategories,
  myLocationFromServer,
  containerClass,
}) => {
  const { locale } = useRouter();
  const { token, myLocation, ipAddress } = useAppSelector((state: RootState) => state.auth);

  const { setGuestTokenDispatch, setMyCategoriesDispatch } = useActions();
  const {
    setMyLocationDispatch,
    setRemoveMyLocationDispatch,
    setMyIpAddressDispatch,
    setMyCategoriesWithChildrenDispatch,
  } = useActions();
  const [getGuestToken /*{isSuccess,isError,isLoading}*/] = authApi.useGetGuestTokenMutation();

  // #error 2 times data call

  const handleGetLocationHelper = useCallback(async () => {
    try {
      
      const getLocation = await getUserLocation();
      if(Number(myLocation.latitude)!==getLocation.latitude && Number(myLocation.longitude)!==getLocation.longitude){
        if (getLocation) {
          try {
            const placeName = await getLocationName(getLocation.latitude, getLocation.longitude);
            // setLocationName(placeName)
            setMyLocationDispatch({
              address: String(placeName.address),
              latitude: String(getLocation.latitude),
              longitude: String(getLocation.longitude),
              city: String(placeName.city),
              country: String(placeName.country),
            });
            return true;
          } catch (e) {
            console.error(e);
            return false;
          }
        }
        
      }
      return false;
    } catch (error) {
      console.error('Error retrieving user location:', error);
      return false;
    }
  }, [setMyLocationDispatch]);

  const handleRemoveLocationHelper = () => {
    setRemoveMyLocationDispatch();
  };


  // const excludeDefaultFooter = ['auth', SIGN_IN_PAGE, SIGN_UP_PAGE, 'forgotpassword', '500', 'seller-profile'];


  //in order to use 2 type of header on mentioned pages
  // const stickyHeaderWithSearchBox =
  //   // router.pathname.includes('categories') ||
  //   router.pathname.includes('product') ||
  //   router.pathname.includes('productDetails') ||
  //   router.pathname.includes('about') ||
  //   router.pathname.includes('terms-of-service') ||
  //   router.pathname.includes('privacy-policy') ||
  //   router.pathname.includes('faq') ||
  //   router.pathname.includes('blog') ||
  //   router.pathname.includes('seller-profile');

  const organizationSchema: SchemaItem = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    Keywords: 'Kwibal',
    name: 'Kwibal - The biggest buy & sell marketplace globally in 2024',
    description: 'Negotiate and get the best deals , buy direct or trade your products for another one.',
    url: 'https://webv2.le-offers.com/',
    logo: 'https://leoffer-media.s3.ap-south-1.amazonaws.com/og_image_36021e5b9a.svg',
    brand: 'Appscrip',
    address: ' 8530 Colonial Pl',
    city: 'Duluth',
    state: 'Georgia',
    country: 'United States Of America',
    currency: 'USD',
    zipcode: '30097',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-440-212-988',
      email: 'sales@appscrip.com',
    },
    sameAs: 'https://www.facebook.com/',
  };

  useEffect(() => {
    if (!myLocation && myLocationFromServer) {
      setMyIpAddressDispatch(myLocationFromServer.ip);
      setMyLocationDispatch({
        address: String(
          myLocationFromServer.city + ' ' + myLocationFromServer.region + ' ' + myLocationFromServer.countryName
        ),
        latitude: String(myLocationFromServer.latitude),
        longitude: String(myLocationFromServer.longitude),
        city: String(myLocationFromServer.city),
        country: String(myLocationFromServer.countryName),
      });
    } else {
      if (ipAddress && myLocation) {
        setMyIpAddressDispatch(ipAddress);
        setMyLocationDispatch({
          address: String(myLocation.address),
          latitude: String(myLocation.latitude),
          longitude: String(myLocation.longitude),
          city: String(myLocation.city),
          country: String(myLocation.country),
        });
      }
    }

    if (tokenFromServer && token?.accessToken) {
      // when the home page is loaded it sets the token from the server
      const accessToken = Cookies.get('accessToken');
      if(!accessToken){
        setGuestTokenDispatch(tokenFromServer);
      }
    } else {
      if (!token?.accessToken) {
        (async () => {
          try {
            const { data } = await getGuestToken().unwrap();
            // if token is not available, it will fetch the token from the server again

            setGuestTokenDispatch(data?.token);
          } catch (error) {
            console.error('🚀 Error fetching guest token:', error);
          }
        })();
      }
    }
    if (categories ) {
      setMyCategoriesDispatch(categories);
    }
    if(categoriesWithChildCategories){
      setMyCategoriesWithChildrenDispatch(categoriesWithChildCategories);
    }
    
  }, [ipAddress]);

  return (
    <>
      <div dir={locale === 'ar' ? 'rtl' : undefined}>
        <ProgressBar color="var(--brand-color)" />
        <CustomHeader />

        <Schema item={organizationSchema} />

        {!excludeHeader && (
          <Header
            categoriesWithChildCategories={categoriesWithChildCategories}
            stickyHeaderWithSearchBox={stickyHeader}
          />
        )}

        {
          !excludeHeroSection && (
            <HeroSection
              // content={content}
              // ${excludeDefaultPageHeaderForPlpPage.some((substring) => router.pathname.includes(substring)) &&
              //   'border-error sm:hidden mobile:inline'
              // }  please do not remove this for future use
              className={''}
              stickyHeaderWithSearchBox={stickyHeroSection}
              handleGetLocationHelper={handleGetLocationHelper}
              handleRemoveLocationHelper={handleRemoveLocationHelper}
            />
          )
        }

        <div
          className={appClsx(
            `   
              ${(stickyHeader || excludeHeroSection) && 'mt-[69px] sm:mt-[69px]'}
              ${stickyHeroSection && 'mt-[132px] sm:mt-[142px]'}
             dark:bg-bg-primary-dark w-full h-full mx-auto overflow-hidden`,containerClass
          )}
        >
          {children}
        </div>

        {!excludeFooter && (
          <footer className="">
            <Footer />
          </footer>
        )}
      </div>
    </>
  );
};

export default Layout;

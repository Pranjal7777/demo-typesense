import { GetServerSidePropsContext, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DEFAULT_LOCATION } from '@/config';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';
import { ResponseGetAllCategoriesPayload, ResponseGetAllGrandParentCategoriesPayload, Token } from '@/store/types';
import {
  CategoriesDataFromServer,
  CategoriesDataWithChildCategoriesFromServer,
} from '@/helper/categories-data-from-server';
import HomePage from '@/containers/home';
import PropTypes from 'prop-types';
import { postsItemsProps } from './blog';
import CustomHeader from '@/components/ui/custom-header';
import { StrapiData } from '@/store/types/strapi-seo-types';
import { MyLocationFromIp } from '@/store/types/location-types';



const KeywordsPropTypes = PropTypes.shape({
  key: PropTypes.string.isRequired,
});

const ImageAttributesPropTypes = PropTypes.shape({
  url: PropTypes.string.isRequired,
});

const ImagePropsPropTypes = PropTypes.shape({
  data: PropTypes.shape({
    attributes: ImageAttributesPropTypes.isRequired,
  }).isRequired,
});

const TwitterCardPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  twitterTitle: PropTypes.string.isRequired,
  twitterUrl: PropTypes.string.isRequired,
  twitterImageAlt: PropTypes.string.isRequired,
  twitterImage: ImagePropsPropTypes.isRequired,
});

const SeoPropertiesPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  metaTitle: PropTypes.string.isRequired,
  metaDesc: PropTypes.string.isRequired,
  schemaDesc: PropTypes.string.isRequired,
  schemaName: PropTypes.string.isRequired,
  keywords: KeywordsPropTypes.isRequired,
  metaImage: ImagePropsPropTypes.isRequired,
  twitterCard: TwitterCardPropTypes.isRequired,
});

const AttributesPropTypes = PropTypes.shape({
  seoProperties: SeoPropertiesPropTypes.isRequired,
});

const StrapiDataPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  attributes: AttributesPropTypes.isRequired,
});
interface HomeProps {
  tokenFromServer: Token;
  categories: ResponseGetAllGrandParentCategoriesPayload;
  categoriesWithChildCategories: ResponseGetAllCategoriesPayload;
  myLocationFromServer: MyLocationFromIp;
  posts: {
    data: postsItemsProps;
  };
  strapiSEO: StrapiData
}

const Home: NextPage<HomeProps> =  ({
  tokenFromServer,
  categories,
  categoriesWithChildCategories,
  myLocationFromServer,
  posts,
  strapiSEO 
})=> {

  return (
    <>
      <CustomHeader title={strapiSEO?.attributes?.seoProperties?.metaTitle} description={strapiSEO?.attributes?.seoProperties?.metaDesc} />
      <HomePage
        tokenFromServer={tokenFromServer}
        categories={categories}
        categoriesWithChildCategories={categoriesWithChildCategories}
        myLocationFromServer={myLocationFromServer}
        posts={posts}
      />
    </>
  );
};

Home.propTypes = {
  tokenFromServer: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    accessExpireAt: PropTypes.number.isRequired,
    refreshToken: PropTypes.string.isRequired,
  }).isRequired,

  categories: PropTypes.shape({
    message: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        titleLang: PropTypes.shape({
          en: PropTypes.string.isRequired,
          es: PropTypes.string, // Optional
        }).isRequired,
        images: PropTypes.shape({
          website: PropTypes.string.isRequired,
          app: PropTypes.string.isRequired,
          unSelectedWebIcon: PropTypes.string.isRequired,
          unSelectedAppIcon: PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.string.isRequired,
        seqId: PropTypes.number.isRequired,
        hasSubType: PropTypes.bool.isRequired,
        subTypesCount: PropTypes.number.isRequired,
        shippingAvailable: PropTypes.bool.isRequired,
        attributesGroupCount: PropTypes.number.isRequired,
        isPremium: PropTypes.bool.isRequired,
        noOfTokens: PropTypes.number.isRequired,
        shippingType: PropTypes.string.isRequired,
        enableBuyNowOfferFlow: PropTypes.bool.isRequired,
        customMakeModelsEnable: PropTypes.bool.isRequired,
      })
    ).isRequired,
    categoryPath: PropTypes.array.isRequired,
    parentCategoryName: PropTypes.string.isRequired,
    parentCategoryId: PropTypes.string.isRequired,
    totalCount: PropTypes.number.isRequired,
  }).prototype,

  categoriesWithChildCategories: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        titleLang: PropTypes.shape({
          en: PropTypes.string.isRequired,
          es: PropTypes.string.isRequired,
        }).isRequired,
        images: PropTypes.shape({
          website: PropTypes.string.isRequired,
          app: PropTypes.string.isRequired,
          unSelectedWebIcon: PropTypes.string.isRequired,
          unSelectedAppIcon: PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.string.isRequired,
        seqId: PropTypes.number.isRequired,
        hasSubType: PropTypes.bool.isRequired,
        subTypesCount: PropTypes.number.isRequired,
        shippingAvailable: PropTypes.bool.isRequired,
        attributesGroupCount: PropTypes.number.isRequired,
        isPremium: PropTypes.bool.isRequired,
        noOfTokens: PropTypes.number.isRequired,
        shippingType: PropTypes.string.isRequired,
        enableBuyNowOfferFlow: PropTypes.bool.isRequired,
        customMakeModelsEnable: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).prototype,

  myLocationFromServer: PropTypes.shape({
    ip: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    loc: PropTypes.string.isRequired,
    org: PropTypes.string.isRequired,
    postal: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
    countryName: PropTypes.string.isRequired,
    latitude: PropTypes.string.isRequired,
    longitude: PropTypes.string.isRequired,
  }).isRequired,

  posts: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        attributes: PropTypes.shape({
          heroSection: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string.isRequired,
            heroImage: PropTypes.shape({
              id: PropTypes.number.isRequired,
              alt: PropTypes.string.isRequired,
              coverImage: PropTypes.shape({
                data: PropTypes.shape({
                  attributes: PropTypes.shape({
                    url: PropTypes.string.isRequired,
                  }).isRequired,
                }).isRequired,
              }).isRequired,
            }).isRequired,
          }).isRequired,
          breadCrumbLinks: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              name: PropTypes.string.isRequired,
              link: PropTypes.string.isRequired,
            }).isRequired
          ).isRequired,
          blogData: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              title: PropTypes.string.isRequired,
              tags: PropTypes.string.isRequired,
              postedBy: PropTypes.string.isRequired,
              equipment: PropTypes.string.isRequired,
              views: PropTypes.string.isRequired,
              postedDate: PropTypes.string.isRequired,
              coverImage: PropTypes.shape({
                data: PropTypes.shape({
                  attributes: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    url: PropTypes.string.isRequired,
                    width: PropTypes.number.isRequired,
                    height: PropTypes.number.isRequired,
                  }).isRequired,
                }).isRequired,
              }).isRequired,
              socialLinks: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.number.isRequired,
                  title: PropTypes.string.isRequired,
                  altText: PropTypes.string.isRequired,
                  link: PropTypes.string.isRequired,
                  icon: PropTypes.shape({
                    data: PropTypes.shape({
                      attributes: PropTypes.shape({
                        url: PropTypes.string.isRequired,
                        name: PropTypes.string.isRequired,
                      }).isRequired,
                    }).isRequired,
                  }).isRequired,
                }).isRequired
              ).isRequired,
              blogSection: PropTypes.arrayOf(
                PropTypes.shape({
                  id: PropTypes.number.isRequired,
                  title: PropTypes.string.isRequired,
                  slugParagraphs: PropTypes.arrayOf(
                    PropTypes.shape({
                      paragraph: PropTypes.string.isRequired,
                    }).isRequired
                  ).isRequired,
                }).isRequired
              ).isRequired,
            }).isRequired
          ).isRequired,
        }).isRequired,
      }).isRequired
    ).isRequired,
  }).prototype,

  strapiSEO: StrapiDataPropTypes.isRequired,

};

export default Home;

export async function getServerSideProps({ req, res, locale }: { req: GetServerSidePropsContext['req'];res: GetServerSidePropsContext['res']; locale: string }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  try {
    let guestToken, tokenFromServer, accessTokenFromServer, blogData;
    const cookies = req?.headers?.cookie;

    if (cookies) {
      // parsedCookie = cookie.parse(cookies);
      // if (!parsedCookie?.accessToken) {
      guestToken = await getGuestTokenFromServer();
      tokenFromServer = guestToken?.data?.token;
      accessTokenFromServer = tokenFromServer?.accessToken;
      // } else {
      //   accessTokenFromServer = parsedCookie?.accessToken?.replace(/^"(.*)"$/, '$1'); 
      // }
    } else {
      guestToken = await getGuestTokenFromServer();
      tokenFromServer = guestToken?.data?.token;
      accessTokenFromServer = tokenFromServer?.accessToken;
    }

    const promises = [
      CategoriesDataFromServer(accessTokenFromServer),
      CategoriesDataWithChildCategoriesFromServer(accessTokenFromServer),
      serverSideTranslations(locale, ['common']),
      fetch('https://strapi.le-offers.com/api/home?populate=deep').then(res => res.json())
    ];
    
    
    const listingApiReponses = await Promise.allSettled(promises);
    // blogData =  listingApiReponses[0].status === 'fulfilled' && listingApiReponses[0].value;
    const categories = listingApiReponses[0].status === 'fulfilled' && listingApiReponses[0].value ;

    
    const categoriesWithChildCategories =
    listingApiReponses[1].status === 'fulfilled' && listingApiReponses[1].value ;
    const translatedStrings = listingApiReponses[2].status === 'fulfilled' && listingApiReponses[2].value ;
    const myLocationFromServer = DEFAULT_LOCATION;
    const strapiData = listingApiReponses[3].status === 'fulfilled' ? listingApiReponses[3].value.data.attributes.seoProperties : { data: [] };

    return {
      props: {
        ...(translatedStrings),
        tokenFromServer: tokenFromServer || null,
        myLocationFromServer,
        categories : categories || [],
        categoriesWithChildCategories : categoriesWithChildCategories || [],
        posts: blogData || { data: [] },
        strapiSEO: strapiData || {data:[]},
      },
    };
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        tokenFromServer: null,
        myLocationFromServer: DEFAULT_LOCATION,
        categories: [],
        categoriesWithChildCategories: [],
        posts: { data: [] },
        strapiSEO: {data:[]},
        error: (error as Error).message || 'An error occurred',
      },
    };
  }
}




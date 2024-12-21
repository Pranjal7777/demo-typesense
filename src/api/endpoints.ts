//Auth

export const GUEST_LOGIN_URL = 'guestLogin';
export const GUEST_REFRESH_TOKEN_URL = 'refreshToken';
export const LOGIN_URL = '/login/v2';
export const SIGN_OUT_URL = '/signOut';
export const SIGN_UP_URL = '/signUp/v2';
export const VALIDATE_EMAIL_URL = '/validateEmail';
export const FORGOT_PASSWORD_URL = '/forgotPassword';
export const VALIDATE_PHONE_NUMBER_URL = '/validatePhoneNumber';
export const VERIFICATION_OTP_CODE_URL = '/sendVerificationCode/v2';
export const RE_VERIFICATION_OTP_CODE_URL = '/resendVerificationCode';
export const VALIDATE_OTP_CODE_URL = '/validateVerificationCode';

//Categories
export const GET_ALL_GRAND_PARENT_CATEGORIES_URL = '/categories';
export const GET_ALL_CATEGORIES_URL = '/python/categories';
export const GET_SUB_CATEGORIES_BY_ID_URL = '/categories';

//Filters
export const GET_ALL_FILTERS_URL = '/filterParameter';
//Product
export const GET_ALL_BANNERS_AND_PRODUCTS_URL = 'python/assets';
export const GET_ALL_HIGHLIGHTED_PRODUCTS_URL = 'python/highlightedAssets';
export const SEARCH_PRODUCTS_AND_USERS_URL = 'python/assetSuggestion';
export const GET_RECENT_SEARCH_DATA_URL = 'assets/recentSearch';
export const ADD_RECENT_SEARCH_DATA_URL = 'python/assets';
export const ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL = 'python/assetDetails';
export const SUBSCRIBE_TO_NEWS_LETTER_URL = 'newsLetter/subscribe';
export const LIKE_AND_DISLIKE_PRODUCT_URL = 'likesDislikeAsset';
export const SIMILAR_PRODUCTS_URL = 'similarProducts';
export const GET_REPORT_REASONS_URL = 'reasons?type=1';
// strapi end points

export const BLOGS_POST = 'blog';

// FAQ section
export const FAQ_SECTION = 'faq-section';
export const GET_ALL_FAQ_QA = 'v1/faq';

// profile end point

export const ADD_USER_TO_RECENT_SEARCH_URL = '/profile/views/';
export const GET_ALL_SAVED_ADDRESS = 'v1/address';
export const DELETE_ADDRESS = '?addressId=';
export const DEFAULT_ADDRESS = '/default';
export const GET_ADDRESS_ATTRIBUTES = 'v1/addressAttribute?type=1'
export const GET_ADDRESS_TYPES = 'v1/addressAttribute?type=2'
export const GET_VERIFICATION_CODE = 'sendVerificationCode';
export const USER_ACCOUNT = 'v1/userAccount';
export const UPDATE_USER_ACCOUNT = `${USER_ACCOUNT}/update`;
export const VERIFY_SOCIAL_ACCOUNT = '/socialVerify';
export const GET_REASONS = 'v1/reasons?type';


// seller-profile end point
export const GET_ALL_SELLER_ASSETS = 'v2/python/userAssets/';
export const SEARCH_QUERY = 'q';
export const USER_REVIEWS = 'v1/userReview';
export const LINKED_WITH = 'linkedWith';
export const ALL = 'ALL';
export const BUYER = 'BUYER';
export const SELLER = 'SELLER';
export const SORT_BY = 'sortBy';
export const ACCOUNT_ID  = 'accountId';
export const OFFSET  = 'offset';
export const USER_RATING = 'v1/userRating';
export const FOLLOW = 'v1/follow';
export const UNFOLLOW = 'v1/unfollow';
export const PROFILE = 'v1/profile';

// my purchase
export const GET_ALL_PURCHASE = 'v1/orders'
export const GET_PURCHASE_DETAILS = 'v1/orders/details'
export const GET_DEAL_CANCEL_REASONS = 'v1/reasons?type=6';
export const POST_DEAL_CANCEL = 'v1/orders/cancelDeal';
// privacy policy
export const GET_PRIVACY_POLICY_DATA = '/htmlPage';

// my favorites
export const GET_ALL_FAVORITES = 'v1/likesDislikeAsset';

//strapi api
export const STRAPI_CATEGORIES_PLP='/categories-plp';
export const STRAPI_PRIVACY_POLICY='/privacy-policy';
export const STRAPI_TERMS_OF_SERVICE = '/terms-of-service';

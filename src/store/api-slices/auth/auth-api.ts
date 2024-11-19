import { rootApi } from '../root-api';
import { AUTH_URL_V1, GUEST_TOKEN_DEFAULT_PASS, GUEST_TOKEN_DEFAULT_USER } from '../../../config/index';
import {
  GetGuestTokenConfig,
  OtpData,
  RequestForgotPasswordPayload,
  RequestLoginPayload,
  RequestLoginPaylodWithEmail,
  RequestLoginPaylodWithGoogle,
  RequestLogoutPayload,
  RequestReSendVerificationCodePayload,
  RequestSendVerificationCodeForLoginWithEmail,
  RequestSendVerificationCodeForLoginWithPhone,
  RequestSendVerificationCodePayload,
  RequestSignUpPayload,
  RequestValidVerificationCodePayload,
  RequestValidateEmail,
  ResponseForgotPasswordPayload,
  ResponseGetGuestTokenPayload,
  ResponseLoginPayload,
  ResponseLogoutPayload,
  ResponseSendVerificationCodePayload,
  ResponseValidVerificationCodePayload,
} from '@/store/types';
import platform from 'platform';
import {
  FORGOT_PASSWORD_URL,
  GUEST_LOGIN_URL,
  GUEST_REFRESH_TOKEN_URL,
  LOGIN_URL,
  RE_VERIFICATION_OTP_CODE_URL,
  SIGN_OUT_URL,
  SIGN_UP_URL,
  VALIDATE_EMAIL_URL,
  VALIDATE_OTP_CODE_URL,
  VALIDATE_PHONE_NUMBER_URL,
  VERIFICATION_OTP_CODE_URL,
} from '@/api/endpoints';
import { REFRESH_ACCESS_TOKEN } from '@/constants/cookies';
import Cookies from 'js-cookie';

// NOTE: GUEST TOKEN GENERATION PURPOSE
// const user = "equipnow";
// const pass = "admin@equipnow.com";
// const user = "le-offers";
// const pass = "admin@le-offers.com";
export const guestGeneratedToken = 'Basic ' + btoa(GUEST_TOKEN_DEFAULT_USER + ':' + GUEST_TOKEN_DEFAULT_PASS);
const guestRefreshToken = Cookies.get(REFRESH_ACCESS_TOKEN);

const getGuestTokenConfig: GetGuestTokenConfig = {
  deviceId: 'web_app',
  deviceMake: platform.name as string,
  deviceModel: platform.version as string,
  deviceTypeCode: 3,
  deviceOs: ((platform?.os?.family as string) + '-' + platform?.os?.version) as string,
  appVersion: 'v1',
  browserVersion: platform.version as string,
};

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getGuestToken: builder.mutation<ResponseGetGuestTokenPayload, void>({
      query: () => ({
        url: `${AUTH_URL_V1}/${GUEST_LOGIN_URL}`,
        method: 'POST',
        body: getGuestTokenConfig,
        headers: {
          Authorization: `${guestGeneratedToken}`,
        },
      }), 
    }),
    getGuestRefreshToken: builder.mutation<ResponseGetGuestTokenPayload, void>({
      query: () => ({
        url: `${AUTH_URL_V1}/${GUEST_REFRESH_TOKEN_URL}`,
        method: 'POST',
        body: getGuestTokenConfig,
        headers: {
          Authorization: guestRefreshToken?.replace(/"/g, ''),
        },
      }),
    }),
    sendVerificationCode: builder.mutation<
      ResponseSendVerificationCodePayload,
      | RequestSendVerificationCodePayload
      | RequestSendVerificationCodeForLoginWithPhone
      | RequestSendVerificationCodeForLoginWithEmail
    >({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${VERIFICATION_OTP_CODE_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    reSendVerificationCode: builder.mutation<ResponseSendVerificationCodePayload, RequestReSendVerificationCodePayload>(
      {
        query: (data) => ({
          url: `${AUTH_URL_V1}/${RE_VERIFICATION_OTP_CODE_URL}`,
          method: 'POST',
          body: data,
        }),
      }
    ),
    login: builder.mutation<
      ResponseLoginPayload,
      RequestLoginPayload | RequestLoginPaylodWithEmail | RequestLoginPaylodWithGoogle
    >({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${LOGIN_URL}`,
        // url:`${NEXT_URL}/api/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<ResponseLogoutPayload, RequestLogoutPayload>({
      query: (data) => ({
        // url:`${NEXT_URL}/api/signOut`,
        url: `${AUTH_URL_V1}/${SIGN_OUT_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    validVerificationCode: builder.mutation<ResponseValidVerificationCodePayload, RequestValidVerificationCodePayload>({
      query: (data) => ({
        url: `/v1/${VALIDATE_OTP_CODE_URL}`,
        method: 'POST',
        body: { ...data },
      }),
    }),
    forgotPassword: builder.mutation<ResponseForgotPasswordPayload, RequestForgotPasswordPayload>({
      query: (data) => ({
        url: `/v1/${FORGOT_PASSWORD_URL}`,
        method: 'POST',
        body: { ...data },
      }),
    }),
    signUp: builder.mutation<ResponseLoginPayload, RequestSignUpPayload>({
      query: (data) => ({
        url: `/v1/${SIGN_UP_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    validateEmail: builder.mutation<ResponseValidVerificationCodePayload, RequestValidateEmail>({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${VALIDATE_EMAIL_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    validatePhoneNumber: builder.mutation<ResponseValidVerificationCodePayload, OtpData>({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${VALIDATE_PHONE_NUMBER_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    validateUserName: builder.mutation<ResponseValidVerificationCodePayload,string>({
      query: (userName) => ({
        url: `${AUTH_URL_V1}/userName?username=${userName}&trigger=1`,
        method: 'POST',
      }),
    }),
  }),
});

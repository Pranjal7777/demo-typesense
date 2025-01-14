import { GET_REASONS, GET_VERIFICATION_CODE, PROFILE, RE_VERIFICATION_OTP_CODE_URL, UPDATE_USER_ACCOUNT, USER_ACCOUNT, VALIDATE_OTP_CODE_URL, VERIFY_SOCIAL_ACCOUNT } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { AUTH_URL_V1 } from '@/config';
import {
  RequestReSendVerificationCodePayload,
  RequestValidVerificationCodePayload,
  ResponseSendVerificationCodePayload,
  ResponseValidVerificationCodePayload,
} from '@/store/types';
import { ReasonResponse, SendVerificationForChangeNumber } from '@/store/types/profile-type';
import { FollowersAndFollowingResponse } from '@/store/types/seller-profile-type';

// import { ResponseAddress } from '@/store/types';

export const selfProfileApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (updatedProfileData) => ({
        url: `${PROFILE}`,
        method: 'PATCH',
        body: updatedProfileData,
      }),
    }),
    updateAccount: builder.mutation({
      query: (updatedProfileData) => ({
        url: `${UPDATE_USER_ACCOUNT}`,
        method: 'PATCH',
        body: updatedProfileData,
      }),
    }),
    deleteAccount: builder.mutation({
      query: (deleteAccountData) => ({
        url: `${USER_ACCOUNT}`,
        method: 'DELETE',
        body: deleteAccountData,
      }),
    }),
    updateUserName: builder.mutation<ResponseValidVerificationCodePayload, { username: string }>({
      query: (body) => ({
        url: `${AUTH_URL_V1}/userName`,
        method: 'PUT',
        body,
      }),
    }),
    updateEmail: builder.mutation<ResponseValidVerificationCodePayload, { newEmail: string }>({
      query: (body) => ({
        url: `${AUTH_URL_V1}/email`,
        method: 'PATCH',
        body,
      }),
    }),
    updatePhoneNumber: builder.mutation<
      ResponseValidVerificationCodePayload,
      { phoneNumber: string; countryCode: string }
    >({
      query: (body) => ({
        url: `${AUTH_URL_V1}/phoneNumber`,
        method: 'PATCH',
        body,
      }),
    }),
    sendVerificationCodeForChangeNumber: builder.mutation<any, SendVerificationForChangeNumber>({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${GET_VERIFICATION_CODE}`,
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
    verifyVerificationCode: builder.mutation<ResponseValidVerificationCodePayload, RequestValidVerificationCodePayload>(
      {
        query: (body) => ({
          url: `${AUTH_URL_V1}${VALIDATE_OTP_CODE_URL}`,
          method: 'POST',
          body,
        }),
      }
    ),
    verifySocialAccount: builder.mutation<any, { id: string; trigger: number }>({
      query: (body) => ({
        url: `${AUTH_URL_V1}${VERIFY_SOCIAL_ACCOUNT}`,
        method: 'POST',
        body,
      }),
    }),
    getDeleteAccountReasons: builder.query<ReasonResponse, void>({
      query: () => ({
        url: `${GET_REASONS}=3`,
        method: 'GET',
      }),
    }),
    getFollowersAndFollowing: builder.query<
      FollowersAndFollowingResponse,
      { page: number; trigger: number; accountId: string; userId: string; searchText?: string }
    >({
      query: (body) => ({
        url: `${AUTH_URL_V1}/followeeNFollower`,
        method: 'GET',
        params: {
          accountId: body.accountId || '',
          userId: body.userId || '',
          trigger: body.trigger || 0,
          page: body.page || 1,
          ...(body.searchText && { searchText: body.searchText }),
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

//https://api.platform.kwibal.com/v1/email

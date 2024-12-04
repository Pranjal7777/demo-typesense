import { GET_VERIFICATION_CODE, PROFILE } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { AUTH_URL_V1 } from '@/config';
import {
  ResponseValidVerificationCodePayload,
} from '@/store/types';
import { SendVerificationForChangeNumber } from '@/store/types/profile-type';

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
    sendVerificationCodeForChangeNumber: builder.mutation<
      any,
      SendVerificationForChangeNumber
    >({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${GET_VERIFICATION_CODE}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

//https://api.platform.kwibal.com/v1/email

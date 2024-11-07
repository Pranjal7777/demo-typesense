import { DEFAULT_ADDRESS, DELETE_ADDRESS, GET_ALL_SAVED_ADDRESS } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { ResponseAddress } from '@/store/types/profile-type';
// import { ResponseAddress } from '@/store/types';

export const addressApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSavedAddress: builder.query<ResponseAddress, void>({
      query: () => ({
        url: `${GET_ALL_SAVED_ADDRESS}`,
        method: 'GET',
      }),
    }),
    addAddress: builder.mutation({
      query: (address: any) => ({
        url: `${GET_ALL_SAVED_ADDRESS}`,
        method: 'POST',
        body: address,
      }),
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `${GET_ALL_SAVED_ADDRESS}${DELETE_ADDRESS}${id}`,
        method: 'DELETE',
      }),
    }),
    updateAddress: builder.mutation({
      query: (updatedAddress) => ({
        url: `${GET_ALL_SAVED_ADDRESS}`,
        method: 'PATCH',
        body: updatedAddress,
      }),
    }),
    updateDefaultAddress: builder.mutation({
      query: (updatedAddress) => ({
        url: `${GET_ALL_SAVED_ADDRESS}${DEFAULT_ADDRESS}`,
        method: 'PATCH',
        body: updatedAddress,
      }),
    }),
  }),
});
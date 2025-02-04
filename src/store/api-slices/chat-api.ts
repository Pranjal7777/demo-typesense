
// import { ResponseAddress } from '@/store/types';

import { POST_CHAT } from "@/api/endpoints";
import { rootApi } from "./root-api";

export const chatApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    postChat: builder.mutation({
      query: (payload: any) => ({
        url: `${POST_CHAT}`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

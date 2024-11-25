
import { GET_ALL_FAQ_QA } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { FaqResponse } from '@/store/types/faq-types';

export const faqApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqQa: builder.query<FaqResponse, void>({
      query: () => ({
        url: `${GET_ALL_FAQ_QA}`,
        method: 'GET',
      }),
    }),
  }),
});



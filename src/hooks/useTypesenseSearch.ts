import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

interface UseTypesenseSearchProps {
  queryBy: string;
  searchItem: string;
  selectedOption: 'Items' | 'Users';
  accountId?: string;
  skip?: number;
  limit?: number;
  time?: number;
}

const useTypesenseSearch = ({
  queryBy = 'title.en,description',
  searchItem,
  selectedOption,
  accountId,
  skip = 0,
  limit = 10,
  time = Math.floor(Date.now() / 1000),
}: UseTypesenseSearchProps) => {
  const filterBy =
    selectedOption === 'Items'
      ? `statusCode:[1,3] && sold:=false && expiredTs:>=${time}`
      : `status:ACTIVE${accountId ? ` && id:!=${accountId}` : ''}`;

  const sortBy =
    selectedOption === 'Items'
      ? `_eval([ (highlightExpireOn:>=${time}):2, (urgentSaleExpireOn:>=${time}):1 ]):desc,_text_match:desc`
      : '_text_match:desc';

  const typesenseAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY as string,
      nodes: [
        {
          host: process.env.NEXT_PUBLIC_TYPESENSE_HOST as string,
          port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT),
          protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL as string,
        },
      ],
    },

    additionalSearchParameters: {
      // @ts-ignore
      q: searchItem,
      query_by: queryBy,
      filter_by: filterBy,
      sort_by: sortBy,
      page: Math.floor(skip / limit) + 1,
      per_page: limit,
      typo_tokens_threshold: 2,
      num_typos: 2,
      prefix: true,
      prefix_length: 3,
      text_match_type: 'max_score',
      prioritize_exact_match: selectedOption === 'Items',
      prioritize_token_position: selectedOption === 'Items',
      // query_by_weights: selectedOption === 'Items' ? '4,3,2,2' : undefined,
    },
  });

  const searchClient = typesenseAdapter.searchClient;
  return { searchClient };
};

export default useTypesenseSearch;

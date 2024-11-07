import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

interface UseTypesenseSearchProps {
  queryBy?: string;
}

const useTypesenseSearch = ({ queryBy = 'title.en,description' }: UseTypesenseSearchProps = {}) => {
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
      query_by: queryBy,
    },
  });

  const searchClient = typesenseAdapter.searchClient;
  return { searchClient };
};

export default useTypesenseSearch;

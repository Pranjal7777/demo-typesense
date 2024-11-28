export interface SchemaItem {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  Keywords: string;
  logo: string;
  brand: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  currency: string;
  description: string;
  contactPoint: {
    '@type': string;
    telephone: string;
    email: string;
  };
  sameAs: string;
}

export interface SearchHit {
  title: {
    en: string;
  };
  categories: Array<{
    id: string;
    title: string;
  }>;
  id: string;
}

export interface SearchResult {
  hits: SearchHit[];
  nbHits: number;
  page: number;
}

export interface SearchResponse {
  results: SearchResult[];
}
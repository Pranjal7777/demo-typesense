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

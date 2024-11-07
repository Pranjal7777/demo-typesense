import { FAQ_DATA } from '@/db';
import { SchemaItem } from '@/types';
import { JSX } from 'react';

interface SchemaProps {
  item: SchemaItem;
}

const faqJsonLd = () => {
  const faq = FAQ_DATA?.length && FAQ_DATA?.map(item => ({
    '@type': 'Question',
    'name': item?.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item?.answer
    }
  }));

  if (!faq) return null; // Change to return null instead of 0
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq // Removed JSON.stringify, as faq is already an array of objects
  };
};

const Schema = ({ item }: SchemaProps): JSX.Element => { // Destructure item from props
  const schemaData = { ...item, ...faqJsonLd() }; // Call faqJsonLd to get the JSON-LD data

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
};

export default Schema;

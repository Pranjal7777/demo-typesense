import React from 'react';

interface ResultsProps {
  children: React.ReactNode;
}
const SearchResults =(({ children } : ResultsProps) => {
    return <>{children}</>; 
  }
);

export default SearchResults;

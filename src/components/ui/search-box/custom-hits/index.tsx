import { connectStateResults } from "react-instantsearch-dom";
import { StateResultsProvided, Hit } from "react-instantsearch-core";

export const CustomSearchResults = connectStateResults(({ searchState, searchResults, children, searchQuery }: StateResultsProvided<Hit> & { children: React.ReactNode, searchQuery: string }) => {
    // Showing nothing if no query
    // if (!searchState?.query) {
    //   return null;
    // }
    // Showing no results message
    if (searchResults?.nbHits === 0) {
      return (
        <div className="flex items-center justify-center h-14">
          <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
            No results found for {searchQuery}
          </span>
        </div>
      );
    }
  
    // Show results
    return children;
  });
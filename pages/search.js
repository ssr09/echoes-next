import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuotes } from '../context/QuotesContext';
import QuoteCard from '../components/QuoteCard';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const { searchQuotes, isLoading, error } = useQuotes();
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const resultsPerPage = 10;
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (!q || isLoading) return;
    
    const results = searchQuotes(q);
    setSearchResults(results);
    setPage(1);
  }, [q, isLoading, searchQuotes]);
  
  // Get current page of results
  const displayedResults = searchResults.slice(0, page * resultsPerPage);
  
  // Check if there are more results to load
  useEffect(() => {
    setHasMore(page * resultsPerPage < searchResults.length);
  }, [page, searchResults.length]);
  
  // Handle infinite scroll
  useEffect(() => {
    function handleScroll() {
      if (!hasMore || isLoading) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        setPage(prevPage => prevPage + 1);
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);
  
  if (!q) {
    return (
      <div className="error">
        <p>Please enter a search query</p>
        <Link href="/">
          <span className="back-btn">Go to Feed</span>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="search-header">
        <h2 className="search-title">Search Results</h2>
        <p className="search-stats">
          {searchResults.length > 0
            ? `Found ${searchResults.length} results for: "${q}"`
            : `No results found for: "${q}"`}
        </p>
        <Link href="/">
          <span className="back-btn">← Back to Feed</span>
        </Link>
      </div>
      
      <div className="feed">
        {isLoading ? (
          <div className="loading">Searching...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : searchResults.length === 0 ? (
          <div className="error">
            <p>No results found. Try different keywords or phrases.</p>
          </div>
        ) : (
          <>
            {displayedResults.map((quote, index) => (
              <QuoteCard key={`${quote.id}-${index}`} quote={quote} />
            ))}
            
            {hasMore && (
              <div className="loading">Loading more results...</div>
            )}
            
            {!hasMore && searchResults.length > 0 && (
              <div className="loading">You've reached the end!</div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuotes } from '../context/QuotesContext';
import QuoteCard from '../components/QuoteCard';

export default function SearchPage() {
  const router = useRouter();
  const { searchQuotes, isLoading, error } = useQuotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const resultsPerPage = 10;
  const [hasMore, setHasMore] = useState(true);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchQuotes(searchQuery);
      setSearchResults(results);
      setPage(1);
    }
  };
  
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
  
  const handleClose = () => {
    router.back();
  };
  
  return (
    <div className="search-modal">
      <div className="search-modal-header">
        <button 
          onClick={handleClose} 
          className="back-button"
          aria-label="Close search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search quotes or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>
      
      <div className="search-results">
        {searchResults.length > 0 && (
          <p className="search-stats">Found {searchResults.length} results</p>
        )}
        
        {isLoading ? (
          <div className="loading">Searching...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : searchResults.length === 0 ? (
          searchQuery && (
            <div className="error">
              <p>No results found. Try different keywords or phrases.</p>
            </div>
          )
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
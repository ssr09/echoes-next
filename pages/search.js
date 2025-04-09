import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuotes } from '../context/QuotesContext';
import QuoteCard from '../components/QuoteCard';

export default function SearchPage() {
  const router = useRouter();
  const { searchQuotes, isLoading, error } = useQuotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const resultsPerPage = 10;
  const [hasMore, setHasMore] = useState(true);
  const searchInputRef = useRef(null);
  
  // Focus search input on component mount
  useEffect(() => {
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
        // Try to show the virtual keyboard on mobile
        if (typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)) {
          searchInputRef.current.click();
        }
      }, 100);
    }
  }, []);
  
  // Enhanced focus handling with special iOS considerations
  useEffect(() => {
    // Function to focus and show virtual keyboard
    const focusSearchInput = () => {
      if (!searchInputRef.current) return;
      
      // Focus the input
      searchInputRef.current.focus();
      
      // On iOS, we need to do more to ensure the keyboard appears
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        // iOS often requires a user-initiated event to show keyboard
        // Using a slightly longer delay and multiple attempts for iOS
        setTimeout(() => {
          searchInputRef.current.focus();
          // The click can help iOS show the keyboard
          searchInputRef.current.click();
          
          // iOS sometimes needs position adjustments to show keyboard
          window.scrollTo(0, 0);
          
          // Additional attempt after another delay
          setTimeout(() => {
            searchInputRef.current.focus();
            // Some iOS versions respond better to blur then focus again
            searchInputRef.current.blur();
            searchInputRef.current.focus();
          }, 300);
        }, 300);
      } else if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // For other mobile devices
        searchInputRef.current.click();
      }
    };
    
    focusSearchInput();
    
    // Add a very small delay to ensure the component is fully mounted
    const timer = setTimeout(focusSearchInput, 350);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchQuotes(searchQuery);
      setSearchResults(results);
      setHasSearched(true);
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
  
  // Function to help trigger keyboard on touch devices
  const handleContainerTouch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  return (
    <div className="search-modal">
      <div 
        className="search-modal-header"
        onTouchStart={handleContainerTouch}
      >
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <svg className="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              className="search-input"
              placeholder="Search quotes or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              inputMode="search"
              enterKeyHint="search"
              // iOS safari specific
              data-focusable="true"
            />
          </div>
          <button 
            type="button" 
            onClick={handleClose} 
            className="cancel-btn"
          >
            Cancel
          </button>
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
        ) : hasSearched && searchResults.length === 0 ? (
          <div className="no-results">
            <svg className="no-results-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 7V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No Matches Found</h3>
            <p>We couldn't find any quotes matching "{searchQuery}"</p>
            <div className="no-results-tips">
              <h4>Try:</h4>
              <ul>
                <li>Using more general terms</li>
                <li>Checking for typos</li>
                <li>Searching for author names</li>
              </ul>
            </div>
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
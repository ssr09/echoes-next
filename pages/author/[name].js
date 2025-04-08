import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuotes } from '../../context/QuotesContext';
import QuoteCard from '../../components/QuoteCard';

export default function AuthorPage() {
  const router = useRouter();
  const { name } = router.query;
  const { getQuotesByAuthor, isLoading, error } = useQuotes();
  const [authorQuotes, setAuthorQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const quotesPerPage = 10;
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (!name || isLoading) return;
    
    const decodedName = decodeURIComponent(name);
    const quotes = getQuotesByAuthor(decodedName);
    setAuthorQuotes(quotes);
  }, [name, isLoading, getQuotesByAuthor]);
  
  // Get current page of quotes
  const displayedQuotes = authorQuotes.slice(0, page * quotesPerPage);
  
  // Check if there are more quotes to load
  useEffect(() => {
    setHasMore(page * quotesPerPage < authorQuotes.length);
  }, [page, authorQuotes.length]);
  
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
  
  const handleBackClick = () => {
    router.back();
  };
  
  if (!name) {
    return <div className="loading">Loading...</div>;
  }
  
  const decodedName = decodeURIComponent(name);
  
  return (
    <div>
      <div className="author-header">
        <button 
          onClick={handleBackClick} 
          className="back-button"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="author-name">{decodedName}</h2>
      </div>
      
      <div className="quote-feed">
        {isLoading ? (
          <div className="loading">Loading quotes...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : authorQuotes.length === 0 ? (
          <div className="error">No quotes found for this author.</div>
        ) : (
          <>
            {displayedQuotes.map((quote, index) => (
              <QuoteCard 
                key={`${quote.id}-${index}`} 
                quote={quote} 
                showAuthorLink={false} 
              />
            ))}
            
            {hasMore && (
              <div className="loading">Loading more quotes...</div>
            )}
            
            {!hasMore && authorQuotes.length > 0 && (
              <div className="loading">You've reached the end!</div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
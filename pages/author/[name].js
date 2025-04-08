import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  
  if (!name) {
    return <div className="loading">Loading...</div>;
  }
  
  const decodedName = decodeURIComponent(name);
  
  return (
    <div>
      <div className="author-header">
        <h2 className="author-name">{decodedName}</h2>
        <Link href="/">
          <span className="back-btn">← Back to Feed</span>
        </Link>
      </div>
      
      <div className="feed">
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
import { useState, useEffect, useCallback } from 'react';
import { useQuotes } from '../context/QuotesContext';
import QuoteCard from '../components/QuoteCard';
import Layout from '../components/Layout';

export default function Home() {
  const [page, setPage] = useState(1);
  const { getFeedQuotes, isLoading, error } = useQuotes();
  const [feedQuotes, setFeedQuotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Memoize the loadQuotes function to prevent unnecessary re-renders
  const loadQuotes = useCallback(() => {
    if (isLoading) return;
    
    const { quotes, hasMore } = getFeedQuotes('random', page);
    
    if (page === 1) {
      setFeedQuotes(quotes);
    } else {
      setFeedQuotes(prev => [...prev, ...quotes]);
    }
    
    setHasMore(hasMore);
  }, [page, isLoading, getFeedQuotes]);
  
  // Load quotes when page changes
  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);
  
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
  
  return (
    <Layout>
      <div className="quote-feed">
        {isLoading && page === 1 ? (
          <div className="loading">Loading quotes...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : feedQuotes.length === 0 ? (
          <div className="error">No quotes found.</div>
        ) : (
          <>
            {feedQuotes.map((quote, index) => (
              <QuoteCard key={`${quote.id}-${index}`} quote={quote} />
            ))}
            
            {isLoading && page > 1 && (
              <div className="loading">Loading more quotes...</div>
            )}
            
            {!hasMore && (
              <div className="loading">You've reached the end!</div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
} 
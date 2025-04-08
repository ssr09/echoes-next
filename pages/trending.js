import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuotes } from '../context/QuotesContext';
import QuoteCard from '../components/QuoteCard';
import Layout from '../components/Layout'; 

export default function TrendingPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { getFeedQuotes, isLoading, error } = useQuotes();
  const [trendingQuotes, setTrendingQuotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Load quotes when page changes
  useEffect(() => {
    if (isLoading) return;
    
    const { quotes, hasMore } = getFeedQuotes('trending', page);
    
    if (page === 1) {
      setTrendingQuotes(quotes);
    } else {
      setTrendingQuotes(prev => [...prev, ...quotes]);
    }
    
    setHasMore(hasMore);
  }, [page, isLoading, getFeedQuotes]);
  
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
    <Layout title="Trending - Echoes">
      <div className="quote-feed">
        {isLoading && page === 1 ? (
          <div className="loading">Loading trending quotes...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : trendingQuotes.length === 0 ? (
          <div className="error">No trending quotes found.</div>
        ) : (
          <>
            {trendingQuotes.map((quote, index) => (
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
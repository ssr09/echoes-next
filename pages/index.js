import { useState, useEffect } from 'react';
import { useQuotes } from '../context/QuotesContext';
import QuoteCard from '../components/QuoteCard';
import Tabs from '../components/Tabs';

export default function Home() {
  const [activeTab, setActiveTab] = useState('random');
  const [page, setPage] = useState(1);
  const { getFeedQuotes, isLoading, error } = useQuotes();
  const [feedQuotes, setFeedQuotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Load quotes when tab changes or on initial load
  useEffect(() => {
    setFeedQuotes([]);
    setPage(1);
    setHasMore(true);
  }, [activeTab]);
  
  // Load quotes when page changes
  useEffect(() => {
    if (isLoading) return;
    
    const { quotes, hasMore } = getFeedQuotes(activeTab, page);
    
    if (page === 1) {
      setFeedQuotes(quotes);
    } else {
      setFeedQuotes(prev => [...prev, ...quotes]);
    }
    
    setHasMore(hasMore);
  }, [activeTab, page, isLoading, getFeedQuotes]);
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
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
    <div>
      <Tabs activeTab={activeTab} onChange={handleTabChange} />
      
      <div className="feed">
        {isLoading && page === 1 ? (
          <div className="loading">Loading quotes...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : feedQuotes.length === 0 ? (
          <div className="error">No quotes found. Please try another tab.</div>
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
    </div>
  );
} 
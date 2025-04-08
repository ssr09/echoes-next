import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuotes } from '../context/QuotesContext';

// Using memo to prevent unnecessary re-renders
const QuoteCard = memo(function QuoteCard({ quote, showAuthorLink = true }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [isLiked, setIsLiked] = useState(quote.hasUpvoted || false);
  const { upvoteQuote } = useQuotes();
  const router = useRouter();
  
  // Update local state if quote prop changes
  useEffect(() => {
    setIsLiked(quote.hasUpvoted || false);
  }, [quote.hasUpvoted]);
  
  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only toggle the visual state locally
    setIsLiked(!isLiked);
    
    // Don't update the actual upvote count for now
    // upvoteQuote(quote.id);
  };
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/quote/${quote.id}`;
    
    // Try using Web Share API for mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          text: `"${quote.quote}" — ${quote.author}${quote.source && quote.source !== quote.author ? ` (${quote.source})` : ''}`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };
  
  // Check if source is the same as author to avoid duplication
  const shouldShowSource = quote.source && quote.source !== quote.author;
  
  return (
    <div className="quote-item">
      <p className="quote-text">{quote.quote}</p>
      
      <div className="quote-attribution">
        {showAuthorLink ? (
          <p className="quote-author">
            — <Link href={`/author/${encodeURIComponent(quote.author)}`}>
              <span className="author-link">
                {quote.author}
                <svg className="author-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5h14v14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </p>
        ) : (
          <p className="quote-author">— {quote.author}</p>
        )}
        
        {shouldShowSource && (
          <p className="quote-source">{quote.source}</p>
        )}
      </div>
      
      <div className="quote-actions">
        <button 
          onClick={handleUpvote} 
          className={`fb-action-btn upvote-btn ${isLiked ? 'liked' : ''}`}
          aria-label={isLiked ? "Remove Upvote" : "Upvote"}
          title={isLiked ? "Remove Upvote" : "Upvote"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
            <path d="M4.3314 12.0474L12 20L19.6686 12.0474C20.5211 11.1633 21 9.96429 21 8.71405C21 6.11055 18.9648 4 16.4543 4C15.2487 4 14.0925 4.49666 13.24 5.38071L12 6.66667L10.76 5.38071C9.90749 4.49666 8.75128 4 7.54569 4C5.03517 4 3 6.11055 3 8.71405C3 9.96429 3.47892 11.1633 4.3314 12.0474Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={() => setShowSimilar(!showSimilar)} 
          className={`fb-action-btn similar-btn ${showSimilar ? 'active' : ''}`}
          aria-label={showSimilar ? "Hide Similar" : "Show Similar"}
          title={showSimilar ? "Hide Similar" : "Show Similar"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={() => setShowExplanation(!showExplanation)} 
          className={`fb-action-btn explain-btn ${showExplanation ? 'active' : ''}`}
          aria-label={showExplanation ? "Hide Explanation" : "Explain"}
          title={showExplanation ? "Hide Explanation" : "Explain"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="currentColor"/>
            <path d="M12 16V14.5811C12 13.6369 12.6042 12.7986 13.5 12.5V12.5C14.3958 12.2014 15 11.3631 15 10.4189V9.90039C15 8.19923 13.6569 6.87305 12 6.87305V6.87305C10.3431 6.87305 9 8.19923 9 9.90039V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <button 
          onClick={handleShare} 
          className="fb-action-btn share-btn"
          aria-label="Share"
          title="Share"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {showExplanation && quote.explanation && (
        <div className="explanation">
          <h4>Context & Meaning</h4>
          <p>{quote.explanation}</p>
        </div>
      )}
      
      {showSimilar && (
        <div className="similar-quotes">
          <h4>Similar Quotes</h4>
          <div className="similar-container">
            <p>Similar quotes feature coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default QuoteCard; 
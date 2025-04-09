import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuotes } from '../context/QuotesContext';

// Using memo to prevent unnecessary re-renders
const QuoteCard = memo(function QuoteCard({ quote, showAuthorLink = true }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [isLiked, setIsLiked] = useState(quote.hasUpvoted || false);
  const [similarQuotes, setSimilarQuotes] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const { upvoteQuote, getSimilarQuotes } = useQuotes();
  const router = useRouter();
  
  // Update local state if quote prop changes
  useEffect(() => {
    setIsLiked(quote.hasUpvoted || false);
  }, [quote.hasUpvoted]);
  
  // Fetch similar quotes when the similar button is clicked
  useEffect(() => {
    if (showSimilar && similarQuotes.length === 0) {
      setIsLoadingSimilar(true);
      // Small timeout to allow UI to update for loading state
      setTimeout(() => {
        const similar = getSimilarQuotes(quote.id, 3);
        setSimilarQuotes(similar);
        setIsLoadingSimilar(false);
      }, 100);
    }
  }, [showSimilar, quote.id, getSimilarQuotes, similarQuotes.length]);
  
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
          text: `"${quote.quote}" — ${quote.author}`,
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
          onClick={() => {
            // If similar quotes are showing, close them first
            if (showSimilar) setShowSimilar(false);
            // Toggle explanation
            setShowExplanation(!showExplanation);
          }} 
          className={`fb-action-btn explain-btn ${showExplanation ? 'active' : ''}`}
          aria-label={showExplanation ? "Hide Explanation" : "Explain"}
          title={showExplanation ? "Hide Explanation" : "Explain"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3C8.68629 3 6 5.68629 6 9C6 10.2145 6.36084 11.3447 6.98117 12.2893C7.93747 13.7546 9 15.5 9 17H15C15 15.5 16.0625 13.7546 17.0188 12.2893C17.6392 11.3447 18 10.2145 18 9C18 5.68629 15.3137 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={() => {
            // If explanation is showing, close it first
            if (showExplanation) setShowExplanation(false);
            // Toggle similar quotes
            setShowSimilar(!showSimilar);
          }} 
          className={`fb-action-btn similar-btn ${showSimilar ? 'active' : ''}`}
          aria-label={showSimilar ? "Hide Similar" : "Show Similar"}
          title={showSimilar ? "Hide Similar" : "Show Similar"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4H15C16.1046 4 17 4.89543 17 6V18C17 19.1046 16.1046 20 15 20H9C7.89543 20 7 19.1046 7 18V6C7 4.89543 7.89543 4 9 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8C4 6.89543 4.89543 6 6 6H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 16C4 17.1046 4.89543 18 6 18H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 8C20 6.89543 19.1046 6 18 6H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 16C20 17.1046 19.1046 18 18 18H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          <h4>Context</h4>
          <p>{quote.explanation}</p>
        </div>
      )}
      
      {showSimilar && (
        <div className="similar-quotes">
          <h4>Similar Quotes</h4>
          <div className="similar-container">
            {isLoadingSimilar ? (
              <p className="loading-similar">Finding similar quotes...</p>
            ) : similarQuotes.length > 0 ? (
              similarQuotes.map((similarQuote) => (
                <div key={similarQuote.id} className="similar-quote-item">
                  <p className="similar-quote-text">"{similarQuote.quote}"</p>
                  <p className="similar-quote-author">
                    — 
                    <Link href={`/author/${encodeURIComponent(similarQuote.author)}`}>
                      <span className="similar-author-link">{similarQuote.author}</span>
                    </Link>
                  </p>
                </div>
              ))
            ) : (
              <p>No similar quotes found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default QuoteCard; 
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuotes } from '../context/QuotesContext';

export default function QuoteCard({ quote, showAuthorLink = true }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const { upvoteQuote } = useQuotes();
  const router = useRouter();
  
  const handleUpvote = () => {
    upvoteQuote(quote.id);
  };
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/quote/${quote.id}`;
    
    // Try using Web Share API for mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          text: `"${quote.quote}" — ${quote.author}${quote.source ? ` (${quote.source})` : ''}`,
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
      <div className="quote-header">
        <button 
          onClick={handleShare} 
          className="share-btn"
          aria-label="Share"
          title="Share"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="8.7" y1="10.7" x2="15.3" y2="6.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8.7" y1="13.3" x2="15.3" y2="17.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      <p className="quote-text">{quote.quote}</p>
      
      <div className="quote-attribution">
        {showAuthorLink ? (
          <p className="quote-author">
            — <Link href={`/author/${encodeURIComponent(quote.author)}`}>
              <span className="author-link">{quote.author}</span>
            </Link>
          </p>
        ) : (
          <p className="quote-author">— {quote.author}</p>
        )}
        
        {quote.source && (
          <p className="quote-source">{quote.source}</p>
        )}
      </div>
      
      <div className="quote-actions">
        <button 
          onClick={handleUpvote} 
          className="action-btn upvote-btn"
          aria-label="Upvote"
          title="Upvote"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 11L12 4L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="upvote-count">{quote.upvotes}</span>
        </button>
        
        <button 
          onClick={() => setShowExplanation(!showExplanation)} 
          className={`action-btn explain-btn ${showExplanation ? 'active' : ''}`}
          aria-label={showExplanation ? "Hide Explanation" : "Explain"}
          title={showExplanation ? "Hide Explanation" : "Explain"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 10.1046 13.1046 11 12 11V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
        </button>
        
        <button 
          onClick={() => setShowSimilar(!showSimilar)} 
          className={`action-btn similar-btn ${showSimilar ? 'active' : ''}`}
          aria-label={showSimilar ? "Hide Similar" : "Show Similar"}
          title={showSimilar ? "Hide Similar" : "Show Similar"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>
      
      {showExplanation && quote.explanation && (
        <div className="explanation">
          {quote.explanation}
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
} 
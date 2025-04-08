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
          className="fb-action-btn upvote-btn"
          aria-label="Upvote"
          title="Upvote"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 11V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 4L5 11H19L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{quote.upvotes}</span>
        </button>
        
        <button 
          onClick={() => setShowExplanation(!showExplanation)} 
          className={`fb-action-btn explain-btn ${showExplanation ? 'active' : ''}`}
          aria-label={showExplanation ? "Hide Explanation" : "Explain"}
          title={showExplanation ? "Hide Explanation" : "Explain"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 10.1046 13.1046 11 12 11V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
          <span>46</span>
        </button>
        
        <button 
          onClick={() => setShowSimilar(!showSimilar)} 
          className={`fb-action-btn similar-btn ${showSimilar ? 'active' : ''}`}
          aria-label={showSimilar ? "Hide Similar" : "Show Similar"}
          title={showSimilar ? "Hide Similar" : "Show Similar"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2H16C19.3137 2 22 4.68629 22 8V16C22 19.3137 19.3137 22 16 22H8C4.68629 22 2 19.3137 2 16V8C2 4.68629 4.68629 2 8 2Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <button 
          onClick={handleShare} 
          className="fb-action-btn share-btn"
          aria-label="Share"
          title="Share"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="17" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="9.7" y1="10.7" x2="14.3" y2="7.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="9.7" y1="13.3" x2="14.3" y2="16.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>5</span>
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
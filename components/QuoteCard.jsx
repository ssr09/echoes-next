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
              <span className="author-link">{quote.author}</span>
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
          className="fb-action-btn upvote-btn"
          aria-label="Upvote"
          title="Upvote"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 10H19.2929C19.9229 10 20.2371 10.7725 19.7929 11.2168L12 19.0097L4.20711 11.2168C3.76286 10.7725 4.07714 10 4.70711 10H10V4C10 3.44772 10.4477 3 11 3H13C13.5523 3 14 3.44772 14 4V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        </button>
        
        <button 
          onClick={() => setShowSimilar(!showSimilar)} 
          className={`fb-action-btn similar-btn ${showSimilar ? 'active' : ''}`}
          aria-label={showSimilar ? "Hide Similar" : "Show Similar"}
          title={showSimilar ? "Hide Similar" : "Show Similar"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 15H21" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 21L9 3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M15 21L15 3" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
        
        <button 
          onClick={handleShare} 
          className="fb-action-btn share-btn"
          aria-label="Share"
          title="Share"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 15C9.15685 15 10.5 13.6569 10.5 12C10.5 10.3431 9.15685 9 7.5 9C5.84315 9 4.5 10.3431 4.5 12C4.5 13.6569 5.84315 15 7.5 15Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16.5 21.75C18.1569 21.75 19.5 20.4069 19.5 18.75C19.5 17.0931 18.1569 15.75 16.5 15.75C14.8431 15.75 13.5 17.0931 13.5 18.75C13.5 20.4069 14.8431 21.75 16.5 21.75Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16.5 8.25C18.1569 8.25 19.5 6.90685 19.5 5.25C19.5 3.59315 18.1569 2.25 16.5 2.25C14.8431 2.25 13.5 3.59315 13.5 5.25C13.5 6.90685 14.8431 8.25 16.5 8.25Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.0919 13.5L13.9082 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M13.9082 6.75L10.0919 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
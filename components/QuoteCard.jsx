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
      <p className="quote-author">
        {showAuthorLink ? (
          <>— <Link href={`/author/${encodeURIComponent(quote.author)}`}>
            <span className="author-link">{quote.author}</span>
          </Link></>
        ) : (
          <>— {quote.author}</>
        )}
      </p>
      
      <div className="quote-actions">
        <div className="action-group">
          <button 
            onClick={handleUpvote} 
            className="action-btn"
            aria-label="Upvote"
          >
            ▲ <span>{quote.upvotes}</span>
          </button>
        </div>
        
        <div className="action-group">
          <button 
            onClick={() => setShowSimilar(!showSimilar)} 
            className="action-btn"
            aria-label={showSimilar ? "Hide Similar" : "Show Similar"}
            title={showSimilar ? "Hide Similar" : "Show Similar"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={() => setShowExplanation(!showExplanation)} 
            className="action-btn"
            aria-label={showExplanation ? "Hide Explanation" : "Explain"}
            title={showExplanation ? "Hide Explanation" : "Explain"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15848 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={handleShare} 
            className="action-btn"
            aria-label="Share"
            title="Share"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
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
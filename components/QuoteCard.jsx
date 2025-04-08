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
    <div className="quote-card">
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
      
      {quote.tags && quote.tags.length > 0 && (
        <div className="tag-list">
          {quote.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
      
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
            className="action-btn text-btn"
          >
            {showSimilar ? 'Hide Similar' : 'Show Similar'}
          </button>
          
          <button 
            onClick={() => setShowExplanation(!showExplanation)} 
            className="action-btn text-btn"
          >
            {showExplanation ? 'Hide Explanation' : 'Explain'}
          </button>
          
          <button 
            onClick={handleShare} 
            className="action-btn text-btn"
          >
            Share
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
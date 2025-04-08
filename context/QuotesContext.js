import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the quotes context
const QuotesContext = createContext();

export function QuotesProvider({ children }) {
  // State for quotes data
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load quotes on mount
  useEffect(() => {
    async function loadQuotes() {
      try {
        setIsLoading(true);
        const response = await axios.get('/quotes.json');
        setQuotes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error loading quotes:', err);
        setError('Failed to load quotes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadQuotes();
  }, []);
  
  // Upvote a quote
  const upvoteQuote = (quoteId) => {
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, upvotes: quote.upvotes + 1 } 
          : quote
      )
    );
  };
  
  // Get a specific quote by ID
  const getQuoteById = (id) => {
    return quotes.find(quote => quote.id === id) || null;
  };
  
  // Get quotes by author
  const getQuotesByAuthor = (authorName) => {
    return quotes.filter(quote => 
      quote.author.toLowerCase() === authorName.toLowerCase()
    ).sort((a, b) => b.upvotes - a.upvotes);
  };
  
  // Search quotes by text
  const searchQuotes = (query) => {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase();
    const queryWords = lowercaseQuery.split(/\s+/).filter(word => word.length > 0);
    
    return quotes
      .map(quote => {
        const quoteText = quote.quote.toLowerCase();
        const authorText = quote.author.toLowerCase();
        
        // Calculate match score
        let score = 0;
        
        // Check for full query match
        if (quoteText.includes(lowercaseQuery)) {
          score += 10;
        }
        
        if (authorText.includes(lowercaseQuery)) {
          score += 5;
        }
        
        // Check for individual word matches
        queryWords.forEach(word => {
          if (quoteText.includes(word)) {
            score += 2;
          }
          if (authorText.includes(word)) {
            score += 1;
          }
        });
        
        return {
          ...quote,
          score
        };
      })
      .filter(quote => quote.score > 0)
      .sort((a, b) => b.score - a.score);
  };
  
  // Get quotes for the feed (random, trending, or top)
  const getFeedQuotes = (type = 'random', page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    let feedQuotes = [...quotes];
    
    if (type === 'trending') {
      // Sort by upvotes for trending
      feedQuotes.sort((a, b) => b.upvotes - a.upvotes);
    } else if (type === 'top') {
      // Sort by popularity for top
      feedQuotes.sort((a, b) => {
        if (b.popularity !== a.popularity) {
          return b.popularity - a.popularity;
        }
        return b.upvotes - a.upvotes;
      });
    } else {
      // Random shuffle for feed
      feedQuotes = shuffleArray(feedQuotes);
    }
    
    return {
      quotes: feedQuotes.slice(startIndex, endIndex),
      hasMore: endIndex < feedQuotes.length,
      total: feedQuotes.length
    };
  };
  
  // Shuffle array helper function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Context value
  const value = {
    quotes,
    isLoading,
    error,
    upvoteQuote,
    getQuoteById,
    getQuotesByAuthor,
    searchQuotes,
    getFeedQuotes
  };
  
  return (
    <QuotesContext.Provider value={value}>
      {children}
    </QuotesContext.Provider>
  );
}

// Custom hook to use the quotes context
export function useQuotes() {
  const context = useContext(QuotesContext);
  
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  
  return context;
} 
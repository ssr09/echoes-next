import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the quotes context
const QuotesContext = createContext();

// List of quote files to load
const quoteFiles = [
  '/quotes_BhagavadGita.json',
  '/quotes_Confucius.json'
  // Add more files here as needed
  // '/quotes_Stoicism.json',
  // '/quotes_Buddhism.json',
];

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
        
        // Load quotes from all files
        const quotesPromises = quoteFiles.map(file => axios.get(file));
        const responses = await Promise.all(quotesPromises);
        
        // Merge all quotes into a single array
        let allQuotes = [];
        responses.forEach((response, index) => {
          const sourceFile = quoteFiles[index].replace(/^\/|\.json$/g, '');
          
          // Process quotes from this file
          const processedQuotes = response.data.map((quote, idx) => {
            // Ensure each quote has a unique ID (if not already provided)
            return {
              ...quote,
              id: quote.id || `${sourceFile}_${idx}`
            };
          });
          
          allQuotes = [...allQuotes, ...processedQuotes];
        });
        
        setQuotes(allQuotes);
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
    setQuotes(prevQuotes => {
      // Find the quote without changing order
      const updatedQuotes = prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { 
              ...quote, 
              upvotes: quote.upvotes + 1,
              hasUpvoted: true
            } 
          : quote
      );
      
      // Use object reference equality - only update if actually needed
      return updatedQuotes;
    });
    
    // For production, this would be where you'd send the upvote to a backend API
    // Example: sendUpvoteToAPI(quoteId).catch(err => console.error('Failed to save upvote', err));
  };
  
  // Get a specific quote by ID
  const getQuoteById = (id) => {
    return quotes.find(quote => quote.id === id) || null;
  };
  
  // Get similar quotes using vector embeddings
  const getSimilarQuotes = (quoteId, limit = 3) => {
    const sourceQuote = quotes.find(q => q.id === quoteId);
    if (!sourceQuote || !sourceQuote.embedding) return [];
    
    // Skip the source quote itself
    const otherQuotes = quotes.filter(q => q.id !== quoteId);
    
    // Calculate cosine similarity using embeddings
    const scoredQuotes = otherQuotes
      .filter(quote => quote.embedding) // Only compare quotes that have embeddings
      .map(quote => {
        // Calculate cosine similarity
        const similarity = calculateCosineSimilarity(
          sourceQuote.embedding,
          quote.embedding
        );
        
        return {
          ...quote,
          similarityScore: similarity
        };
      });
    
    // Sort by similarity score and take top results
    return scoredQuotes
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  };
  
  // Cosine similarity calculation between two vectors
  const calculateCosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    
    // Calculate dot product
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    // Prevent division by zero
    if (normA === 0 || normB === 0) return 0;
    
    // Calculate cosine similarity
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };
  
  // Get quotes by author
  const getQuotesByAuthor = (authorName) => {
    return quotes.filter(quote => 
      quote.author.toLowerCase() === authorName.toLowerCase()
    ).sort((a, b) => b.upvotes - a.upvotes);
  };
  
  // Search quotes by text (simple text-based search)
  const searchQuotes = (query) => {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase().trim();
    
    // Return quotes that contain the query in quote text or author only
    return quotes.filter(quote => {
      const quoteText = quote.quote.toLowerCase();
      const authorText = quote.author.toLowerCase();
      
      return quoteText.includes(lowercaseQuery) || 
             authorText.includes(lowercaseQuery);
    });
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
    getFeedQuotes,
    getSimilarQuotes
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
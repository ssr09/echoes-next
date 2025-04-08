import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useQuotes } from '../../context/QuotesContext';
import QuoteCard from '../../components/QuoteCard';

export default function QuotePage() {
  const router = useRouter();
  const { id } = router.query;
  const { getQuoteById, isLoading, error } = useQuotes();
  
  const quote = id ? getQuoteById(id) : null;
  
  // Metadata for social sharing
  const pageTitle = quote ? `"${quote.quote.substring(0, 60)}${quote.quote.length > 60 ? '...' : ''}" — ${quote.author}` : 'Shared Quote - Echoes';
  const pageDescription = quote ? `${quote.quote.substring(0, 150)}${quote.quote.length > 150 ? '...' : ''}` : 'Read this insightful quote on Echoes';
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/quote/${id}`} />
        <meta property="twitter:card" content="summary" />
      </Head>
      
      <div>
        <div className="search-header">
          <h2 className="search-title">Shared Quote</h2>
          <Link href="/">
            <span className="back-btn">← Back to Feed</span>
          </Link>
        </div>
        
        <div className="feed">
          {isLoading ? (
            <div className="loading">Loading quote...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : !quote ? (
            <div className="error">
              <p>Quote not found</p>
              <Link href="/">
                <span className="back-btn">Go to Feed</span>
              </Link>
            </div>
          ) : (
            <QuoteCard quote={quote} />
          )}
        </div>
      </div>
    </>
  );
} 
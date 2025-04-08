import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  
  const handleSearchClick = () => {
    router.push('/search');
  };
  
  const handleTrendingClick = () => {
    router.push('/trending');
  };
  
  const handleTitleClick = (e) => {
    // If we're already on the home page, refresh the page
    if (router.pathname === '/') {
      e.preventDefault();
      window.location.reload();
    }
    // Otherwise, Next.js Link will navigate to home
  };
  
  return (
    <div className="header-container">
      <header className="header">
        <div className="header-main">
          <Link href="/" onClick={handleTitleClick}>
            <h1>Echoes</h1>
          </Link>
          <div className="header-icons">
            <button 
              onClick={handleSearchClick} 
              className="icon-button"
              aria-label="Search"
              title="Search quotes"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={handleTrendingClick} 
              className="icon-button"
              aria-label="Trending"
              title="Trending quotes"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 7H21V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="header-subtitle">
        <p>Timeless wisdom from history&apos;s greatest thinkers</p>
      </div>
    </div>
  );
} 
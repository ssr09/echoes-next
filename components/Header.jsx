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
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={handleTrendingClick} 
            className="icon-button"
            aria-label="Trending"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <p>Timeless wisdom from history&apos;s greatest thinkers</p>
    </header>
  );
} 
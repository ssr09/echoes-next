import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function Header({ title, showBackArrow }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
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
  
  const handleBackClick = () => {
    router.push('/');
  };
  
  return (
    <>
      <header className="header">
        <div className="header-main">
          {showBackArrow ? (
            <>
              <button 
                onClick={handleBackClick} 
                className="back-arrow"
                aria-label="Go back to home"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1>{title || 'Echoes'}</h1>
            </>
          ) : (
            <Link href="/" onClick={handleTitleClick}>
              <h1>Echoes</h1>
            </Link>
          )}
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
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="icon-button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.92969 4.92969L6.34969 6.34969" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.6497 17.6497L19.0697 19.0697" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.34969 17.6497L4.92969 19.0697" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.0697 4.92969L17.6497 6.34969" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C11.478 3.00321 10.964 3.05772 10.465 3.161C6.105 3.977 3 7.619 3 12C3 16.971 7.029 21 12 21C16.381 21 20.023 17.895 20.839 13.535C20.9423 13.036 20.9968 12.522 21 12C21 7.029 16.971 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      {!showBackArrow && (
        <div className="header-subtitle">
          <p>Timeless wisdom from history&apos;s greatest thinkers</p>
        </div>
      )}
    </>
  );
} 
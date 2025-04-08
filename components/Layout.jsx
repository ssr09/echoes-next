import Head from 'next/head';
import Header from './Header';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'Echoes - Timeless Wisdom' }) {
  const router = useRouter();
  
  // Determine if this is a page that needs a back arrow and custom title
  const isTrendingPage = router.pathname === '/trending';
  const isAuthorPage = router.pathname.startsWith('/author/');
  const isQuotePage = router.pathname.startsWith('/quote/');
  
  // Get the title for the header
  let headerTitle = 'Echoes';
  let showBackArrow = false;
  
  if (isTrendingPage) {
    headerTitle = 'Trending';
    showBackArrow = true;
  } else if (isAuthorPage && router.query.name) {
    headerTitle = decodeURIComponent(router.query.name);
    showBackArrow = true;
  }
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Timeless wisdom from history's greatest thinkers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header title={headerTitle} showBackArrow={showBackArrow} />
      <div className="container">
        <main>{children}</main>
      </div>
    </>
  );
} 
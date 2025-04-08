import Head from 'next/head';
import Header from './Header';

export default function Layout({ children, title = 'Echoes - Timeless Wisdom' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Timeless wisdom from history's greatest thinkers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
} 
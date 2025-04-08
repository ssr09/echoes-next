import '../styles/globals.css';
import { QuotesProvider } from '../context/QuotesContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <QuotesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QuotesProvider>
  );
}

export default MyApp; 
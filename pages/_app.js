import '../styles/globals.css';
import { QuotesProvider } from '../context/QuotesContext';

function MyApp({ Component, pageProps }) {
  return (
    <QuotesProvider>
      <Component {...pageProps} />
    </QuotesProvider>
  );
}

export default MyApp; 
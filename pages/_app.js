import '../styles/globals.css';
import { QuotesProvider } from '../context/QuotesContext';
import { ThemeProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <QuotesProvider>
        <Component {...pageProps} />
      </QuotesProvider>
    </ThemeProvider>
  );
}

export default MyApp; 
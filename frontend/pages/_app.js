import '../globals.css';
import '../styles/dashboard.css';
import '../styles/quoteform.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // If not on /auth and no token, redirect to /auth
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      if (!token && router.pathname !== '/auth') {
        router.replace('/auth');
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;

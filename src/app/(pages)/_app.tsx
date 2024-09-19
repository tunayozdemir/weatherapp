'use client'; // Bu satırı ekleyin

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useApiKey from '../hooks/useApiKey';

function MyApp({ Component, pageProps }: any) {
  const { apiKey } = useApiKey();
  const router = useRouter();

  useEffect(() => {
    if (!apiKey) {
      router.push('/dashboard');
    }
  }, [apiKey, router]);

  return <Component {...pageProps} />;
}

export default MyApp;

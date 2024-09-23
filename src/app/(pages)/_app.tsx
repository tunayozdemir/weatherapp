'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useApiKey from '../hooks/useApiKey'

interface AppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>; // Veya spesifik bir yapı tanımlayabilirsiniz
}


function MyApp({ Component, pageProps }: AppProps) {
  const { apiKey } = useApiKey();
  const router = useRouter();

  useEffect(() => {
    if (!apiKey) {
      router.push('/')
    }
  }, [apiKey, router])

  return <Component {...pageProps} />
}

export default MyApp;

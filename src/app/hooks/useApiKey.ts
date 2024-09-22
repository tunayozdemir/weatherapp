import { useState, useEffect } from 'react'
import ApiKeyContextType from '../types/apiKey'

const useApiKey = (): ApiKeyContextType => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('apiKey')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    }
  }, [])

  return { apiKey, setApiKey }
};

export default useApiKey

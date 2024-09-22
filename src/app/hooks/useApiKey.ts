import { useState, useEffect } from 'react'
import { ApiKeyContextType } from '../types'

const useApiKey = (): ApiKeyContextType => {
  const [apiKey, setApiKey] = useState<string | null>(sessionStorage?.getItem('apiKey'))

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('apiKey')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    }
  }, [])

  return { apiKey, setApiKey }
};

export default useApiKey

import { useState, useEffect } from 'react'
import { configMessages } from '../utils'

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude })
          setIsFetching(false)
        },
        (error) => {
          setIsFetching(false)
          setError(`${configMessages.invalid_Location_Could_Not_Obtained} Detay: ${error.message}`)
        }
      );
    } else {
      setIsFetching(false)
      setError(configMessages.invalid_Borowser_Location_Not_Support)
    }
  }, [])

  return { location, isFetching, error }
};

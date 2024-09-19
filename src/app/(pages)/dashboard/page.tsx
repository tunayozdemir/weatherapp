'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [apiData, setApiData] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('apiKey');

    if (!storedApiKey) {
      router.push('/dashboard');
      return;
    }

    setApiKey(storedApiKey);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(`Konum alınamadı, lütfen izin verin. Detail: ${error.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (location && apiKey) {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              // lat: location.latitude,
              // lon: location.longitude,
              q: 'Turkey',
              appid: apiKey,
              units: 'imperial',
            },
          });

          setApiData(response.data);
        } catch (err) {
          setError('Veri alınamadı.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [location, apiKey]);

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }
  if (error) {
    return (
      <div>{error}</div>
    )
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your API Key: {apiKey}</p>
      {apiData ? (
        <pre>{JSON.stringify(apiData, null, 2)}</pre>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default Dashboard;

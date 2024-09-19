'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import { BsSearch } from 'react-icons/bs';
import { Weater, SelectBox } from '../../components';

const img = 'https://images.unsplash.com/photo-1561470508-fd4df1ed90b2?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [apiData, setApiData] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleChangeLocation = (value: { city: string; district?: string }) => {
    console.log('handleChangeLocation :', value);

    if (apiKey) {
      const fetchData = async () => {
        try {
          // Construct the query based on whether a district is provided
          const query = value.district
            ? `${value.district},${value.city}`
            : value.city;

          const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              q: query,
              appid: apiKey,
              units: 'imperial',
              cnt: 7
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
  };



  return (
    <div>
      <div className='absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-[1]' />
      <Image src={img} layout='fill' alt='img' />
      <div className='relative block justify-between items-center max-w-[500px] w-full m-auto pt-4 text-white z-10'>

        <SelectBox onSelectionChange={handleChangeLocation} />
        {apiData?.main && <Weater data={apiData} />}
      </div>
    </div >

  )
}

export default Dashboard;

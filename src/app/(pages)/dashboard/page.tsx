'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Weater, SelectBox } from '../../components'
import { Tabs } from 'antd'
import axios from 'axios'
import Image from 'next/image'
import L from 'leaflet'

import Bulutlu from '../../assets/image/bulutlu.jpg'

const defaultIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], // iconun boyutu
  iconAnchor: [12, 41], // iconun haritaya sabitlendiği nokta
  popupAnchor: [1, -34], // popup'ın konumlandırılacağı nokta
  shadowSize: [41, 41], // gölgenin boyutu
});

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
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleChangeLocation = (value: { city: string; district?: string }) => {
    if (apiKey) {
      const fetchData = async () => {
        try {
          const query = value.district ? `${value.district},${value.city}` : value.city;

          const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              q: query,
              appid: apiKey,
              units: 'imperial',
              cnt: 7,
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

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;

    if (apiKey) {
      const fetchWeatherByCoordinates = async () => {
        try {
          const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              lat,
              lon: lng,
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
      fetchWeatherByCoordinates();
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-[1]" />
      <Image src={Bulutlu} layout="fill" alt="img" className="object-cover" />
      <div className="relative flex flex-col justify-between items-center w-full m-auto pt-4 text-white z-10">
        <div className="p-4">
          <Tabs
            // tabPosition={'left'}
            defaultActiveKey="2"
            type="card"
            className="active:bg-transparent"
            items={[
              {
                label: 'Manüel Seçim',
                key: '1',
                children: (
                  <div className="p-6 text-white rounded-lg w-screen max-w-[900px] active:bg-transparent">
                    <SelectBox onSelectionChange={handleChangeLocation} />
                    {apiData?.main && <Weater data={apiData} />}
                  </div>
                ),
              },
              {
                label: 'Harita Seçim',
                key: '2',
                children: (
                  <div className="p-6 text-white rounded-lg w-screen max-w-[900px] ">
                    <MapContainer center={[39.9334, 32.8597]} zoom={6} style={{ height: '400px', width: '100%' }} className='rounded-md'>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <MapClickHandler />
                      {location && (
                        <Marker position={[location.latitude, location.longitude]} icon={defaultIcon} />
                      )}
                    </MapContainer>
                    {apiData?.main && <Weater data={apiData} />}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Weater, SelectBox, Background, Loading } from '../../components'
import { Tabs, Button, notification } from 'antd'
import axios from 'axios'
import DefaultIcon from '../../utils/mapIcon'
import { Clear, Clouds, Rain, Drizzle, Thunderstorm, Snow, Mist } from '@/app/assets/image'
import ErrorBoundary from './error'

type PositionType = 'left' | 'top';

const Dashboard: React.FC = () => {

  const router = useRouter();
  const [apiData, setApiData] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [position, setPosition] = useState<PositionType>('top')
  const [selectionReset, setSelectionsReset] = useState<boolean>(false)
  const [backgroundImage, setBackgroundImage] = useState<string | any>()

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
        } catch (err: any) {
          notification.error({
            message: 'Hata',
            description: `Veri alınamadı! Detail: ${err.message}`,
          });
        } finally {
          setLoading(false);
        }
      }
      fetchData()
    }
  }

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
        } catch (err: any) {
          notification.error({
            message: 'Hata',
            description: `Veri alınamadı! Detail: ${err.message}`,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchWeatherByCoordinates();
    }
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  const tabItems = [
    {
      label: 'Manüel Seçim',
      key: '1',
      children: (
        <div className="p-6 text-white rounded-lg w-screen max-w-[900px] active:bg-transparent">
          <SelectBox onSelectionChange={handleChangeLocation} resetSelection={selectionReset} />
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
              <Marker position={[location.latitude, location.longitude]} icon={DefaultIcon} />
            )}
          </MapContainer>

        </div>
      ),
    },
  ]

  const handlePositionChange = () => {
    setPosition((prevPosition) => (prevPosition === 'top' ? 'left' : 'top'));
  }

  const OperationsSlot: Record<PositionType, React.ReactNode> = {
    left: (
      <Button ghost onClick={handlePositionChange} className="tabs-extra-demo-button p-5 border-none pl-0 mb-2">
        Menü Üst
      </Button>
    ),
    top: (
      <Button ghost onClick={handlePositionChange} className="tabs-extra-demo-button p-5 border-none pl-0 ">
        Menü Yan
      </Button>
    ),
  }

  const slot = useMemo(() => {
    return (
      <div className="flex justify-start mr-2">
        {OperationsSlot[position]}
      </div>
    );
  }, [position]);

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('apiKey');
    notification.config({
      placement: 'topRight',
      bottom: 50,
      duration: 5,
    });


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
          notification.error({
            message: 'Hata',
            description: `Veri alınamadı! Detail: ${error.message}`,
          });
          setError(`Konum alınamadı, lütfen izin verin. Detail: ${error.message}`);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }

    if (apiData) {
      const weatherCondition = apiData.weather[0].main;
      switch (weatherCondition) {
        case 'Clear':
          setBackgroundImage(Clear)
          break;
        case 'Clouds':
          setBackgroundImage(Clouds)
          break;
        case 'Rain':
          setBackgroundImage(Rain)
          break;
        case 'Drizzle':
          setBackgroundImage(Drizzle)
          break;
        case 'Thunderstorm':
          setBackgroundImage(Thunderstorm)
          break;
        case 'Snow':
          setBackgroundImage(Snow)
          break;
        case 'Mist':
          setBackgroundImage(Mist)
          break;

        default:
          setBackgroundImage(null)
      }
    }
  }, [router, apiData])

  const handleTabChange = () => {
    setApiData(null);
    setLoading(false);
    setError(null);
    setSelectionsReset(true)
    setTimeout(() => {
      setSelectionsReset(false)
    }, 50);
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorBoundary message={error} />
  }

  return (
    <>
      {
        !loading &&
        <div className="relative w-screen h-screen overflow-hidden">
          {backgroundImage && <Background src={backgroundImage} loading={loading}/>}
          <div className="relative flex flex-col max-w-[900px] items-center w-full m-auto pt-4 text-white z-10 min-h-screen">
            <div className="p-4">
              <Tabs
                tabPosition={position}
                tabBarExtraContent={{ left: slot }}
                defaultActiveKey="1"
                className="active:bg-transparent text-white"
                items={tabItems}
                onChange={handleTabChange}
              />
            </div>
            {apiData?.main && <Weater data={apiData} />}
          </div>
        </div>
      }
    </>
  )
}

export default Dashboard;

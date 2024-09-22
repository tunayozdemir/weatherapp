'use client'

import axios from 'axios'
import ErrorBoundary from './error'
import DefaultIcon from '../../utils/mapIcon'
import clsx from 'clsx'
import { notification } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { configMessages } from '../../utils'
import { Weater, SelectBox, Background, Loading } from '../../components'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Clear, Clouds, Rain, Drizzle, Thunderstorm, Snow, Mist } from '@/app/assets/image'


const Dashboard: React.FC = () => {

  const router = useRouter()
  const [apiData, setApiData] = useState<any>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [selectionReset, setSelectionsReset] = useState<boolean>(false)
  const [backgroundImage, setBackgroundImage] = useState<string | any>()

  const handleChangeLocation = (value: { city: string; district?: string }) => {
    if (apiKey) {
      const fetchData = async () => {
        try {
          const query = value.district ? `${value.district},${value.city}` : value.city

          const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
              q: query,
              appid: apiKey,
              units: 'imperial',
              cnt: 7,
            },
          })

          setApiData(response.data)
        } catch (err: any) {
          notification.error({
            message: 'Hata',
            description: `${configMessages.notification_error_description_data_could_not_retrieved} Detail: ${err.message}`,
          })
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng

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
          })

          setApiData(response.data)
        } catch (err: any) {
          notification.error({
            message: configMessages.notification_error_message,
            description: `${configMessages.notification_error_description_data_could_not_retrieved} ${<br>Detail: {err.message}</br>} `,
          })
        } finally {
          setLoading(false)
        }
      }
      fetchWeatherByCoordinates()
    }
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    })
    return null
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

  useEffect(() => {

    document.title = "Weather | Dashboard"

    const storedApiKey = sessionStorage.getItem('apiKey')
    notification.config({
      placement: 'topRight',
      bottom: 50,
      duration: 5,
    })

    if (!storedApiKey) {
      router.push('/dashboard')
      return
    }

    setApiKey(storedApiKey)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
        },
        (err) => {
          notification.error({
            message: configMessages.notification_error_message,
            description: `${configMessages.invalid_Location_Could_Not_Obtained} ${<br>Detail: {err.message}</br>} `,
          })
          setError(`${configMessages.invalid_Location_Could_Not_Obtained} ${<br>Detail: {err.message}</br>} `)
          setLoading(false)
        }
      )
    } else {
      setError(configMessages.invalid_Borowser_Location_Not_Support)
      setLoading(false)
    }

    if (apiData) {
      const weatherCondition = apiData.weather[0].main
      switch (weatherCondition) {
        case 'Clear':
          setBackgroundImage(Clear)
          break
        case 'Clouds':
          setBackgroundImage(Clouds)
          break
        case 'Rain':
          setBackgroundImage(Rain)
          break
        case 'Drizzle':
          setBackgroundImage(Drizzle)
          break
        case 'Thunderstorm':
          setBackgroundImage(Thunderstorm)
          break
        case 'Snow':
          setBackgroundImage(Snow)
          break
        case 'Mist':
          setBackgroundImage(Mist)
          break

        default:
          setBackgroundImage(null)
      }
    }
  }, [router, apiData])

  const handleTabChange = () => {
    setApiData(null)
    setLoading(false)
    setError(null)
    setSelectionsReset(true)
    setBackgroundImage(null)
    setTimeout(() => {
      setSelectionsReset(false)
    }, 50)
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
          {backgroundImage && <Background src={backgroundImage} loading={loading} />}
          <div className="relative flex flex-col max-w-[900px] items-center w-full m-auto pt-4 text-white z-10 min-h-screen">
            <div className="p-4">
              <TabGroup as="div" className="active:bg-transparent text-white" onChange={handleTabChange}>
                <TabList className="flex">
                  <Tab className={({ selected }) =>
                    clsx(
                      'relative px-4 py-2 text-sm font-medium leading-5 text-white focus-visible:outline-none cursor-pointer',
                      selected ? 'bg-blue-500 rounded-md' : 'cursor-pointer',
                      'before:content-[""] before:absolute before:left-0 before:-bottom-4 before:h-[2px] before:bg-white before:w-0 hover:before:w-full before:transition-all before:duration-600'
                    )
                  }>
                    {configMessages.title_tab_menu[0]}
                  </Tab>
                  <Tab className={({ selected }) =>
                    clsx(
                      'relative px-4 py-2 text-sm font-medium leading-5 text-white focus-visible:outline-none cursor-pointer',
                      selected ? 'bg-blue-500 rounded-md' : 'cursor-pointer',
                      'before:content-[""] before:absolute before:left-0 before:-bottom-4 before:h-[2px] before:bg-white before:w-0 hover:before:w-full before:transition-all before:duration-600'
                    )
                  }>
                    {configMessages.title_tab_menu[1]}
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>{tabItems[0].children}</TabPanel>
                  <TabPanel>{tabItems[1].children}</TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
            {apiData?.main && <Weater data={apiData} />}
          </div>
        </div>
      }
    </>
  )
}

export default Dashboard

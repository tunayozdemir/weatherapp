import React from 'react'
import Image from 'next/image'
import { configMessages } from '../../utils'
import { WeatherData } from '../../types/weather'
import { weatherTranslations } from '../../utils/weatherTranslations'

interface WeatherProps {
  data: WeatherData;
}

const Weather: React.FC<WeatherProps> = ({ data }) => {
  const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * 5 / 9
  const tempInCelsius = fahrenheitToCelsius(data.main.temp)
  const perceivedTemperature = fahrenheitToCelsius(data.main.feels_like)
  const weatherDescription = weatherTranslations[data.weather[0].main] || data.weather[0].main

  const getWindDirection = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) return configMessages.direction_north
    if (degree >= 22.5 && degree < 67.5) return configMessages.direction_northeast
    if (degree >= 67.5 && degree < 112.5) return configMessages.direction_east
    if (degree >= 112.5 && degree < 157.5) return configMessages.direction_southeast
    if (degree >= 157.5 && degree < 202.5) return configMessages.direction_south
    if (degree >= 202.5 && degree < 247.5) return configMessages.direction_southwest
    if (degree >= 247.5 && degree < 292.5) return configMessages.direction_west
    if (degree >= 292.5 && degree < 337.5) return configMessages.direction_northwest
  }

  return (
    <>
      <div className='relative  flex-col justify-between w-full max-w-[500px]  m-aut  text-green-300 z-10'>
        <div className='relative flex justify-between items-center'>
          <div className='flex flex-col items-center'>
            <Image
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt='/'
              width={'100'}
              height={'100'}
            />
            <p className='text-2xl'>{weatherDescription}</p>
          </div>
          <p className='text-9xl mb-0'>{tempInCelsius.toFixed(0)}{configMessages.op_degree}</p>
        </div>
      </div>
      <div className=' bg-black/40 p-8 rounded-md w-full fixed bottom-0'>
        <p className='text-2xl text-center pb-6'>{data.name} {configMessages.title_weather}</p>
        <div className='flex justify-between text-center'>
          <div>
            <p>{configMessages.title_weather_felt}</p>
            <p>{perceivedTemperature.toFixed(0)}{configMessages.op_degree_c}</p>
          </div>
          <div>
            <p>{configMessages.title_weather_felt}</p>
            <p>{data.main.humidity}{configMessages.op_percentage}</p>
          </div>
          <div>
            <p>{configMessages.title_weather_wind}</p>
            <p>{data.wind.speed} {configMessages.op_ms}</p>
          </div>
          <div>
            <p>{configMessages.title_weather_wind_deg}</p>
            <p>{getWindDirection(data.wind.deg)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Weather;

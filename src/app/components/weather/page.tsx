import React from 'react'
import Image from 'next/image';
import { WeatherData } from '../../types/weather';
import { weatherTranslations } from '../../utils/weatherTranslations';

interface WeatherProps {
  data: WeatherData;
}

const Weather: React.FC<WeatherProps> = ({ data }) => {
  const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * 5 / 9;
  const tempInCelsius = fahrenheitToCelsius(data.main.temp);
  const perceivedTemperature = fahrenheitToCelsius(data.main.feels_like);
  const weatherDescription = weatherTranslations[data.weather[0].main] || data.weather[0].main;

  // Rüzgar yönünü dereceye göre yöne çeviren fonksiyon
  const getWindDirection = (degree: number) => {
    if (degree >= 337.5 || degree < 22.5) return 'Kuzey';
    if (degree >= 22.5 && degree < 67.5) return 'Kuzeydoğu';
    if (degree >= 67.5 && degree < 112.5) return 'Doğu';
    if (degree >= 112.5 && degree < 157.5) return 'Güneydoğu';
    if (degree >= 157.5 && degree < 202.5) return 'Güney';
    if (degree >= 202.5 && degree < 247.5) return 'Güneybatı';
    if (degree >= 247.5 && degree < 292.5) return 'Batı';
    if (degree >= 292.5 && degree < 337.5) return 'Kuzeybatı';
  };

  return (
    <>
      <div className='relative flex flex-col justify-between max-w-[500px] w-full m-auto p-4 text-green-300 z-10'>
        <div className='relative flex justify-between pt-12'>
          <div className='flex flex-col items-center'>
            <Image
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt='/'
              width={'100'}
              height={'100'}
            />
            <p className='text-2xl'>{weatherDescription}</p>
          </div>
          <p className='text-9xl mb-0'>{tempInCelsius.toFixed(0)}&#176;</p>
        </div>
      </div>
      <div className='relative bg-black/40 p-8 rounded-md w-full max-w-[900px]'>
        <p className='text-2xl text-center pb-6'>{data.name} Hava Durumu</p>
        <div className='flex justify-between text-center'>
          <div>
            <p>Hissedilen</p>
            <p>{perceivedTemperature.toFixed(0)}&#176;</p>
          </div>
          <div>
            <p>Nem</p>
            <p>{data.main.humidity}%</p>
          </div>
          <div>
            <p>Rüzgar</p>
            <p>{data.wind.speed} m/s</p>
          </div>
          <div>
            <p>Rüzgar Yönü</p>
            <p>{getWindDirection(data.wind.deg)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Weather;

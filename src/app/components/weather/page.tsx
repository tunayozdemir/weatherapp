import React from 'react'
import Image from 'next/image';
import { WeatherData } from '../../types/weather'
import { weatherTranslations } from '../../utils/weatherTranslations'; 


interface WeatherProps {
  data: WeatherData;
}


const Weather: React.FC<WeatherProps> = ({ data }) => {

  console.log('data :', data)
  const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * 5/9;
  const tempInCelsius = fahrenheitToCelsius(data.main.temp);
  const weatherDescription = weatherTranslations[data.weather[0].main] || data.weather[0].main;

  console.log('weatherDescription :', weatherDescription)

  return (
    <div className='relative flex flex-col justify-between max-w-[500px] w-full h-[900vh] m-auto p-4 text-green-300 z-10'>
      <div>
        <div>
          <Image
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt='/'
            width={'100'}
            height={'100'}
          />
          <p>{weatherDescription}</p>
        </div>
        <p>{tempInCelsius.toFixed(0)}&#176;</p>
      </div>
    </div>
  )
}

export default Weather
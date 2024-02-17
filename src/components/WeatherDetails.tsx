import React from 'react';
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

export interface WeatherDetailsProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPresure: string;
  sunrise: string;
  sunset: string;
}
export default function WeatherDetails(props: WeatherDetailsProps) {
  const {
    visability = '25km/h',
    humidity = '61%',
    windSpeed = '7 km/h',
    airPresure = '1012 h/Pa',
    sunrise = '6.20',
    sunset = '18:48',
  } = props;

  return (
    <>
      <SingleWeatherDetails
        information='Visibility'
        icon={<LuEye />}
        value={visability}
      />
      <SingleWeatherDetails
        information='Humidity'
        icon={<FiDroplet />}
        value={humidity}
      />
      <SingleWeatherDetails
        information='Wind speed'
        icon={<MdAir />}
        value={windSpeed}
      />
      <SingleWeatherDetails
        information='Air presure'
        icon={<ImMeter />}
        value={airPresure}
      />
      <SingleWeatherDetails
        information='Sunrise'
        icon={<LuSunrise />}
        value={sunrise}
      />
      <SingleWeatherDetails
        information='Sunset'
        icon={<LuSunset />}
        value={sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}
function SingleWeatherDetails(props: SingleWeatherDetailsProps) {
  return (
    <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
      <p className='whitespace-nowrap'>{props.information}</p>
      <div className='text-3xl'>{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}

'use client';

import Container from '@/components/Container';
import ForcastWeatherDetails from '@/components/ForcastWeatherDetails';
import Navbar from '@/components/Navbar';
import WeatherDetails from '@/components/WeatherDetails';
import WeatherIcon from '@/components/WeatherIcon';
import convertKelvintoCelsius from '@/utils/convertKelvintoCelsius';
import convertWindSpeed from '@/utils/convertWindSpeed';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import { metersToKilometers } from '@/utils/metersToKilometers';
import axios from 'axios';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { useQuery } from 'react-query';
import { placeAtom } from './atom';
import { useEffect } from 'react';

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const [place, _] = useAtom(placeAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    'repoData',
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  console.log(data);

  const uniqueDates = new Set<string>();
  if (data && data.list) {
    data.list.forEach((entry) => {
      if (entry.dt !== undefined) {
        const date = new Date(entry.dt * 1000).toISOString().split('T')[0];
        uniqueDates.add(date);
      }
    });
  }

  const uniqueDatesArray = Array.from(uniqueDates);

  const firstDataForEachDate = uniqueDatesArray
    .map((date) => {
      return data?.list.find((entry) => {
        const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
        const entryTime = new Date(entry.dt * 1000).getHours();
        return entryDate === date && entryTime >= 6;
      });
    })
    .filter((entry) => entry !== undefined);

  const firstData = data?.list[0];
  console.log(firstData);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='animate-bounce'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 bg-gray-100 min-h-screen'>
      <Navbar location={data?.city.name} />
      <main className='px-3 max-w-7xl mx-auto flex flex-col gap-9 pb-10 pt-4'>
        <section className='space-y-4'>
          <div className='space-y-2'>
            <h2 className='flex gap-1 text-2xl items-end'>
              <p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
              <p className='text-lg'>
                ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})
              </p>
            </h2>
            <Container className=' gap-10 px-6 items-center'>
              <div className='flex flex-col px-4'>
                <span className='text-5xl'>
                  {convertKelvintoCelsius(firstData?.main.temp ?? 0)}°
                </span>
                <p className='space-x-1 whitespace-nowrap'>
                  <span>Feels like</span>
                  <span>
                    {convertKelvintoCelsius(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className='text-sm space-x-2'>
                  <span>
                    {convertKelvintoCelsius(firstData?.main.temp_min ?? 0)}°↓
                  </span>

                  <span>
                    {convertKelvintoCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              <div className='flex gap-10 sm:gap-16 justify-between overflow-x-auto w-full pr-3'>
                {data?.list.map((d, index) => (
                  <div
                    key={index}
                    className='flex flex-col justify-evenly gap-2 items-center text-sm'
                  >
                    <p className='whitespace-nowrap'>
                      {format(parseISO(d.dt_txt), 'h:mm a')}
                    </p>
                    <WeatherIcon
                      iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                    />
                    <p>{convertKelvintoCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>

          <div className='flex gap-4'>
            <Container className='w-fit justify-center flex flex-col px-4 items-center'>
              <p className='capilize text-center'>
                {firstData?.weather[0].description}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? '',
                  firstData?.dt_txt ?? ''
                )}
              />
            </Container>
            <Container className='bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto'>
              <WeatherDetails
                visability={metersToKilometers(firstData?.visibility ?? 0)}
                humidity={`${firstData?.main.humidity}%`}
                airPresure={`${firstData?.main.pressure} hPa`}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), 'H:mm')}
                sunset={format(fromUnixTime(data?.city.sunset ?? 0), 'H:mm')}
                windSpeed={`${convertWindSpeed(firstData?.wind.speed ?? 0)}`}
              />
            </Container>
          </div>
        </section>

        <section className='flex w-full flex-col gap-4'>
          <p className='text-2xl'>Forcast (7days)</p>
          {firstDataForEachDate.map((d, index) => (
            <ForcastWeatherDetails
              key={index}
              description={d?.weather[0].description ?? ''}
              weatehrIcon={d?.weather[0].icon ?? '01d'}
              date={format(parseISO(d?.dt_txt ?? ''), 'dd.MM')}
              day={format(parseISO(d?.dt_txt ?? ''), 'EEEE')}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPresure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                'H:mm'
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                'H:mm'
              )}
              visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

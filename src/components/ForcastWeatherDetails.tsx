import convertKelvintoCelsius from '@/utils/convertKelvintoCelsius';
import Container from './Container';
import WeatherDetails, { WeatherDetailsProps } from './WeatherDetails';
import WeatherIcon from './WeatherIcon';

export interface ForcastWeatherDetailsProps extends WeatherDetailsProps {
  weatehrIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}
export default function ForcastWeatherDetails(
  props: ForcastWeatherDetailsProps
) {
  const {
    weatehrIcon,
    date,
    day,
    temp,
    feels_like,
    temp_max,
    temp_min,
    description,
  } = props;
  return (
    <Container className='px-4'>
      <section className='flex gap-4 items-center'>
        <div className='flex flex-col items-center'>
          <WeatherIcon iconName={weatehrIcon} />
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>
        <div className='flex flex-col px-4'>
          <span className='text-5xl'>{convertKelvintoCelsius(temp ?? 0)}</span>
          <p className='text-sm space-x-0 whitespace-nowrap'>
            <span>Feels like</span>
            <span>{convertKelvintoCelsius(feels_like ?? 0)}</span>
          </p>
          <p className='capitalize'>{description}</p>
        </div>
      </section>

      <section className='overflow-x-auto flex justify-between gap-4 w-full pr-10'>
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
}

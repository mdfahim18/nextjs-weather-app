'use client';

import React, { useState } from 'react';
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md';
import SearchBox from './SearchBox';
import axios from 'axios';
import { loadingCityAtom, placeAtom } from '@/app/atom';
import { useAtom } from 'jotai';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

type Props = { location?: string };

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [loading, setLoading] = useAtom(loadingCityAtom);

  const handleInputChange = async (value: string) => {
    setCity(value);

    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestion = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestion);
        setError('');
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value: string) => {
    setCity(value);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (suggestions.length === 0) {
      setError('Location not found');
      setLoading(false);
    } else {
      setError('');
      setTimeout(() => {
        setLoading(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postion) => {
        const { latitude, longitude } = postion.coords;

        try {
          setLoading(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );

          setTimeout(() => {
            setLoading(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoading(false);
        }
      });
    }
  };
  return (
    <>
      <nav className='shadow-sm sticky top-0 z-50 left-0 bg-white'>
        <div className='h-[80px] flex items-center justify-between max-w-7xl px-3 mx-auto'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-gray-500 text-3xl'>Weather</h2>
            <MdWbSunny className='text-3xl mt-1 text-yellow-300' />
          </div>
          <section className='flex gap-2 items-center'>
            <MdMyLocation
              title='your current location'
              onClick={handleCurrentLocation}
              className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'
            />
            <MdOutlineLocationOn className='text-2xl' />
            <p className='text-slate-900/80 text-sm'>{location}</p>
            <div className='relative hidden md:flex'>
              <SearchBox
                value={city}
                onChange={(e) => handleInputChange(e.target.value)}
                onSubmit={handleSubmit}
              />

              <SuggestionBox
                {...{
                  showSuggestions,
                  handleSuggestionClick,
                  suggestions,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>

      <section>
        <div className='relative max-w-7xl px-3 md:hidden'>
          <SearchBox
            value={city}
            onChange={(e) => handleInputChange(e.target.value)}
            onSubmit={handleSubmit}
          />

          <SuggestionBox
            {...{
              showSuggestions,
              handleSuggestionClick,
              suggestions,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

const SuggestionBox = ({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) => {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2'>
          {error && suggestions.length < 1 && (
            <li className='text-red-500 p-1 '> {error}</li>
          )}
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(item)}
              className='cursor-pointer p-1 rounded hover:bg-gray-200'
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  fetchWeather,
  fetchForecast,
  fetchAirPollution,
  fetchCoordinates,
} from './lib/weather';
import { fetchTopHeadlines, fetchNewsByQuery } from './lib/news';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [airPollution, setAirPollution] = useState<any>(null);
  const [pinnedLocations, setPinnedLocations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [newsQuery, setNewsQuery] = useState<string>('');

  useEffect(() => {
    if (city.trim() === '') {
      setWeather(null);
      setForecast(null);
      setAirPollution(null);
      setError(null);
      return;
    }

    async function getWeatherData() {
      try {
        const coordinates = await fetchCoordinates(city);
        const weatherData = await fetchWeather(city);
        const forecastData = await fetchForecast(city);
        const airPollutionData = await fetchAirPollution(coordinates.lat, coordinates.lon);

        setWeather(weatherData);
        setForecast(forecastData);
        setAirPollution(airPollutionData);

        setError(null);
      } catch (error) {
        setError('Failed to fetch weather data');
      }
    }

    getWeatherData();
  }, [city]);

  useEffect(() => {
    async function getNews() {
      try {
        const newsData = newsQuery.trim() === '' ? await fetchTopHeadlines() : await fetchNewsByQuery(newsQuery);
        setNews(newsData.articles);
      } catch (error) {
        console.error('Failed to fetch news data', error);
      }
    }

    getNews();
  }, [newsQuery]);

  const pinLocation = () => {
    if (pinnedLocations.length < 4 && weather) {
      setPinnedLocations([...pinnedLocations, { weather }]);
    }
  };

  const removePinnedLocation = (index: number) => {
    const updatedLocations = [...pinnedLocations];
    updatedLocations.splice(index, 1);
    setPinnedLocations(updatedLocations);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <div className="relative mb-8">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="flex w-full max-w-6xl">
        {/* Left Section - News */}
        <div className="w-1/3 bg-blue-800 p-6 rounded-lg shadow-lg mr-4">
          <h2 className="text-2xl font-bold mb-4">News</h2>
          <input
            type="text"
            value={newsQuery}
            onChange={(e) => setNewsQuery(e.target.value)}
            className="p-2 mb-4 border border-gray-200 rounded-md text-black w-full"
            placeholder="Search news..."
          />
          {news.length > 0 ? (
            <ul className="space-y-4">
              {news.map((article: any, index: number) => (
                <li key={index} className="bg-blue-700 p-4 rounded-md">
                  <h3 className="text-xl font-semibold">{article.title}</h3>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" className="text-blue-300 underline">Read more</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No news available</p>
          )}
        </div>

        {/* Middle Section - Weather */}
        <div className="w-1/3 bg-blue-800 p-6 rounded-lg shadow-lg mx-4">
          <h1 className="text-4xl font-bold mb-4">Weather App</h1>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 mb-4 border border-gray-200 rounded-md text-black w-full"
            placeholder="Enter city"
          />
          {weather && (
            <div className="text-lg">
              <h2 className="text-2xl font-semibold mb-2">{weather.name}</h2>
              <p className="mb-2">{weather.weather[0].description}</p>
              <p className="mb-2">Temperature: {weather.main.temp}°C</p>
              <p className="mb-2">Humidity: {weather.main.humidity}%</p>
              <button
                onClick={pinLocation}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Pin Location
              </button>
            </div>
          )}
          {forecast && (
            <div className="text-lg mt-4">
              <h3 className="text-2xl font-semibold mb-2">3-Hour Forecast</h3>
              <ul className="space-y-2">
                {forecast.list.slice(0, 5).map((entry: any, index: number) => (
                  <li key={index} className="bg-blue-700 p-3 rounded-md">
                    <p>{new Date(entry.dt * 1000).toLocaleTimeString()}</p>
                    <p>{entry.weather[0].description}</p>
                    <p>Temp: {entry.main.temp}°C</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {airPollution && (
            <div className="text-lg mt-4">
              <h3 className="text-2xl font-semibold mb-2">Air Pollution</h3>
              <p>PM2.5: {airPollution.list[0].components.pm2_5} µg/m³</p>
              <p>PM10: {airPollution.list[0].components.pm10} µg/m³</p>
              <p>CO: {airPollution.list[0].components.co} µg/m³</p>
            </div>
          )}
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </div>

        {/* Right Section - Pinned Locations */}
        <div className="w-1/3 bg-blue-800 p-6 rounded-lg shadow-lg ml-4">
          <h2 className="text-2xl font-bold mb-4">Pinned Locations</h2>
          {pinnedLocations.length > 0 ? (
            <ul className="space-y-4">
              {pinnedLocations.map((location, index) => (
                <li key={index} className="bg-blue-700 p-4 rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{location.weather.name}</h3>
                    <p>{location.weather.weather[0].description}</p>
                    <p>Temp: {location.weather.main.temp}°C</p>
                    <p>Humidity: {location.weather.main.humidity}%</p>
                  </div>
                  <button
                    onClick={() => removePinnedLocation(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No pinned locations</p>
          )}
        </div>
      </div>
    </main>
  );
}

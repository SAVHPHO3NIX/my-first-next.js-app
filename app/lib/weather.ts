const API_KEY = '71970633ea8608b20152356cf52faf81';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function fetchWeather(city: string) {
  const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  if (!response.ok) {
    throw new Error('Weather data not available');
  }
  return response.json();
}

export async function fetchForecast(city: string) {
  const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  if (!response.ok) {
    throw new Error('Forecast data not available');
  }
  return response.json();
}

export async function fetchAirPollution(lat: number, lon: number) {
  const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Air pollution data not available');
  }
  return response.json();
}

export async function fetchCoordinates(city: string) {
  const response = await fetch(`${GEO_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Coordinates not available');
  }
  const data = await response.json();
  return {
    lat: data[0].lat,
    lon: data[0].lon,
  };
}

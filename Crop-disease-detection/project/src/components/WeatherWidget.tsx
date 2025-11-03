import { useEffect, useState } from 'react';
import { Cloud, Droplets, ThermometerSun, AlertTriangle } from 'lucide-react';
import './WeatherWidget.css';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  conditions: string;
  risk_factors: {
    high_humidity?: boolean;
    heavy_rainfall?: boolean;
    optimal_for_fungi?: boolean;
  };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      const data = await response.json();

      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const state = data.address.state;
        const country = data.address.country;

        if (city && state) {
          return `${city}, ${state}`;
        } else if (city) {
          return city;
        } else if (state) {
          return state;
        } else if (country) {
          return country;
        }
      }

      return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`
      );
      const data = await response.json();

      if (data.current) {
        const weatherCode = data.current.weather_code;
        const conditions = getWeatherDescription(weatherCode);
        const temperature = Math.round(data.current.temperature_2m);
        const humidity = data.current.relative_humidity_2m;
        const rainfall = data.current.precipitation || 0;

        const highHumidity = humidity > 70;
        const optimalForFungi = humidity > 70 && temperature > 15 && temperature < 30;

        return {
          temperature,
          humidity,
          rainfall,
          conditions,
          risk_factors: {
            high_humidity: highHumidity,
            optimal_for_fungi: optimalForFungi,
          },
        };
      }
    } catch (error) {
      console.error('Weather API error:', error);
    }
    return null;
  };

  const getWeatherDescription = (code: number): string => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  };

  const loadWeatherData = async () => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude);
            const weatherData = await fetchWeatherData(latitude, longitude);

            if (weatherData) {
              setWeather({
                location: locationName,
                ...weatherData,
              });
            } else {
              setWeather({
                location: locationName,
                temperature: 0,
                humidity: 0,
                rainfall: 0,
                conditions: 'Data Unavailable',
                risk_factors: {
                  high_humidity: false,
                  optimal_for_fungi: false,
                },
              });
            }
            setLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocationError('Location access denied');
            setWeather({
              location: 'Location Unavailable',
              temperature: 0,
              humidity: 0,
              rainfall: 0,
              conditions: 'Location Required',
              risk_factors: {
                high_humidity: false,
                optimal_for_fungi: false,
              },
            });
            setLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      } else {
        setLocationError('Geolocation not supported');
        setWeather({
          location: 'Location Not Supported',
          temperature: 0,
          humidity: 0,
          rainfall: 0,
          conditions: 'Location Required',
          risk_factors: {
            high_humidity: false,
            optimal_for_fungi: false,
          },
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
      setLoading(false);
    }
  };

  if (loading || !weather) {
    return null;
  }

  const hasRisks = Object.values(weather.risk_factors).some(Boolean);

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <Cloud size={24} />
        <div>
          <h3>Current Conditions</h3>
          <p>{weather.location}</p>
        </div>
      </div>

      <div className="weather-stats">
        <div className="weather-stat">
          <ThermometerSun size={20} />
          <div>
            <span className="stat-value">{weather.temperature}°C</span>
            <span className="stat-label">Temperature</span>
          </div>
        </div>

        <div className="weather-stat">
          <Droplets size={20} />
          <div>
            <span className="stat-value">{weather.humidity}%</span>
            <span className="stat-label">Humidity</span>
          </div>
        </div>

        <div className="weather-stat">
          <Cloud size={20} />
          <div>
            <span className="stat-value">{weather.rainfall}mm</span>
            <span className="stat-label">Rainfall</span>
          </div>
        </div>
      </div>

      {hasRisks && (
        <div className="weather-risks">
          <div className="risk-header">
            <AlertTriangle size={18} />
            <span>Disease Risk Factors</span>
          </div>
          {weather.risk_factors.high_humidity && (
            <div className="risk-item">High humidity favors fungal growth</div>
          )}
          {weather.risk_factors.heavy_rainfall && (
            <div className="risk-item">Heavy rainfall may spread diseases</div>
          )}
          {weather.risk_factors.optimal_for_fungi && (
            <div className="risk-item">Conditions optimal for fungal diseases</div>
          )}
        </div>
      )}
    </div>
  );
}

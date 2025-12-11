import React, { useState, useEffect } from "react";
import "./styles/App.css";
import TopBar from "./components/TopBar";
import LeftStatusPanel from "./components/LeftStatusPanel";
import HeroWeather from "./components/HeroWeather";
import WeekTimeline from "./components/WeekTimeline";
import RightCityCards from "./components/RightCityCards";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

const OPENWEATHER_API_KEY = "62537757a5cf752d3f4ac98f53d24e34";

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  lat: number;
  lon: number;
}

interface ForecastDay {
  date: string;
  dayName: string;
  temp: number;
  description: string;
  condition: string;
  icon: string;
}

// Mock data for demo purposes when API key is not set
const getMockWeatherData = (
  city: string,
): { current: WeatherData; forecast: ForecastDay[] } => {
  const cities: Record<string, any> = {
    kerala: {
      temp: 29,
      condition: "Rain",
      description: "light rain",
      country: "IN",
      lat: 10.8505,
      lon: 76.2711,
    },
    london: {
      temp: 12,
      condition: "Clouds",
      description: "overcast clouds",
      country: "GB",
      lat: 51.5074,
      lon: -0.1278,
    },
    paris: {
      temp: 15,
      condition: "Clear",
      description: "clear sky",
      country: "FR",
      lat: 48.8566,
      lon: 2.3522,
    },
    "new york": {
      temp: 18,
      condition: "Rain",
      description: "light rain",
      country: "US",
      lat: 40.7128,
      lon: -74.006,
    },
    tokyo: {
      temp: 22,
      condition: "Clear",
      description: "clear sky",
      country: "JP",
      lat: 35.6762,
      lon: 139.6503,
    },
    sydney: {
      temp: 25,
      condition: "Clouds",
      description: "few clouds",
      country: "AU",
      lat: -33.8688,
      lon: 151.2093,
    },
    dubai: {
      temp: 35,
      condition: "Clear",
      description: "clear sky",
      country: "AE",
      lat: 25.2048,
      lon: 55.2708,
    },
    moscow: {
      temp: 5,
      condition: "Snow",
      description: "light snow",
      country: "RU",
      lat: 55.7558,
      lon: 37.6173,
    },
    mumbai: {
      temp: 28,
      condition: "Rain",
      description: "moderate rain",
      country: "IN",
      lat: 19.076,
      lon: 72.8777,
    },
  };

  const cityKey = city.toLowerCase();
  const cityData = cities[cityKey] || cities["kerala"];

  const current: WeatherData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: cityData.country,
    temp: cityData.temp,
    feelsLike: cityData.temp - 2,
    tempMin: cityData.temp - 3,
    tempMax: cityData.temp + 4,
    description: cityData.description,
    condition: cityData.condition,
    humidity: 65,
    windSpeed: 5.5,
    lat: cityData.lat,
    lon: cityData.lon,
  };

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  const today = new Date();

  const forecast: ForecastDay[] = Array.from(
    { length: 7 },
    (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const tempVariation = Math.sin(i) * 5;

      return {
        date: date.toLocaleDateString(),
        dayName: days[date.getDay()],
        temp: Math.round(cityData.temp + tempVariation),
        description: cityData.description,
        condition: cityData.condition,
        icon: "01d",
      };
    },
  );

  return { current, forecast };
};

// Mock data based on coordinates (for geolocation)
const getMockWeatherDataByCoords = (
  lat: number,
  lon: number,
): { current: WeatherData; forecast: ForecastDay[] } => {
  // Determine closest city based on rough coordinates
  let closestCity = "London";

  if (lat > 40 && lat < 50 && lon > -5 && lon < 10)
    closestCity = "Paris";
  else if (lat > 35 && lat < 45 && lon > -80 && lon < -70)
    closestCity = "New York";
  else if (lat > 30 && lat < 40 && lon > 135 && lon < 145)
    closestCity = "Tokyo";
  else if (lat < -30 && lat > -35 && lon > 145 && lon < 155)
    closestCity = "Sydney";
  else if (lat > 20 && lat < 30 && lon > 50 && lon < 60)
    closestCity = "Dubai";
  else if (lat > 50 && lat < 60 && lon > 35 && lon < 40)
    closestCity = "Moscow";
  else if (lat > 15 && lat < 25 && lon > 70 && lon < 75)
    closestCity = "Mumbai";

  return getMockWeatherData(closestCity);
};

const App: React.FC = () => {
  const [currentWeather, setCurrentWeather] =
    useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [recentCities, setRecentCities] = useState<
    WeatherData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      // Check if using placeholder API key - use mock data instead
      if (
        OPENWEATHER_API_KEY ===
          "YOUR_OPENWEATHER_API_KEY_HERE" ||
        !OPENWEATHER_API_KEY
      ) {
        // Simulate API delay
        await new Promise((resolve) =>
          setTimeout(resolve, 800),
        );

        const mockData = getMockWeatherData(city);
        setCurrentWeather(mockData.current);
        setForecast(mockData.forecast);

        // Add to recent cities (max 4)
        setRecentCities((prev) => {
          const filtered = prev.filter(
            (c) => c.city.toLowerCase() !== city.toLowerCase(),
          );
          return [mockData.current, ...filtered].slice(0, 4);
        });

        setLoading(false);
        return;
      }

      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      );

      if (!currentResponse.ok) {
        throw new Error("City not found");
      }

      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      );

      const forecastData = await forecastResponse.json();

      const weather: WeatherData = {
        city: currentData.name,
        country: currentData.sys.country,
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        tempMin: Math.round(currentData.main.temp_min),
        tempMax: Math.round(currentData.main.temp_max),
        description: currentData.weather[0].description,
        condition: currentData.weather[0].main,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      };

      setCurrentWeather(weather);

      // Process forecast data - get daily forecasts
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set<string>();

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString();

        if (
          !processedDates.has(dateString) &&
          dailyForecasts.length < 7
        ) {
          processedDates.add(dateString);
          dailyForecasts.push({
            date: dateString,
            dayName: date.toLocaleDateString("en-US", {
              weekday: "short",
            }),
            temp: Math.round(item.main.temp),
            description: item.weather[0].description,
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          });
        }
      });

      setForecast(dailyForecasts);

      // Add to recent cities (max 4)
      setRecentCities((prev) => {
        const filtered = prev.filter(
          (c) => c.city !== weather.city,
        );
        return [weather, ...filtered].slice(0, 4);
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch weather data",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (
    lat: number,
    lon: number,
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Check if using placeholder API key - use mock data instead
      if (
        OPENWEATHER_API_KEY ===
          "YOUR_OPENWEATHER_API_KEY_HERE" ||
        !OPENWEATHER_API_KEY
      ) {
        // Simulate API delay
        await new Promise((resolve) =>
          setTimeout(resolve, 800),
        );

        const mockData = getMockWeatherDataByCoords(lat, lon);
        setCurrentWeather(mockData.current);
        setForecast(mockData.forecast);

        // Add to recent cities (max 4)
        setRecentCities((prev) => {
          const filtered = prev.filter(
            (c) =>
              c.city.toLowerCase() !==
              mockData.current.city.toLowerCase(),
          );
          return [mockData.current, ...filtered].slice(0, 4);
        });

        setLoading(false);
        return;
      }

      // Fetch current weather by coordinates
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      );

      if (!currentResponse.ok) {
        throw new Error(
          "Unable to fetch weather for your location",
        );
      }

      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      );

      const forecastData = await forecastResponse.json();

      const weather: WeatherData = {
        city: currentData.name,
        country: currentData.sys.country,
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        tempMin: Math.round(currentData.main.temp_min),
        tempMax: Math.round(currentData.main.temp_max),
        description: currentData.weather[0].description,
        condition: currentData.weather[0].main,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      };

      setCurrentWeather(weather);

      // Process forecast data
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set<string>();

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString();

        if (
          !processedDates.has(dateString) &&
          dailyForecasts.length < 7
        ) {
          processedDates.add(dateString);
          dailyForecasts.push({
            date: dateString,
            dayName: date.toLocaleDateString("en-US", {
              weekday: "short",
            }),
            temp: Math.round(item.main.temp),
            description: item.weather[0].description,
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          });
        }
      });

      setForecast(dailyForecasts);

      // Add to recent cities (max 4)
      setRecentCities((prev) => {
        const filtered = prev.filter(
          (c) => c.city !== weather.city,
        );
        return [weather, ...filtered].slice(0, 4);
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch weather data",
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-load Kerala weather on mount
  useEffect(() => {
    fetchWeather("Kerala");
  }, []);

  const handleSearch = (city: string) => {
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  // Get background class based on weather condition
  const getBackgroundClass = () => {
    if (!currentWeather) return "bg-default";

    const condition = currentWeather.condition.toLowerCase();
    if (
      condition.includes("rain") ||
      condition.includes("drizzle")
    )
      return "bg-rainy";
    if (condition.includes("cloud")) return "bg-cloudy";
    if (condition.includes("clear")) return "bg-clear";
    if (
      condition.includes("storm") ||
      condition.includes("thunder")
    )
      return "bg-stormy";
    if (condition.includes("snow")) return "bg-snowy";

    return "bg-default";
  };

  return (
    <div className={`app-container ${getBackgroundClass()}`}>
      <div className="gradient-overlay"></div>
      <div className="corner-decor corner-top-left"></div>
      <div className="corner-decor corner-top-right"></div>
      <div className="corner-decor corner-bottom-left"></div>
      <div className="corner-decor corner-bottom-right"></div>
      <div className="pattern-dots"></div>
      <div className="app-content">
        <div className="main-card">
          <TopBar
            city={currentWeather?.city}
            country={currentWeather?.country}
            onSearch={handleSearch}
          />

          {loading && <Loader />}

          {error && <ErrorMessage message={error} />}

          {!loading && !error && currentWeather && (
            <div className="dashboard-layout">
              <LeftStatusPanel
                temp={currentWeather.temp}
                feelsLike={currentWeather.feelsLike}
                humidity={currentWeather.humidity}
                windSpeed={currentWeather.windSpeed}
                city={currentWeather.city}
                country={currentWeather.country}
                lat={currentWeather.lat}
                lon={currentWeather.lon}
              />

              <div className="center-content">
                <HeroWeather
                  temp={currentWeather.temp}
                  tempMin={currentWeather.tempMin}
                  tempMax={currentWeather.tempMax}
                  description={currentWeather.description}
                  condition={currentWeather.condition}
                />

                <WeekTimeline
                  forecast={forecast}
                  selectedIndex={selectedDayIndex}
                  onSelectDay={setSelectedDayIndex}
                />
              </div>

              <RightCityCards cities={recentCities} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
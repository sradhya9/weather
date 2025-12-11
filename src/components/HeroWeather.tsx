import React from 'react';

interface HeroWeatherProps {
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  condition: string;
}

const HeroWeather: React.FC<HeroWeatherProps> = ({
  temp,
  tempMin,
  tempMax,
  description,
  condition,
}) => {
  const getWeatherIcon = () => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('clear')) return '☀️';
    if (cond.includes('storm') || cond.includes('thunder')) return '⛈️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('mist') || cond.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="hero-weather">
      <div className="hero-content">
        <div className="weather-icon-large">{getWeatherIcon()}</div>
        <div className="temperature-display">
          <span className="temp-main">{temp}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="temp-range">
          <span className="temp-pill temp-min">Min {tempMin}°</span>
          <span className="temp-pill temp-max">Max {tempMax}°</span>
        </div>
        <p className="weather-description">
          {condition} with {description}
        </p>
      </div>
    </div>
  );
};

export default HeroWeather;

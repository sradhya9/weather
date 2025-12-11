import React from 'react';

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

interface RightCityCardsProps {
  cities: WeatherData[];
}

const RightCityCards: React.FC<RightCityCardsProps> = ({ cities }) => {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('clear')) return '☀️';
    if (cond.includes('storm') || cond.includes('thunder')) return '⛈️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('mist') || cond.includes('fog')) return '🌫️';
    return '🌤️';
  };

  if (cities.length === 0) return null;

  return (
    <div className="right-city-cards">
      <div className="cards-header">
        <h3 className="panel-title">Recently Searched</h3>
        <button className="see-all-btn">See All</button>
      </div>

      <div className="city-cards-grid">
        {cities.map((city, index) => (
          <div key={`${city.city}-${index}`} className="city-card">
            <div className="city-card-header">
              <div className="city-info">
                <h4 className="city-name">{city.city}</h4>
                <span className="city-country">{city.country}</span>
              </div>
              <div className="city-icon">{getWeatherIcon(city.condition)}</div>
            </div>

            <div className="city-card-body">
              <div className="city-temp">{city.temp}°C</div>
              <div className="city-condition">{city.condition}</div>
            </div>

            <div className="city-card-footer">
              <div className="city-detail">
                <span className="detail-label">Feels like</span>
                <span className="detail-value">{city.feelsLike}°</span>
              </div>
              <div className="city-detail">
                <span className="detail-label">Range</span>
                <span className="detail-value">{city.tempMin}° - {city.tempMax}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightCityCards;

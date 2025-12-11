import React from 'react';

interface LeftStatusPanelProps {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

const LeftStatusPanel: React.FC<LeftStatusPanelProps> = ({
  temp,
  feelsLike,
  humidity,
  windSpeed,
  city,
  country,
  lat,
  lon,
}) => {
  const getComfortLevel = () => {
    if (temp < 0) return { label: 'Freezing', color: '#4A90E2', level: 1 };
    if (temp < 10) return { label: 'Cold', color: '#7BA3CC', level: 2 };
    if (temp < 20) return { label: 'Cool', color: '#C7B7A3', level: 3 };
    if (temp < 26) return { label: 'Comfortable', color: '#A8D08D', level: 4 };
    if (temp < 32) return { label: 'Warm', color: '#F4B942', level: 4 };
    if (temp < 38) return { label: 'Hot', color: '#E07B39', level: 3 };
    return { label: 'Dangerous', color: '#D64545', level: 2 };
  };

  const comfort = getComfortLevel();

  const getHumidityLevel = () => {
    if (humidity < 30) return 'Low';
    if (humidity < 60) return 'Moderate';
    return 'High';
  };

  const getWindLevel = () => {
    if (windSpeed < 5) return 'Calm';
    if (windSpeed < 15) return 'Moderate';
    if (windSpeed < 25) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="left-status-panel">
      <div className="status-section">
        <h3 className="panel-title">Comfort Status</h3>
        
        <div className="comfort-indicator">
          <div className="comfort-chart">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`chart-bar ${level <= comfort.level ? 'active' : ''}`}
                style={{
                  backgroundColor: level <= comfort.level ? comfort.color : 'rgba(199, 183, 163, 0.2)',
                }}
              />
            ))}
          </div>
          <div className="comfort-label" style={{ color: comfort.color }}>
            {comfort.label}
          </div>
        </div>

        <div className="status-metrics">
          <div className="metric-item">
            <div className="metric-icon">🌡️</div>
            <div className="metric-info">
              <span className="metric-label">Feels Like</span>
              <span className="metric-value">{feelsLike}°C</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">💧</div>
            <div className="metric-info">
              <span className="metric-label">Humidity</span>
              <span className="metric-value">{humidity}% · {getHumidityLevel()}</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon">💨</div>
            <div className="metric-info">
              <span className="metric-label">Wind Speed</span>
              <span className="metric-value">{windSpeed} m/s · {getWindLevel()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="map-section">
        <h3 className="panel-title">Location</h3>
        <div className="map-container">
          <div className="map-circle">
            <div className="map-grid">
              <div className="grid-line horizontal" style={{ top: '33%' }} />
              <div className="grid-line horizontal" style={{ top: '66%' }} />
              <div className="grid-line vertical" style={{ left: '33%' }} />
              <div className="grid-line vertical" style={{ left: '66%' }} />
            </div>
            <div className="location-marker">
              <div className="marker-pulse" />
              <div className="marker-dot" />
            </div>
          </div>
          <div className="map-info">
            <span className="map-city">{city}</span>
            <span className="map-coords">
              {lat.toFixed(2)}°, {lon.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftStatusPanel;

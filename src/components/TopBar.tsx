import React, { useState } from 'react';

interface TopBarProps {
  city?: string;
  country?: string;
  onSearch: (city: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ city, country, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setSearchValue('');
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <h1 className="app-name">WeatherBrew</h1>
        {city && (
          <div className="location-info">
            <span className="location-city">{city}, {country}</span>
            <span className="location-date">{getCurrentDate()}</span>
          </div>
        )}
      </div>

      <div className="top-bar-right">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M13 13L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search city..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopBar;
// src/Weather.js
import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [measurement, setMeasurement] = useState('imperial');
  const [error, setError] = useState(null);

  const apiKey = '749b8ed6c1b6bfd6fd9075d1b0a85d2b';

  const cities = [
    { name: 'London, UK', zip: 'WC2N', country: 'GB' },
    { name: 'New York, US', zip: '10001', country: 'US' },
    { name: 'Tokyo, JP', zip: '100-0001', country: 'JP' },
    { name: 'Paris, FR', zip: '75001', country: 'FR' },
    { name: 'Sydney, AU', zip: '2000', country: 'AU' },
    { name: 'Mumbai, IN', zip: '400001', country: 'IN' },
    { name: 'Beijing, CN', zip: '100000', country: 'CN' },
    { name: 'Cairo, EG', zip: '11511', country: 'EG' },
    { name: 'Toronto, CA', zip: 'M5H', country: 'CA' },
    { name: 'São Paulo, BR', zip: '01000-000', country: 'BR' }
  ];

  const getCurrentWeather = async (zip, country) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&appid=${apiKey}&units=${measurement}`);
      setCurrentWeather(response.data);
      setError(null);
    } catch (error) {
      setError('City not found');
      setCurrentWeather(null);
    }
  };

  const getForecast = async (zip, country) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},${country}&appid=${apiKey}&units=${measurement}`);
      setForecast(response.data);
      setError(null);
    } catch (error) {
      setError('City not found');
      setForecast(null);
    }
  };

  const groupForecastByDate = (forecastList) => {
    const groupedForecast = {};
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!groupedForecast[date]) {
        groupedForecast[date] = [];
      }
      groupedForecast[date].push(item);
    });
    return groupedForecast;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedCity = cities.find(c => c.name === city);
    if (selectedCity) {
      getCurrentWeather(selectedCity.zip, selectedCity.country);
      getForecast(selectedCity.zip, selectedCity.country);
    } else {
      setError('City not found');
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <p>Choose your measurement:</p>
      <select
        value={measurement}
        onChange={(e) => setMeasurement(e.target.value)}
      >
        <option value="imperial">Fahrenheit</option>
        <option value="metric">Celsius</option>
      </select>
      <form onSubmit={handleSubmit}>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select a city</option>
          {cities.map((city, index) => (
            <option key={index} value={city.name}>{city.name}</option>
          ))}
        </select>
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {currentWeather && (
        <div>
          <h2>Current Weather</h2>
          <h3>{city}</h3>
          <p className="currentText">Temperature: {currentWeather.main.temp} {measurement === 'metric' ? '°C' : '°F'}</p>
          <p className="currentText">Feels Like: {currentWeather.main.feels_like} {measurement === 'metric' ? '°C' : '°F'}</p>
          <p className="currentText">Wind Speed: {currentWeather.wind.speed} </p>
          <p className="currentText">Weather: {currentWeather.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt={currentWeather.weather[0].description} />
        </div>
      )}
    {forecast && (
        <div>
          <h2>Upcoming Forecast</h2>
          <div className="forecast-container">
            {Object.entries(groupForecastByDate(forecast.list)).map(([date, items]) => (
              <div key={date} className="forecast-date-group">
                <h3>{date}</h3>
                <div className="forecast-card-container">
                  {items.map((item, index) => (
                    <div className="forecast-card" key={index}>
                      <h4 className="forecast-head-text">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: true })}</h4>
                      <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} />
                      <p className="forecast-text">Temperature: {item.main.temp} {measurement === 'metric' ? '°C' : '°F'}</p>
                      <p className="forecast-text">Weather: {item.weather[0].description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
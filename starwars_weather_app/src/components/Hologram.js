import React, { useState, useEffect, useRef } from 'react';
import './Hologram.css';
import axios from 'axios';

const Hologram = ({ onButtonClick }) => {
  const [showHologram, setShowHologram] = useState(false); // State to control visibility of the box

  const [hyperSpace, setHyperSpace] = useState(false);

  useEffect(() => {
    let timer;
    if (hyperSpace) {
      timer = setTimeout(() => {
        setHyperSpace(false);
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [hyperSpace]);

  const redBoxRef = useRef(null); // Ref to access the box element

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Stop the click event from propagating to the document
    setShowHologram(!showHologram); // Toggle showHologram when the button is clicked
  };

  const handleClickOutside = (event) => {
    if (redBoxRef.current && !redBoxRef.current.contains(event.target)) {
      setShowHologram(false); // Hide the box if the click is outside of it
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []); // Add and remove the event listener on mount and unmount

  const [city, setCity] = useState('Outer Space');  
  const weatherInfoTemplate = {
    temperature: "2.7",
    humidity: "0",
    description: "Space is cold, but atleast there is one good thing. No sand!",
  };
  const [weatherData, setWeatherData] = useState(weatherInfoTemplate); // Incase the city name is typed wrong.

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(`Fetching weather data for ${city}...`);
    setHyperSpace(true);
    onButtonClick();

    try {
      const apiKey = 'API_KEY';
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );

      console.log('Weather data received:', response.data);

      // Extract relevant weather information from the API response
      const weatherInfo = {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].main,
      };

      setWeatherData(weatherInfo);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(weatherInfoTemplate);
      setCity("Planet not found. Current Location: Outer Space")
    }
  };

  return (
    <div className="hologram-container">
      <button className="hologram-button animated" onClick={handleButtonClick}></button>
      <div className={`blue-box ${showHologram ? 'visible' : 'hidden'}`} ref={redBoxRef}>
        <div class='wheather'>
          <h2>Weather Information for {city}</h2>
          <p>Temperature: {weatherData.temperature} Kelvin</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Sky: {weatherData.description}</p>
        </div>
        <div className='travel-container'>
          <form onSubmit={handleSubmit}>
            <h2>Destination:</h2>
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={handleChange}
            />
            <button type="submit">Travel to Location</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hologram;

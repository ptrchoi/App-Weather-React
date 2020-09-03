// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import {
  convertTemp,
  getGoogleLocData,
  fixAddressData,
  getWeatherData,
} from './../Utils';

// COMPONENTS
import Headline from './Headline';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

// Weather COMONENT CLASS
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coords: {
        lat: null,
        lng: null,
      },
      location: {
        city: '',
        country: '',
      },
      weatherObj: null,
      currentTemp: '',
      description: '',
      units: 'F',
      high: '',
      low: '',
      humidity: '',
      uvi: '',
      feelsLike: '',
      precProb: '',
      dayForecast: null,
      hourForecast: null,
    };
  }
  componentDidMount() {
    // Get device geolocation & set location data if available
    this.getLocationFromDevice();
  }
  getLocationFromDevice() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.updateCoords(position.coords.latitude, position.coords.longitude);
      });
    }
  }
  updateCoords = async (lat, lng) => {
    const geoLocData = await getGoogleLocData(lat, lng);

    // Get parsed and formatted address elements from data
    let addressArr = fixAddressData(geoLocData.plus_code.compound_code);

    let location = {
      city: addressArr[1],
      country: addressArr[3],
    };

    this.updateWeather(lat, lng, location);
  };
  updateWeather = async (lat, lng, location) => {
    const wData = await getWeatherData(lat, lng);

    let curData = wData.current;
    let dailyData = wData.daily;

    // Update state with coords received back from wData
    this.setState({
      coords: {
        lat: wData.lat,
        lng: wData.lon,
      },
      location: location,
      weatherObj: wData,
      currentTemp: convertTemp(curData.temp),
      description: curData.weather[0].description,
      high: convertTemp(dailyData[0].temp.max),
      low: convertTemp(dailyData[0].temp.min),
      humidity: curData.humidity,
      uvi: dailyData[0].uvi,
      feelsLike: convertTemp(curData.feels_like),
      precProb: Math.round(dailyData[0].pop * 100),
      dayForecast: dailyData,
      hourForecast: wData.hourly,
    });
  };
  render() {
    let {
      currentTemp,
      description,
      units,
      high,
      low,
      humidity,
      uvi,
      feelsLike,
      precProb,
      dayForecast,
      hourForecast,
    } = this.state;
    // Move this test out of the Render call
    return (
      <div className="weather-container">
        <Headline location={this.state.location} />
        <div className="weather-main-container">
          <p>
            Current Temperature: {currentTemp}&deg; {units}
          </p>
          <p>Current Conditions: {description}</p>
          <p>
            <i className="fas fa-long-arrow-alt-up"></i>
            {high}&deg; {units} <i className="fas fa-long-arrow-alt-down"></i>
            {low}&deg; {units}
          </p>
          <p>
            Feels Like: {feelsLike}&deg; {units}{' '}
          </p>
          <p>{precProb}% chance of precipitation today</p>
        </div>
        <div className="weather-details-container">
          <p>Humidity: {humidity}%</p>
          <p>UV Index: {uvi}</p>
        </div>
        <ForecastDay dayForecast={dayForecast} units={units} />
        <ForecastHour hourForecast={hourForecast} units={units} />
      </div>
    );
  }
}
export default Weather;

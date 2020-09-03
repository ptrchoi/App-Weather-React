// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import {
  convertTemp,
  convertTime,
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
      units: 'F',
      location: {
        city: '',
        country: '',
        coords: {
          lat: null,
          lng: null,
        },
      },
      wMain: {
        currentTime: 0,
        currentTemp: '',
        description: '',
        high: '',
        low: '',
        feelsLike: '',
        precProb: '',
      },
      wDetails: {
        humidity: '',
        uvi: '',
      },
      dayForecast: null,
      hourForecast: null,
    };
  }
  componentDidMount() {
    // Get device geolocation
    this.getCoordsFromDevice();
  }
  getCoordsFromDevice() {
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

    this.updateWeather(lat, lng, addressArr[1], addressArr[3]);
  };
  updateWeather = async (lat, lng, city, country, units = 'F') => {
    const wData = await getWeatherData(lat, lng);

    let curData = wData.current;
    let dailyData = wData.daily;
    let timeArr = convertTime(curData.dt);

    this.setState({
      units: units,
      location: {
        city: city,
        country: country,
        coords: {
          lat: wData.lat,
          lng: wData.lon,
        },
      },
      wMain: {
        currentTime: timeArr.join(''),
        currentTemp: convertTemp(curData.temp, units),
        description: curData.weather[0].description,
        high: convertTemp(dailyData[0].temp.max, units),
        low: convertTemp(dailyData[0].temp.min, units),
        feelsLike: convertTemp(curData.feels_like, units),
        precProb: Math.round(dailyData[0].pop * 100),
      },
      wDetails: {
        humidity: curData.humidity,
        uvi: dailyData[0].uvi,
      },
      dayForecast: dailyData,
      hourForecast: wData.hourly,
    });
  };
  render() {
    let {
      units,
      location,
      wMain,
      wDetails,
      dayForecast,
      hourForecast,
    } = this.state;
    let {
      currentTime,
      currentTemp,
      description,
      high,
      low,
      feelsLike,
      precProb,
    } = wMain;
    let { humidity, uvi } = wDetails;

    return (
      <div className="weather-container">
        <Headline location={location} time={currentTime} />
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

// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import { convertTemp, getWeatherData } from './../Utils';

// COMPONENTS
import Headline from './Headline';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

// Weather COMONENT CLASS
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coords: null,
      location: null,
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
  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.updateWeather(this.props);
    }
  }
  updateWeather = async (appProps) => {
    let coords = appProps.coords;
    let location = appProps.location;

    console.log('updateWeather() - appProps: ', appProps);

    const wData = await getWeatherData(coords.lat, coords.lng);

    let curData = wData.current;
    let dailyData = wData.daily;

    this.setState({
      coords: coords,
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

// LIBRARIES
import React from 'react';
import $ from 'jquery';

// COMPONENTS
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

// LOCAL FUNCTIONS
function getWeatherData(lat, lng) {
  const KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const openWeatherUrl =
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    lat +
    '&lon=' +
    lng +
    '&appid=' +
    KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: openWeatherUrl,
      success: resolve,
      error: reject,
    });
  });
}
function convertTemp(temp) {
  return Math.round((temp * 9) / 5 - 459.67);
}
function convertUnit(tempToConvert, units) {
  if (units === 'F') {
    return Math.round(((tempToConvert - 32) * 5) / 9);
  } else {
    return Math.round((tempToConvert * 9) / 5 + 32);
  }
}

// Weather COMONENT CLASS
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    if (this.props.coords != prevProps.coords) {
      this.updateWeather(this.props.coords);
    }
  }
  updateWeather = async (coords) => {
    const wData = await getWeatherData(coords.lat, coords.lng);

    let curData = wData.current;
    let dailyData = wData.daily;

    this.setState({
      weatherObj: wData,
      currentTemp: convertTemp(curData.temp),
      description: curData.weather[0].description,
      high: convertTemp(dailyData[0].temp.max),
      low: convertTemp(dailyData[0].temp.min),
      humidity: curData.humidity,
      uvi: dailyData[0].uvi,
      feelsLike: convertTemp(curData.feels_like),
      precProb: dailyData[0].pop * 100,
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
        <div>
          <p>
            Current Temperature: {currentTemp}&deg; {units}
          </p>
          <p>Current Conditions: {description}</p>
          <p>
            High: {high}&deg; {units} Low: {low}&deg; {units}
          </p>
          <p>
            Feels Like: {feelsLike}&deg; {units}{' '}
          </p>
          <p>{precProb}% chance of precipitation today</p>
        </div>
        <div>
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

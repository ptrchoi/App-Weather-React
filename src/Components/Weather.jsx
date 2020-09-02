// LIBRARIES
import React from 'react';
import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';

// LOCAL CONSTS
const DAYS_OF_THE_WEEK = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
const FORECAST_DAYS = 7;

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
function convertUnit(tempToConvert, isF) {
  if (isF) {
    return Math.round(((tempToConvert - 32) * 5) / 9);
  } else {
    return Math.round((tempToConvert * 9) / 5 + 32);
  }
}
function setForecastDays(arr, today) {
  // Loop through to fill the array with the days of the week
  for (let i = 0; i < arr.length; i++) {
    if (today < DAYS_OF_THE_WEEK.length - 1) today++;
    else today = 0;

    arr[i].day = DAYS_OF_THE_WEEK[today];
  }
  return arr;
}

// Weather Component Class
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherObj: null,
      currentTemp: '',
      isFarenheit: true,
      high: '',
      low: '',
      humidity: '',
      uvi: '',
      feelsLike: '',
      precProb: '',
      forecast: '',
    };

    this.updateWeather = this.updateWeather.bind(this);
    this.getForecast = this.getForecast.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.coords != prevProps.coords) {
      this.updateWeather(this.props.coords);
    }
  }
  updateWeather = async (coords) => {
    const wData = await getWeatherData(coords.lat, coords.lng);

    let forecast = wData.daily;
    // console.log('forecast: ', forecast);
    this.getForecast(forecast);

    // Pre setup the "pop" data name since it conflicts with the Array pop method
    let pp = wData.daily[0];
    pp = pp.pop * 100;
    pp = pp + '%';

    console.log('updateWeather() - wData: ', wData);

    this.setState({
      weatherObj: wData,
      currentTemp: convertTemp(wData.current.temp),
      high: convertTemp(wData.daily[0].temp.max),
      low: convertTemp(wData.daily[0].temp.min),
      humidity: wData.current.humidity,
      uvi: wData.daily[0].uvi,
      feelsLike: convertTemp(wData.current.feels_like),
      precProb: pp,
    });
  };
  getForecast(forecastData) {
    let forecastArr = [];

    // Create arr of dayObjs populated with forecastData & days of the week
    for (let i = 0; i < FORECAST_DAYS; i++) {
      // Pre setup the "pop" data name since it conflicts with the Array pop method
      let pp = forecastData[i].pop * 100;
      pp = pp + '%';

      let dayObj = {
        day: '',
        temp: convertTemp(forecastData[i].temp.day),
        high: convertTemp(forecastData[i].temp.max),
        low: convertTemp(forecastData[i].temp.min),
        pp: pp,
      };
      forecastArr[i] = dayObj;
    }

    let today = new Date();
    forecastArr = setForecastDays(forecastArr, today.getDay());

    this.setState({
      forecast: forecastArr,
    });

    // console.log('forecastArr: ', forecastArr);
  }
  renderForecast(arr) {
    if (!arr) return;
    console.log('arr: ', arr);
    return arr.map((day) => {
      return (
        <div>
          <br />
          <p>Day: {day.day}</p>
          <p>Temperature: {day.temp}</p>
          <p>High: {day.high}</p>
          <p>Low: {day.low}</p>
          <p>{day.pp} chance of precipitation</p>
          <br />
        </div>
      );
    });
  }
  render() {
    let wDescription = '';
    let units = 'F';

    if (this.state.weatherObj) {
      wDescription = this.state.weatherObj.current.weather[0].description;
    }
    if (!this.state.isFarenheit) units = 'C';

    return (
      <div className="weather-container">
        <div>
          <p>
            Current Temperature: {this.state.currentTemp}&deg; {units}
          </p>
          <p>Current Conditions: {wDescription}</p>
          <p>
            High: {this.state.high} Low: {this.state.low}
          </p>
          <p>Feels Like: {this.state.feelsLike} </p>
          <p>{this.state.precProb} chance of precipitation today</p>
        </div>
        <div>
          <p>Humidity: {this.state.humidity}%</p>
          <p>UV Index: {this.state.uvi}</p>
        </div>
        {this.renderForecast(this.state.forecast)}
      </div>
    );
  }
}
export default Weather;

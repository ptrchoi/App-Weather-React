// LIBRARIES
import React from 'react';
import $ from 'jquery'

// LOCAL FUNCTIONS
function getWeatherData(lat, lng) {
  const KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const openWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
  lat +
  '&lon=' +
  lng +
  '&appid=' + KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: openWeatherUrl,
      success: resolve,
      error: reject
    });
  });
}
function convertTemp(temp) {
  return Math.round(temp * 9 / 5 - 459.67);
}
function convertUnit(tempToConvert, isF) {
	if (isF) {
		return Math.round((tempToConvert - 32) * 5 / 9);
	} else {
		return Math.round(tempToConvert * 9 / 5 + 32);
	}
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
      precProb: ''
    }

    this.updateWeather = this.updateWeather.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.coords != prevProps.coords) {
      this.updateWeather(this.props.coords);
    }
  }
  updateWeather = async (coords) => {
    const wData = await getWeatherData(coords.lat, coords.lng);

    let pp = wData.daily[0];
    pp = pp.pop * 100;
    pp = pp + '%';

    console.log("updateWeather() - wData: ", wData);

    this.setState({
      weatherObj: wData,
      currentTemp: convertTemp(wData.current.temp),
      high: convertTemp(wData.daily[0].temp.max),
      low: convertTemp(wData.daily[0].temp.min),
      humidity: wData.current.humidity,
      uvi: wData.daily[0].uvi,
      feelsLike: convertTemp(wData.current.feels_like),
      precProb: pp
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
      <p>Current Temperature: {this.state.currentTemp}&deg; {units}</p>
      <p>Current Conditions: {wDescription}</p>
      <p>High: {this.state.high} Low: {this.state.low}</p>
      <p>Humidity: {this.state.humidity}%</p>
      <p>UV Index: {this.state.uvi}</p>
      <p>Feels Like: {this.state.feelsLike} </p>
      <p>{this.state.precProb} chance of precipitation today</p>
      </div>
    );
  }
}
export default Weather;
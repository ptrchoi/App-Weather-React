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

// Weather Component Class
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherObj: null
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

    console.log("updateWeather() - wData: ", wData);

    this.setState({
      weatherObj: wData
    });
  }

  render() {
    let wDescription = '';
    if (this.state.weatherObj) {
      // let { description } = this.state.weatherObj.current.weather;
      // console.log("description: ", description);
      wDescription = this.state.weatherObj.current.weather[0].description;
      // console.log("data... : ", this.state.weatherObj.current.weather[0].description);
    }

    return (
      <div>
      <p>Current Conditions: {wDescription}</p>
      </div>
    );
  }
}
export default Weather;
// LIBRARIES
import React from 'react';
import $ from 'jquery';

// UTILITY FUNCTIONS
import {
  convertTemp,
  convertTime,
  getLocDataByCoords,
  getLocDataByCity,
  getAddressFromData,
  getWeatherData,
} from './../Utils';

// COMPONENTS
import C from '../constants';
import Headline from './Headline';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

// Weather COMPONENT CLASS
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      units: 'F',
      location: {
        city: '',
        stateName: '',
        country: '',
        zip: '',
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
      weatherView: 'summary',
      layout: 'mobile',
    };

    this.getCoordsFromDevice = this.getCoordsFromDevice.bind(this);
    this.handleFindLoc = this.handleFindLoc.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.updateUnits = this.updateUnits.bind(this);
    this.swipeContent = this.swipeContent.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateLayout);
  }
  updateLayout() {
    let width = window.innerWidth;
    let layout = 'mobile';

    if (width > C.MOBILE_WIDTH_BREAKPOINT) layout = 'desktop';

    this.setState({
      layout: layout,
    });
  }
  getCoordsFromDevice() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.updateCoords(position.coords.latitude, position.coords.longitude);
      });
    }
  }
  // Async Google Maps API call to get location data by City name
  updateCity = async (city) => {
    const locData = await getLocDataByCity(city);
    const coords = locData.results[0].geometry.location;
    const addrObj = getAddressFromData(locData.results[0].address_components);

    this.updateWeather(coords.lat, coords.lng, addrObj);
  };
  // Async Google Maps API call to get location data by coordinates
  updateCoords = async (lat, lng) => {
    const locData = await getLocDataByCoords(lat, lng);
    const addrObj = getAddressFromData(locData.results[0].address_components);

    this.updateWeather(lat, lng, addrObj);
  };
  // Handle user input - F/C unit button
  updateUnits(e) {
    e.preventDefault();

    let { units, location } = this.state;

    if (units === 'F') units = 'C';
    else units = 'F';

    this.updateWeather(
      location.coords.lat,
      location.coords.lng,
      location,
      units
    );
  }
  // Updates weather based on coordinates or city name updates
  updateWeather = async (lat, lng, address, units = 'F') => {
    const wData = await getWeatherData(lat, lng);

    // console.log('updateWeather() - address: ', address, ' units: ', units);

    let curData = wData.current;
    let dailyData = wData.daily;
    let timeArr = convertTime(curData.dt);

    this.setState({
      units: units,
      location: {
        city: address.city,
        stateName: address.stateName,
        country: address.country,
        zip: address.zip,
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
  handleFindLoc() {
    this.getCoordsFromDevice();
  }
  handleResize(size) {
    if (size === 'compact') {
      $('.forecast-day').removeClass('forecast--expanded');
      $('.forecast-hour').removeClass('forecast--expanded');
    } else {
      $('.forecast-day').addClass('forecast--expanded');
      $('.forecast-hour').addClass('forecast--expanded');
    }
  }
  swipeContent() {
    let { weatherView } = this.state;

    if (weatherView === 'summary') {
      $('.swipes-left').removeClass('swipe-in--right');
      $('.swipes-left').addClass('swipe-out--left');
      $('.swipes-right').removeClass('swipe-out--right');
      $('.swipes-right').addClass('swipe-in--left');

      weatherView = 'details';
    } else {
      $('.swipes-left').removeClass('swipe-out--left');
      $('.swipes-left').addClass('swipe-in--right');
      $('.swipes-right').removeClass('swipe-in--left');
      $('.swipes-right').addClass('swipe-out--right');

      weatherView = 'summary';
    }

    this.setState({
      weatherView: weatherView,
    });
  }
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
      <div className="weather-wrapper">
        <Headline
          location={location}
          time={currentTime}
          onNewCity={this.updateCity}
          onFindLoc={this.handleFindLoc}
        />
        <div className="panels">
          <div className="panel single-panel">
            <div className="weather-main-container">
              <p>
                {currentTemp}&deg; {units}
                <button onClick={this.updateUnits}>
                  <i className="fas fa-temperature-low"></i>
                </button>
              </p>
            </div>
            <div className="weather-summary swipes-left">
              <p>{description}</p>
              <p>
                <i className="fas fa-long-arrow-alt-up"></i>
                {high}&deg; {units}{' '}
                <i className="fas fa-long-arrow-alt-down"></i>
                {low}&deg; {units}
              </p>
              <p>
                Feels Like {feelsLike}&deg; {units}{' '}
              </p>
              <p>
                <i className="fas fa-umbrella"></i> {precProb}%
              </p>
              <button className="tempButton" onClick={this.swipeContent}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="weather-details swipes-right ">
              <p>Humidity: {humidity}%</p>
              <p>UV Index: {uvi}</p>
              <button className="tempButton" onClick={this.swipeContent}>
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
            <div className="forecast-day swipes-left">
              <ForecastDay
                dayForecast={dayForecast}
                units={units}
                onResize={this.handleResize}
              />
            </div>
            <div className="forecast-hour swipes-right ">
              <ForecastHour
                hourForecast={hourForecast}
                units={units}
                onResize={this.handleResize}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Weather;

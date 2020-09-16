// LIBRARIES
import React from 'react';

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
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

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
    this.updateUnits = this.updateUnits.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.renderLayout = this.renderLayout.bind(this);
  }
  componentDidMount() {
    // Set initial layout
    this.updateLayout();
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
  updateUnits() {
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
  renderLayout() {
    let {
      units,
      wMain,
      wDetails,
      dayForecast,
      hourForecast,
      layout,
    } = this.state;

    if (layout === 'mobile') {
      return (
        <MobileLayout
          units={units}
          wMain={wMain}
          wDetails={wDetails}
          dayForecast={dayForecast}
          hourForecast={hourForecast}
          onUnitsChanged={this.updateUnits}
        />
      );
    } else {
      return (
        <DesktopLayout
          units={units}
          wMain={wMain}
          wDetails={wDetails}
          dayForecast={dayForecast}
          hourForecast={hourForecast}
          onUnitsChanged={this.updateUnits}
        />
      );
    }
  }
  render() {
    let { location, wMain, layout } = this.state;

    return (
      <div className="weather-container">
        <Headline
          location={location}
          time={wMain.currentTime}
          onNewCity={this.updateCity}
          onFindLoc={this.handleFindLoc}
        />
        {this.renderLayout({ layout })}
      </div>
    );
  }
}
export default Weather;

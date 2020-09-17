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
        iconCode: '',
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

    this.updateWeatherData(coords.lat, coords.lng, addrObj);
  };
  // Async Google Maps API call to get location data by coordinates
  updateCoords = async (lat, lng) => {
    const locData = await getLocDataByCoords(lat, lng);
    const addrObj = getAddressFromData(locData.results[0].address_components);

    this.updateWeatherData(lat, lng, addrObj);
  };
  // Handle user input from child component - F/C unit button
  updateUnits() {
    let { units, wMain } = this.state;
    let {
      currentTime,
      currentTemp,
      description,
      iconCode,
      high,
      low,
      feelsLike,
      precProb,
    } = wMain;

    units === 'F' ? (units = 'C') : (units = 'F');

    this.setState({
      units: units,
      wMain: {
        currenTime: currentTime,
        currentTemp: convertTemp(currentTemp, units),
        description: description,
        iconCode: iconCode,
        high: convertTemp(high, units),
        low: convertTemp(low, units),
        feelsLike: convertTemp(feelsLike, units),
        precProb: precProb,
      },
    });
  }
  // Updates weather based on coordinates or city name updates
  updateWeatherData = async (lat, lng, address) => {
    const wData = await getWeatherData(lat, lng);

    // console.log('updateWeatherData() - address: ', address, ' units: ', units);

    let curData = wData.current;
    let dailyData = wData.daily;
    let timeArr = convertTime(curData.dt);

    this.setState({
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
        currentTemp: Math.round(curData.temp),
        description: curData.weather[0].description,
        iconCode: curData.weather[0].id,
        high: Math.round(dailyData[0].temp.max),
        low: Math.round(dailyData[0].temp.min),
        feelsLike: Math.round(curData.feels_like),
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

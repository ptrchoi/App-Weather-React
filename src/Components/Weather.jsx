// LIBRARIES
import React from 'react';
import $ from 'jquery';

// UTILITY FUNCTIONS
import {
  convertTemp,
  formatTemp,
  convertTime,
  convertMetersToMiles,
  convertPressureToInches,
  getCardinalDirection,
  getLocDataByCoords,
  getLocDataByCity,
  getAddressFromData,
  getWeatherData,
} from './../Utils';

// COMPONENTS
import C from '../constants';
import Heading from './Heading';
import Main from './Main';

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
        dewPt: 0,
        pressure: 0,
        uvi: '',
        visibility: 0,
        windSpeed: 0,
        windDeg: 0,
        sunrise: 0,
        sunset: 0,
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
  }
  componentDidMount() {
    // Set initial layout
    this.updateLayout();
    window.addEventListener('resize', this.updateLayout);

    // Temporarily comment out when in dev mode to reduce # of API calls
    this.getCoordsFromDevice();
  }
  updateLayout() {
    let layout = 'mobile';
    let width = $(window).width();
    let height = $(window).height();

    if (
      width > C.MOBILE_WIDTH_BREAKPOINT &&
      height > C.MOBILE_HEIGHT_BREAKPOINT
    )
      layout = 'desktop';

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
    let { units, wMain, wDetails } = this.state;
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
    let {
      humidity,
      dewPt,
      pressure,
      uvi,
      visibility,
      windSpeed,
      windDeg,
      sunrise,
      sunset,
    } = wDetails;

    units === 'F' ? (units = 'C') : (units = 'F');

    this.setState({
      units: units,
      wMain: {
        currentTime: currentTime,
        currentTemp: convertTemp(currentTemp, units),
        description: description,
        iconCode: iconCode,
        high: convertTemp(high, units),
        low: convertTemp(low, units),
        feelsLike: convertTemp(feelsLike, units),
        precProb: precProb,
      },
      wDetails: {
        humidity: humidity,
        dewPt: convertTemp(dewPt, units),
        pressure: pressure,
        uvi: uvi,
        visibility: visibility,
        windSpeed: windSpeed,
        windDeg: windDeg,
        sunrise: sunrise,
        sunset: sunset,
      },
    });
  }
  // Updates weather based on coordinates or city name updates
  updateWeatherData = async (lat, lng, address) => {
    const wData = await getWeatherData(lat, lng);

    let { units } = this.state;
    let curData = wData.current;
    let dailyData = wData.daily;
    let timeArr = convertTime(curData.dt);

    this.loadBgImage(address, curData.weather[0].description);

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
        currentTemp: formatTemp(curData.temp, units),
        description: curData.weather[0].description,
        iconCode: curData.weather[0].id,
        high: formatTemp(dailyData[0].temp.max, units),
        low: formatTemp(dailyData[0].temp.min, units),
        feelsLike: formatTemp(curData.feels_like, units),
        precProb: Math.round(dailyData[0].pop * 100),
      },
      wDetails: {
        humidity: curData.humidity,
        dewPt: formatTemp(curData.dew_point, units),
        pressure: convertPressureToInches(curData.pressure),
        uvi: Math.round(curData.uvi),
        visibility: convertMetersToMiles(curData.visibility),
        windSpeed: curData.wind_speed.toFixed(1),
        windDeg: getCardinalDirection(curData.wind_deg),
        sunrise: convertTime(curData.sunrise).join(''),
        sunset: convertTime(curData.sunset).join(''),
      },
      dayForecast: dailyData,
      hourForecast: wData.hourly,
    });
  };
  handleFindLoc() {
    this.getCoordsFromDevice();
  }
  // Default location & description values as a safety in case of null or undefined args
  loadBgImage(
    location = { city: 'San Francisco', stateName: 'CA' },
    description = 'scenic+sunshine'
  ) {
    let city = location.city;
    let state = location.stateName;

    city = city.split(' ').join('+');
    state = state.split(' ').join('+');
    description = description.split(' ').join('+');

    let searchStr = description + '+' + city + '+' + state;

    let url =
      'https://source.unsplash.com/random/featured/?' +
      searchStr +
      '/?sig=' +
      Math.floor(Math.random() * 1000);

    // Assign style props to main app container + background image
    let bgEl = document.getElementsByClassName('app-container')[0];
    let bgElStyle = {
      background: `url(${url})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    };

    Object.assign(bgEl.style, bgElStyle);
  }

  render() {
    let {
      units,
      location,
      wMain,
      wDetails,
      dayForecast,
      hourForecast,
      layout,
    } = this.state;

    return (
      <div className="weather-container">
        <Heading
          location={location}
          time={wMain.currentTime}
          description={wMain.description}
          onNewCity={this.updateCity}
          onFindLoc={this.handleFindLoc}
          layout={layout}
        />
        <Main
          units={units}
          wMain={wMain}
          wDetails={wDetails}
          dayForecast={dayForecast}
          hourForecast={hourForecast}
          layout={layout}
          onUnitsChanged={this.updateUnits}
        />
      </div>
    );
  }
}
export default Weather;

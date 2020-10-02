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

function getImageProps(url) {
  return {
    background: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
  };
}

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
      curImgUrl: '',
      bgElement: null,
    };

    this.getCoordsFromDevice = this.getCoordsFromDevice.bind(this);
    this.handleFindLoc = this.handleFindLoc.bind(this);
    this.updateUnits = this.updateUnits.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.loadBgImage = this.loadBgImage.bind(this);
    // this.reloadBgImage = this.reloadBgImage.bind(this);
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

    // If width > breakpoint && portrait orientation, then layout should be desktop
    if (
      window.innerWidth > C.MOBILE_WIDTH_BREAKPOINT &&
      window.matchMedia('(orientation: portrait)').matches
    )
      layout = 'desktop';

    // Reload bg image if one is already loaded and the layout has changed, to ensure the bg image dimensions match the updated layout
    // if (this.state.bgElement !== null && this.state.curImgUrl !== '')
    //   this.reloadBgImage();

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

    // console.log('updateWeatherData() - address: ', address, ' units: ', units);

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
  loadBgImage(location, description) {
    let city = location.city;
    let state = location.stateName;
    let searchStr = 'scenic+sunshine+clouds';

    if (city && state && description) {
      city = city.split(' ').join('+');
      state = state.split(' ').join('+');
      description = description.split(' ').join('+');

      searchStr = description + '+' + city + '+' + state;
    } else {
      console.log(
        'WARNING: loadBgImage() - (city || state || description) = false '
      );
      return;
    }
    console.log('loadBgImage() - searchStr: ', searchStr);

    let url =
      'https://source.unsplash.com/random/featured/?' +
      searchStr +
      '/?sig=' +
      Math.floor(Math.random() * 1000);

    let bgEl = document.getElementsByClassName('app-container')[0];
    Object.assign(bgEl.style, getImageProps(url));

    this.setState({
      curImgUrl: url,
      bgElement: bgEl,
    });
  }
  // reloadBgImage() {
  //   let { curImgUrl, bgElement } = this.state;

  //   // console.log('reloadBgImage() - bgElement: ', bgElement);

  //   if (bgElement !== null && curImgUrl !== '') {
  //     if (window.matchMedia('(orientation: landscape)').matches) {
  //       Object.assign(bgElement.style, getImageProps(curImgUrl, true));
  //     } else {
  //       Object.assign(bgElement.style, getImageProps(curImgUrl));
  //     }
  //   } else {
  //     console.log(
  //       'WARNING: reloadBgImage - there is not a curImgUrl or bgElement'
  //     );
  //   }
  // }

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

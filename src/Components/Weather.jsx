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
  getGoogleCityAutofill,
  getWeatherData,
} from './../Utils';

// COMPONENTS
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
    };

    this.getCoordsFromDevice = this.getCoordsFromDevice.bind(this);
    this.handleFindLoc = this.handleFindLoc.bind(this);
    this.updateUnits = this.updateUnits.bind(this);
    this.swipeContent = this.swipeContent.bind(this);
  }
  componentDidMount() {
    // Get device geolocation
    // this.getCoordsFromDevice();
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
  swipeContent() {
    let { weatherView } = this.state;

    // let summaryDivs = $('.summary-div');
    // let detailsDivs = $('.details-div');
    let s1 = $('#summary1');
    let s2 = $('#summary2');
    let d1 = $('#details1');
    let d2 = $('#details2');

    // console.log('summaryDivs: ', summaryDivs);
    // console.log('detailsDivs: ', detailsDivs);

    if (weatherView === 'summary') {
      // console.log('swapping from Summary to Details');
      // console.log('summaryDivs[0]: ', summaryDivs[0]);
      // console.log('summaryDivs[1]: ', summaryDivs[1]);
      // console.log('detailsDivs[0]: ', detailsDivs[0]);
      // console.log('detailsDivs[1]: ', detailsDivs[1]);

      // summaryDivs[0].removeClass('swipe-in--right');
      // summaryDivs[1].removeClass('swipe-in--right');
      // summaryDivs[0].addClass('swipe-out--left');
      // summaryDivs[1].addClass('swipe-out--left');

      // detailsDivs[0].removeClass('swipe-out--right');
      // detailsDivs[1].removeClass('swipe-out--right');
      // detailsDivs[0].addClass('swipe-in--left');
      // detailsDivs[1].addClass('swipe-in--left');

      // summaryDivs.forEach((el) => {
      //   el.removeClass('swipe-in--right');
      //   el.addClass('swipe-out--left');
      // });
      // detailsDivs.forEach((el) => {
      //   el.removeClass('swipe-out--right');
      //   el.addClass('swipe-in--left');
      // });

      // console.log('s1: ', s1);
      // console.log('s2: ', s2);
      // console.log('d1: ', d1);
      // console.log('d2: ', d2);

      s1.removeClass('swipe-in--right');
      s2.removeClass('swipe-in--right');
      s1.addClass('swipe-out--left');
      s2.addClass('swipe-out--left');

      d1.removeClass('swipe-out--right');
      d2.removeClass('swipe-out--right');
      d1.addClass('swipe-in--left');
      d2.addClass('swipe-in--left');

      weatherView = 'details';
    } else {
      // console.log('swapping from Details to Summary');

      // summaryDivs[0].removeClass('swipe-out--left');
      // summaryDivs[1].removeClass('swipe-out--left');
      // summaryDivs[0].addClass('swipe-in--right');
      // summaryDivs[1].addClass('swipe-in--right');

      // detailsDivs[0].removeClass('swipe-in--left');
      // detailsDivs[1].removeClass('swipe-in--left');
      // detailsDivs[0].addClass('swipe-out--right');
      // detailsDivs[1].addClass('swipe-out--right');

      // summaryDivs.forEach((el) => {
      //   el.removeClass('swipe-out--left');
      //   el.addClass('swipe-in--right');
      // });
      // detailsDivs.forEach((el) => {
      //   el.removeClass('swipe-in--left');
      //   el.addClass('swipe-out--right');
      // });

      // console.log('s1: ', s1);
      // console.log('s2: ', s2);
      // console.log('d1: ', d1);
      // console.log('d2: ', d2);

      s1.removeClass('swipe-out--left');
      s2.removeClass('swipe-out--left');
      s1.addClass('swipe-in--right');
      s2.addClass('swipe-in--right');

      d1.removeClass('swipe-in--left');
      d2.removeClass('swipe-in--left');
      d1.addClass('swipe-out--right');
      d2.addClass('swipe-out--right');

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
      <div className="weather-container">
        <Headline
          location={location}
          time={currentTime}
          onNewCity={this.updateCity}
          onFindLoc={this.handleFindLoc}
        />
        <div className="weather-main-container">
          <p>
            {currentTemp}&deg; {units}
            <button onClick={this.updateUnits}>
              <i className="fas fa-temperature-low"></i>
            </button>
          </p>
        </div>
        <div id="summary1" className="weather-summary-container summary-div">
          <p>{description}</p>
          <p>
            <i className="fas fa-long-arrow-alt-up"></i>
            {high}&deg; {units} <i className="fas fa-long-arrow-alt-down"></i>
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
        <div id="details1" className="weather-details-container details-div">
          <p>Humidity: {humidity}%</p>
          <p>UV Index: {uvi}</p>
          <button className="tempButton" onClick={this.swipeContent}>
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        <div
          id="summary2"
          className="weather-day-fc-compact-container summary-div"
        >
          <ForecastDay dayForecast={dayForecast} units={units} />
        </div>
        <div
          id="details2"
          className="weather-hour-fc-compact-container details-div"
        >
          <ForecastHour hourForecast={hourForecast} units={units} />
        </div>
      </div>
    );
  }
}
export default Weather;

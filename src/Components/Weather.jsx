// LIBRARIES
import React from 'react';
import Autosuggest from 'react-autosuggest';

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

// LOCAL FUNCTIONS
/* getSuggestionValue() automatically called by Autosuggest: this req'd function teaches Autosuggest what the input value should be when a suggestion value is highlighted. Here, we're simply passing the suggestion string back as the input value. */
const handleSuggestion = (suggestion) => {
  return suggestion;
};

// Automatically called by Autosuggest: Tells Autosuggest how to render suggestions
const renderSuggestion = (suggestion) => {
  return <div className="renderSuggestionDiv">{suggestion}</div>;
};

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
      search: {
        value: '',
        citySuggestions: [],
      },
    };

    this.onChange = this.onChange.bind(this);
    this.getCoordsFromDevice = this.getCoordsFromDevice.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.handleFindLoc = this.handleFindLoc.bind(this);
    this.updateUnits = this.updateUnits.bind(this);
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
  // Automatically called by Autosuggest's onChange event
  onChange = (event, { newValue }) => {
    this.setState({
      search: {
        value: newValue,
        citySuggestions: [],
      },
    });
  };
  // Automatically called by Autosuggest's input event;
  // Async call to Wikipedia API to get suggestions for dropdown list
  onSuggestionsFetchRequested = async ({ value }) => {
    // const suggestions = await getWikiSuggestions(value);
    const autofillData = await getGoogleCityAutofill(value);

    let citySuggestions = autofillData.predictions.map((el) => {
      return el.description;
    });

    this.setState({
      search: {
        value: value,
        citySuggestions: citySuggestions,
      },
    });
  };
  // Automatically called by Autosuggest's input clear event
  onSuggestionsClearRequested = () => {
    this.setState({
      search: {
        value: '',
        citySuggestions: [],
      },
    });
  };
  // Optional Autosuggest function: called on selection event (mouse/keyboard/touch) from list; suggestion obj comes from Autosuggest's req'd `handleSuggestion()` method.
  onSuggestionSelected = (e, suggestion) => {
    this.updateCity(suggestion.suggestion); //Pass in only the suggestion obj's suggestion string
  };
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
  handleFindLoc(e) {
    e.preventDefault();

    this.getCoordsFromDevice();
  }
  render() {
    let {
      units,
      location,
      wMain,
      wDetails,
      dayForecast,
      hourForecast,
      search,
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
    let { value, citySuggestions } = search;

    // Required by Autosuggest
    // type=search is optional, defaults to type=text
    const inputProps = {
      placeholder: 'Enter City or ZIP code',
      value,
      onChange: this.onChange,
      type: 'search',
    };

    return (
      <div className="weather-container">
        <div>
          <button onClick={this.handleFindLoc}>
            <i className="fas fa-crosshairs"></i>
          </button>
          <Autosuggest
            suggestions={citySuggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={handleSuggestion}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
        <Headline location={location} time={currentTime} />
        <div className="weather-main-container">
          <p>
            {currentTemp}&deg; {units}
            <button onClick={this.updateUnits}>
              <i className="fas fa-temperature-low"></i>
            </button>
          </p>
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
        </div>
        <div className="weather-details-container">
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

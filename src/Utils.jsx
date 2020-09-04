// LIBRARIES
import $ from 'jquery';

/* MISC UTILITY FUNCTIONS
----------------------------------------------------------------------*/
// Convert from Farenheit to Celcius or just round off the Farenheit value
export const convertTemp = (temp, units) => {
  if (units === 'C') return Math.round((temp * 9) / 5 + 32);
  else return Math.round(temp);
};

// Convert Unix timestamp (from Open Weather data) to hour, mins, and daytime (AM/PM)
export const convertTime = (unixTime) => {
  // Convert to milliseconds and get new dateObj
  let dateObj = new Date(unixTime * 1000);
  let hour = dateObj.getHours();
  let mins = dateObj.getMinutes();
  let daytime = 'AM';

  if (hour >= 12) {
    if (hour > 12) hour = hour - 12;
    daytime = 'PM';
  } else if (hour === 0) hour = 12;

  return [hour, ':', mins, daytime];
};

// Parse Google geolocation address data and output to array of string address elements ([street, city, state, country])
export const fixAddressData = (addressCode) => {
  // Split string into array of address strings
  let arr = addressCode.split(' ');

  // Then split each string element into an array of chars
  arr = arr.map((el) => el.split(''));

  // Remove any commas from each char array within the array
  arr = arr.map((charArr) => {
    if (charArr.includes(',')) {
      let index = charArr.findIndex((ch) => ch === ',');
      charArr.splice(index, 1);
    }
    // Convert charArr's back to strings
    let str = charArr.join('');

    return str;
  });
  return arr;
};

/* API FUNCTIONS
----------------------------------------------------------------------*/
// GOOGLE GEOLOCATION API - Location based on Coords
export const getGoogleLocData = (lat, lng) => {
  const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const googleUrl =
    'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
    lat +
    ',' +
    lng +
    '&key=' +
    KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: googleUrl,
      success: resolve,
      error: reject,
    });
  });
};
// GOOGLE GEOLOCATION API - Search City Results
export const getGoogleLocSearchResults = (cityName) => {
  const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const proxyUrl = 'https://radiant-hollows-05386.herokuapp.com/'; // "Middleware" CORS solution via custom Heroku deployed server (ie. cors-anywhere.com)

  const googleUrl =
    'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
    cityName +
    '&key=' +
    KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: proxyUrl + googleUrl,
      success: resolve,
      error: reject,
    });
  });
};

// OPEN WEATHER API - One Call Weather + Forecast
export const getWeatherData = (lat, lng) => {
  const KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const openWeatherUrl =
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    lat +
    '&lon=' +
    lng +
    '&units=imperial' +
    '&appid=' +
    KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: openWeatherUrl,
      success: resolve,
      error: reject,
    });
  });
};

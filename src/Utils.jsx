// LIBRARIES
import $ from 'jquery';

/* MISC UTILITY FUNCTIONS
----------------------------------------------------------------------*/
// Convert from Farenheit to Celcius or just round off the (default) Farenheit value
export const convertTemp = (temp, units) => {
  if (units === 'C') return Math.round(((temp - 32) * 5) / 9);
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

  if (mins < 10) mins = '0' + mins;

  return [hour, ':', mins, ' ', daytime];
};

// Parses Google Loc Data and returns an object with filtered address components
export const getAddressFromData = (arr) => {
  let city,
    stateName,
    country,
    zip = '';

  arr.forEach((el) => {
    if (el.types[0] === 'locality') city = el.short_name;
    else if (el.types[0] === 'administrative_area_level_1')
      stateName = el.short_name;
    else if (el.types[0] === 'country') country = el.short_name;
    else if (el.types[0] === 'postal_code') zip = el.short_name;
  });

  return {
    city: city,
    stateName: stateName,
    country: country,
    zip: zip,
  };
};

/* GOOGLE API FUNCTIONS
----------------------------------------------------------------------*/
// GOOGLE GEOLOCATION API - Location data
function getGoogleLocData(url) {
  const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const googleUrl = url + '&key=' + KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: googleUrl,
      success: resolve,
      error: reject,
    });
  });
}
export const getLocDataByCoords = (lat, lng) => {
  let url =
    'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
    lat +
    ',' +
    lng;

  return getGoogleLocData(url);
};
export const getLocDataByCity = (city) => {
  let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city;

  return getGoogleLocData(url);
};

// GOOGLE GEOLOCATION API - Search Autofill Results
export const getGoogleCityAutofill = (string) => {
  const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const proxyUrl = 'https://radiant-hollows-05386.herokuapp.com/'; // "Middleware" CORS solution via custom Heroku deployed server (ie. cors-anywhere.com)

  const googleUrl =
    'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +
    string +
    '&types=(regions)' +
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

/* OPEN WEATHER API FUNCTIONS
----------------------------------------------------------------------*/
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

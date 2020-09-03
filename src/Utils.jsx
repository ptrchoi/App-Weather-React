// LIBRARIES
import $ from 'jquery';

/* MISC UTILITY FUNCTIONS
----------------------------------------------------------------------*/
// Convert standard Open Weather temperature measure to Farenheit
export const convertTemp = (temp) => {
  return Math.round((temp * 9) / 5 - 459.67);
};

// Convert given temperature from one unit to the other (F or C)
export const convertUnit = (tempToConvert, units) => {
  if (units === 'F') {
    return Math.round(((tempToConvert - 32) * 5) / 9);
  } else {
    return Math.round((tempToConvert * 9) / 5 + 32);
  }
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

  return {
    hour: hour,
    mins: mins,
    daytime: daytime,
  };
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
// GOOGLE GEOLOCATION API
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

// OPEN WEATHER API
export const getWeatherData = (lat, lng) => {
  const KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const openWeatherUrl =
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    lat +
    '&lon=' +
    lng +
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

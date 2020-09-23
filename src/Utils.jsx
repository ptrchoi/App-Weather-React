// LIBRARIES
import $ from 'jquery';

/* MISC UTILITY FUNCTIONS
----------------------------------------------------------------------*/
// Convert only if units are Celcius; if units are F, just round off the (default) Farenheit value
export const formatTemp = (temp, units) => {
  return units === 'C' ? Math.round(((temp - 32) * 5) / 9) : Math.round(temp);
};

// Convert from either Imperial or Metric to the other
export const convertTemp = (temp, units) => {
  return units === 'C'
    ? Math.round(((temp - 32) * 5) / 9)
    : Math.round((temp * 9) / 5 + 32);
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

export const convertPressureToInches = (hpa) => {
  return Math.round(hpa * 0.03);
};

// Convert meters to miles
export const convertMetersToMiles = (distance) => {
  return (distance / 1609).toFixed(1);
};

// Convert percent to RGB Alpha decimal value for Rain icon transparency
// export const getRainIconStyling = (percent) => {
//   // Need to make some adjustment so low %'s are still opaque enough to be legible
//   if (percent > 0 && percent < 70) percent += 10;
//   percent = percent / 100;

//   let str = 'rgba(34, 185, 185, ' + percent + ')'; // rain color set for all probability icon

//   return {
//     WebkitTextFillColor: str,
//     WebkitTextStrokeWidth: '1px',
//     WebkitTextStrokeColor: 'rgb(255, 255, 255)',
//   };
// };

// Convert percent to an inverted height to fill from top down of raindrop overlay (white fill overlay over rain color underneath)
export const getRainIconFillHeight = (percent) => {
  // If zero % chance of rain, replace overlay "white" with a slightly "gray" color to make the icon more subtle
  if (percent === 0) {
    return {
      color: 'rgba(210, 210, 210, 1)',
      height: '100%',
    };
  } else {
    let invertedHeight = 100 - percent + '%';
    return {
      height: invertedHeight,
    };
  }
};

// Returns EPA's rating scale based on uv index
export const getUVrating = (uvi) => {
  let rating = '';
  let rgb = 'rgb(255, 255, 255)';

  switch (uvi) {
    case uvi > 10:
      rating = 'Extreme';
      rgb = 'rgb(215, 59, 126)';
      break;
    case 10:
    case 9:
    case 8:
      rating = '(Very High)';
      rgb = 'rgb(240, 0, 21)';
      break;
    case 7:
    case 6:
      rating = 'High';
      rgb = 'rgb(254, 144, 46)';
      break;
    case 5:
    case 4:
    case 3:
      rating = 'Moderate';
      rgb = 'rgb(255, 206, 61)';
      break;
    case 2:
    case 1:
    case 0:
    default:
      rating = '(Low)';
      rgb = 'rgb(138, 195, 145)';
      break;
  }

  return {
    rating,
    styling: {
      color: rgb,
    },
  };
};

export const getCardinalDirection = (angle) => {
  const directions = [
    'N ↑',
    'NE ↗',
    'E →',
    'SE ↘',
    'S ↓',
    'SW ↙',
    'W ←',
    'NW ↖',
  ];
  return directions[Math.round(angle / 45) % 8];
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

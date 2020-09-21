// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import { getUVrating } from '../Utils';

function Details(props) {
  let { units, wDetails } = props;
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

  return (
    <div>
      <p>Humidity: {humidity}%</p>
      <p>
        Dew Point: {dewPt}
        &deg;{units}
      </p>
      <p>Pressure: {pressure} inHg</p>
      <p>
        UV Index: {uvi}{' '}
        <span className="uvi-rating" style={getUVrating(uvi).styling}>
          {getUVrating(uvi).rating}
        </span>
      </p>
      <p>Visibility: {visibility} mi</p>
      <br />
      <p>
        <span>
          <i className="wind-icon fas fa-wind"></i>
        </span>{' '}
        {windSpeed}mi/hr {windDeg}{' '}
      </p>
      <br />
      <p>
        <span className="daytime">
          <i className="sun-icon detail-icon fas fa-sun"></i>
          {sunrise}
        </span>
      </p>
      <p>
        <span className="daytime">
          <i className="moon-icon detail-icon fas fa-moon"></i>
          {sunset}
        </span>
      </p>
    </div>
  );
}

export default Details;

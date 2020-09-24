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
    <div className="wrapper-details">
      <div className="column-details">
        <p className="wind-text">
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
        <button className="swipe-btn left-btn" onClick={props.onSwipe}>
          <i className="fas fa-chevron-left"></i>&nbsp;summary
        </button>
      </div>
      <div className="column-details">
        <p>
          <span className="details-label">Humidity: </span>
          {humidity}%
        </p>
        <p>
          <span className="details-label">Dew Point: </span>
          {dewPt}
          &deg;{units}
        </p>
        <p>
          <span className="details-label">Pressure: </span>
          {pressure} inHg
        </p>
        <p>
          <span className="details-label">UV Index: </span>
          {uvi}{' '}
          <span className="uvi-rating" style={getUVrating(uvi).styling}>
            {getUVrating(uvi).rating}
          </span>
        </p>
        <p>
          <span className="details-label">Visibility: </span>
          {visibility} mi
        </p>
      </div>
    </div>
  );
}

export default Details;

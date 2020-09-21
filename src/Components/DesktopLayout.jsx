// LIBRARIES
import React from 'react';
import $ from 'jquery';

// UTILITY FUNCTIONS
import { getRainIconStyling, getUVrating } from './../Utils';

// COMPONENTS
import C from '../constants';
import UnitButton from './UnitButton';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

class DesktopLayout extends React.Component {
  constructor(props) {
    super(props);

    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  handleUnitsChange() {
    this.props.onUnitsChanged();
  }
  handleResize(size, whichBox) {
    if (size === 'compact') {
      if (whichBox === 'days') $('.box-hours').removeClass('hidden');
      else $('.box-days').removeClass('hidden');
    } else {
      if (whichBox === 'days') $('.box-hours').addClass('hidden');
      else $('.box-days').addClass('hidden');
    }
  }
  render(props) {
    let {
      units,
      wMain,
      wDetails,
      dayForecast,
      hourForecast,
      layout,
    } = this.props;
    let {
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

    let iconMapping = C.ICON_PREFIX + iconCode;

    return (
      <div className="dl-container">
        <div className="column">
          <div className="box-main">
            <div className="wrapper-main icon-weather">
              <i className={iconMapping}></i>
            </div>
            <div className="wrapper-main">
              <div className="unit-slider">
                <UnitButton onUnitsButton={this.handleUnitsChange} />
              </div>
              <div className="text-temperature">{currentTemp}&deg;</div>
            </div>
          </div>
          <div className="box-summary">
            <div className="wrapper-summary">
              <p className="text-description">{description}</p>
              <p className="text-precipitation">
                <i
                  className="icon-umbrella fas fa-umbrella"
                  style={getRainIconStyling(precProb)}
                ></i>
                <span className="text-probability">{precProb}%</span>
              </p>
            </div>
            <div className="wrapper-summary">
              <p className="temp-high-low">
                <span className="temp-high">
                  <i className="fas fa-long-arrow-alt-up"></i>
                  {high}&deg;
                </span>
                <span className="temp-low">
                  <i className="fas fa-long-arrow-alt-down"></i>
                  {low}&deg;
                </span>
              </p>
              <p className="text-feelslike">feels like {feelsLike}&deg;</p>
            </div>
          </div>
          <div className="box-details">
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
        </div>
        <div className="column">
          <div className="box-days">
            <ForecastDay
              dayForecast={dayForecast}
              units={units}
              layout={layout}
              onResize={(size) => {
                this.handleResize(size, 'days');
              }}
            />
          </div>
          <div className="box-hours">
            <ForecastHour
              hourForecast={hourForecast}
              units={units}
              layout={layout}
              onResize={(size) => {
                this.handleResize(size, 'hours');
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default DesktopLayout;

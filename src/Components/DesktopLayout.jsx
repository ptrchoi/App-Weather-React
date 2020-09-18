// LIBRARIES
import React from 'react';
import $ from 'jquery';

// UTILITY FUNCTIONS
import { getRainIconStyling, getUVrating } from './../Utils';

// COMPONENTS
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

    let iconClass = 'wi wi-owm-' + iconCode;

    return (
      <div className="d-container">
        <div className="d-column">
          <div className="box-temp">
            <div className="temp-group wIcon">
              <i className={iconClass}></i>
            </div>
            <div className="temp-group">
              <div className="unit-slider">
                <UnitButton onUnitsButton={this.handleUnitsChange} />
              </div>
              <div className="temp-display">{currentTemp}&deg;</div>
            </div>
          </div>
          <div className="box-summary">
            <div className="summary-group">
              <p className="p-description">{description}</p>
              <p className="p-precipitation">
                {precProb}%
                <i
                  className="rain-icon fas fa-umbrella"
                  style={getRainIconStyling(precProb)}
                ></i>
              </p>
            </div>
            <div className="summary-group">
              <p>
                <span className="high-temp">
                  <i className="fas fa-long-arrow-alt-up"></i>
                  {high}&deg;
                </span>
                <span className="low-temp">
                  <i className="fas fa-long-arrow-alt-down"></i>
                  {low}&deg;
                </span>
              </p>
              <p>feels like {feelsLike}&deg;</p>
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
            <p>Wind Speed: {windSpeed} mi/hr</p>
            <p>Wind Direction: {windDeg} </p>
            <br />
            <p>
              <span className="daytime">
                <i className="sun-icon detail-icon fas fa-sun"></i>
                Sunrise: {sunrise}
              </span>
            </p>
            <p>
              <span className="daytime">
                <i className="moon-icon detail-icon fas fa-moon"></i>
                Sunset: {sunset}
              </span>
            </p>
          </div>
        </div>
        <div className="d-column">
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

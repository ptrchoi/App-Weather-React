// LIBRARIES
import React from 'react';
import $ from 'jquery';

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
    let { units, wMain, wDetails, dayForecast, hourForecast } = this.props;
    let {
      currentTemp,
      description,
      iconCode,
      high,
      low,
      feelsLike,
      precProb,
    } = wMain;
    let { humidity, uvi } = wDetails;

    let iconClass = 'wi wi-owm-' + iconCode;

    return (
      <div className="d-container">
        <div className="d-column">
          <div className="box-temp">
            <div className="wIcon">
              <i className={iconClass}></i>
            </div>
            <div className="temp-wrapper">
              {currentTemp}&deg;
              <UnitButton onUnitsButton={this.handleUnitsChange} />
            </div>
          </div>
          <div className="box-summary">
            <p>{description}</p>
            <p>
              <i className="fas fa-long-arrow-alt-up"></i>
              {high}&deg; <i className="fas fa-long-arrow-alt-down"></i>
              {low}&deg;
            </p>
            <p>Feels Like {feelsLike}&deg;</p>
            <p>
              <i className="fas fa-umbrella"></i> {precProb}%
            </p>
          </div>
          <div className="box-details">
            <p>Humidity: {humidity}%</p>
            <p>UV Index: {uvi}</p>
          </div>
        </div>
        <div className="d-column">
          <div className="box-days">
            <ForecastDay
              dayForecast={dayForecast}
              units={units}
              onResize={(size) => {
                this.handleResize(size, 'days');
              }}
            />
          </div>
          <div className="box-hours">
            <ForecastHour
              hourForecast={hourForecast}
              units={units}
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

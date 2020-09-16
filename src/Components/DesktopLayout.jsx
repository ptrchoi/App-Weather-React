// LIBRARIES
import React from 'react';
import $ from 'jquery';

// COMPONENTS
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

class DesktopLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  handleUnitsChange() {
    this.props.onUnitsChanged();
  }
  handleResize(size) {
    if (size === 'compact') {
      $('.forecast-day').removeClass('forecast--expanded');
      $('.forecast-hour').removeClass('forecast--expanded');
    } else {
      $('.forecast-day').addClass('forecast--expanded');
      $('.forecast-hour').addClass('forecast--expanded');
    }
  }
  render(props) {
    let { units, wMain, wDetails, dayForecast, hourForecast } = this.props;
    let { currentTemp, description, high, low, feelsLike, precProb } = wMain;
    let { humidity, uvi } = wDetails;

    return (
      <div className="d-container">
        <div className="d-column">
          <div className="box-temp">
            <p>
              {currentTemp}&deg; {units}
              <button onClick={this.handleUnitsChange}>
                <i className="fas fa-temperature-low"></i>
              </button>
            </p>
          </div>
          <div className="box-summary">
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
          <div className="box-details">
            <p>Humidity: {humidity}%</p>
            <p>UV Index: {uvi}</p>
          </div>
        </div>
        <div className="d-column">
          <ForecastDay
            dayForecast={dayForecast}
            units={units}
            onResize={this.handleResize}
          />
          <ForecastHour
            hourForecast={hourForecast}
            units={units}
            onResize={this.handleResize}
          />
        </div>
      </div>
    );
  }
}
export default DesktopLayout;

// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// UTILITY FUNCTIONS
import { formatTemp, convertTime, getRainIconStyling } from './../Utils';

// LOCAL CONSTS
const FORECAST_HOURS_COMPACT = 8;
const FORECAST_HOURS_EXPANDED = 16;

// ForecastHour COMPONENT CLASS
class ForecastHour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hourlyForecast: [],
      size: 'compact',
    };

    this.updateForecast = this.updateForecast.bind(this);
    this.resize = this.resize.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props != prevProps && this.props.hourForecast)
      this.updateForecast(this.props.hourForecast);
  }
  updateForecast(forecastData, resize = false) {
    let { size } = this.state;

    // If resized, size should be manually toggled as state props will not have been updated yet
    if (resize) {
      if (size === 'compact') size = 'expanded';
      else size = 'compact';
    }

    let numOfHours = FORECAST_HOURS_COMPACT;
    if (size === 'expanded') numOfHours = FORECAST_HOURS_EXPANDED;

    // Get a subset of the forecast's hourly array based on compact/expanded
    let forecastArr = forecastData.slice(0, numOfHours);

    this.setState({
      hourlyForecast: forecastArr,
    });
  }
  resize() {
    if (!this.props.hourForecast) return;

    let { size } = this.state;

    if (size === 'compact') size = 'expanded';
    else size = 'compact';

    this.updateForecast(this.props.hourForecast, true);
    this.props.onResize(size);

    this.setState({
      size: size,
    });
  }
  renderForecast(units) {
    let { hourlyForecast, size } = this.state;
    if (hourlyForecast.length <= 0) return;

    let classList = 'hour-compact';

    if (size === 'expanded') classList = 'hour-expanded';

    // Curry function to .map method
    function displayDiv(units, classList) {
      return function (hour) {
        let timeArr = convertTime(hour.dt); // timeArr = [ hour, ':', mins, daytime]
        let iconClass = 'wi wi-owm-' + hour.weather[0].id;
        let rainObj = hour.rain;
        let rainfall = 0;
        // Due to Open Weather's naming convention of '1h', can't call it directly, so use Object.keys to access the data
        if (rainObj) rainfall = rainObj[Object.keys(rainObj)[0]];

        return (
          <div key={uuidv4()} className={classList}>
            <br />
            <p className="item-hour item">
              {timeArr[0]}
              {timeArr[4]}
            </p>
            <p className="item-temp item">
              <span className="w-icon">
                <i className={iconClass}></i>
              </span>
              <span className="temp-text">
                {formatTemp(hour.temp, units)}
                &deg;
              </span>
            </p>
            <p className="item-rain item">
              <i
                className="rain-icon fas fa-umbrella"
                style={getRainIconStyling(hour.pop * 100)}
              ></i>
              <span className="percent-text">
                {Math.round(hour.pop * 100)}%
              </span>
            </p>
            {/* <p>Rainfall: {rainfall}"</p> */}
          </div>
        );
      };
    }

    return hourlyForecast.map(displayDiv(units, classList));
  }
  render(props) {
    let { size } = this.state;
    let classList = 'forecastHour-container';

    if (size === 'expanded') classList += ' expanded';

    return (
      <div className={classList}>
        <button className="h-resize-btn" onClick={this.resize}>
          <i className="fas fa-expand"></i>
        </button>
        <div className="h-inner-wrapper">
          {this.renderForecast(this.props.units)}
        </div>
      </div>
    );
  }
}
export default ForecastHour;

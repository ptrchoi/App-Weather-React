// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// UTILITY FUNCTIONS
import { formatTemp, convertTime, getRainIconFillHeight } from './../Utils';

// COMPONENTS
import C from '../constants';

// LOCAL CONSTS
const FORECAST_HOURS = 24;

// ForecastHour COMPONENT CLASS
class ForecastHour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hourlyForecast: [],
    };

    this.updateForecast = this.updateForecast.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props != prevProps && this.props.hourForecast)
      this.updateForecast(this.props.hourForecast);
  }
  updateForecast(forecastData) {
    // Get a subset of the forecast's hourly array based on compact/expanded
    let forecastArr = forecastData.slice(0, FORECAST_HOURS);

    this.setState({
      hourlyForecast: forecastArr,
    });
  }
  renderForecast(units) {
    let { hourlyForecast } = this.state;
    if (hourlyForecast.length <= 0) return;

    // Curry function to .map method
    function displayHours(units) {
      return function (hour) {
        let timeArr = convertTime(hour.dt); // timeArr = [ hour, ':', mins, daytime]
        let iconMapping = C.ICON_PREFIX + hour.weather[0].id;
        let rainObj = hour.rain;
        let rainfall = 0;
        // Due to Open Weather's naming convention of '1h', can't call it directly, so use Object.keys to access the data
        if (rainObj) rainfall = rainObj[Object.keys(rainObj)[0]];

        return (
          <div key={uuidv4()} className="hour-forecast">
            <p className="item item-hour ">
              {timeArr[0]}
              {timeArr[4]}
            </p>
            <p className="item item-temp">
              <span className="icon-weather">
                <i className={iconMapping}></i>
              </span>
              <span className="text-degrees">
                {formatTemp(hour.temp, units)}
                &deg;
              </span>
            </p>
            <div className="item item-rain">
              <div className="wrapper-raindrop-icon">
                <span className="raindrop-under fas fa-tint"></span>
                <span
                  className="raindrop-over fas fa-tint"
                  style={getRainIconFillHeight(hour.pop * 100)}
                ></span>
              </div>
              <div className="wrapper-raindrop-text">
                <p className="text-probability">
                  {Math.round(hour.pop * 100)}%
                </p>
              </div>
            </div>
          </div>
        );
      };
    }

    return hourlyForecast.map(displayHours(units));
  }
  render(props) {
    return (
      <div className="hourly-forecast-container">
        {this.renderForecast(this.props.units)}
      </div>
    );
  }
}
export default ForecastHour;

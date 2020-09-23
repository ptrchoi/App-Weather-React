// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// UTILITY FUNCTIONS
import { formatTemp, getRainIconFillHeight } from './../Utils';

// COMPONENTS
import C from '../constants';

// LOCAL CONSTS
const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const FORECAST_DAYS = 8; // 7 day forecast includes today = 8

// LOCAL FUNCTIONS
function setForecastDays(arr, today) {
  // Loop through to fill the array with the days of the week
  for (let i = 0; i < arr.length; i++) {
    if (today < DAYS_OF_THE_WEEK.length - 1) today++;
    else today = 0;

    arr[i].day = DAYS_OF_THE_WEEK[today];
  }
  return arr;
}

// ForecastDay COMPONENT CLASS
class ForecastDay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      units: 'F',
      dailyForecast: [],
    };

    this.updateForecast = this.updateForecast.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props != prevProps && this.props.dayForecast) {
      this.updateForecast(this.props.dayForecast, this.props.units);
    }
  }
  updateForecast(forecastData, units) {
    let forecastArr = [];

    for (let i = 0; i < FORECAST_DAYS; i++) {
      let dayObj = {
        day: '',
        temp: formatTemp(forecastData[i].temp.day, units),
        high: formatTemp(forecastData[i].temp.max, units),
        low: formatTemp(forecastData[i].temp.min, units),
        pp: Math.round(forecastData[i].pop * 100),
        iconMapping: C.ICON_PREFIX + forecastData[i].weather[0].id,
      };
      forecastArr[i] = dayObj;
    }

    let today = new Date();
    forecastArr = setForecastDays(forecastArr, today.getDay());

    this.setState({
      units: units,
      dailyForecast: forecastArr,
    });
  }
  renderDays() {
    let { dailyForecast } = this.state;
    if (!dailyForecast) return;

    // Curry function to .map method
    function displayDays() {
      return function (day) {
        return (
          <div key={uuidv4()} className="day-forecast">
            <p className="item item-dayOfWeek">{day.day}</p>
            <p className="item item-temperature">
              <span className="icon-weather">
                <i className={day.iconMapping}></i>
              </span>
              <span className="text-degrees">{day.temp}&deg;</span>
            </p>
            <div className="item item-rain">
              <div className="wrapper-raindrop-icon">
                <span className="raindrop-under fas fa-tint"></span>
                <span
                  className="raindrop-over fas fa-tint"
                  style={getRainIconFillHeight(day.pp)}
                ></span>
              </div>
              <div className="wrapper-raindrop-text">
                <p className="text-probability">{day.pp}%</p>
              </div>
            </div>
            <p className="item item-highLow">
              <span className="temp-high">
                <i className="fas fa-long-arrow-alt-up"></i> {day.high}&deg;{' '}
              </span>
              <span className="temp-low">
                <i className="fas fa-long-arrow-alt-down"></i> {day.low}&deg;
              </span>
            </p>
          </div>
        );
      };
    }

    return dailyForecast.map(displayDays());
  }
  render(props) {
    return <div className="forecast-container">{this.renderDays()}</div>;
  }
}
export default ForecastDay;

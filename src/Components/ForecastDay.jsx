// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// UTILITY FUNCTIONS
import { formatTemp, getRainIconStyling } from './../Utils';

// COMPONENTS
import C from '../constants';

// LOCAL CONSTS
const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const FORECAST_DAYS_COMPACT = 5; // Includes today
const FORECAST_DAYS_EXPANDED = 8; // 7 day forecast includes today = 8

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
      size: 'compact',
    };

    this.updateForecast = this.updateForecast.bind(this);
    this.resize = this.resize.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props != prevProps && this.props.dayForecast) {
      this.updateForecast(this.props.dayForecast, this.props.units);
    }
  }
  updateForecast(forecastData, units, resize = false) {
    let { size } = this.state;

    // If resized, size should be manually toggled as state props will not have been updated yet
    if (resize) size === 'compact' ? (size = 'expanded') : (size = 'compact');

    let forecastArr = [];
    let numOfDays = FORECAST_DAYS_COMPACT;

    if (size === 'expanded') numOfDays = FORECAST_DAYS_EXPANDED;

    // Create arr of dayObjs populated with forecastData & days of the week
    // If units in 'C', convertTemp(), else just round off the value for the default 'F' value
    for (let i = 0; i < numOfDays; i++) {
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
      size: size,
    });
  }
  resize() {
    if (!this.props.dayForecast) return;

    let { units, size } = this.state;

    size === 'compact' ? (size = 'expanded') : (size = 'compact');

    this.updateForecast(this.props.dayForecast, units, true);
    this.props.onResize(size);

    this.setState({
      size: size,
    });
  }
  renderDays() {
    let { dailyForecast, size } = this.state;
    if (!dailyForecast) return;

    let classList = 'day day-compact';
    if (size === 'expanded') classList = 'day day-expanded';

    // Curry function to .map method
    function displayDiv(classList) {
      return function (day) {
        return (
          <div key={uuidv4()} className={classList}>
            <p className="item item-dayOfWeek">{day.day}</p>
            <p className="item item-temp">
              <span className="icon-weather">
                <i className={day.iconMapping}></i>
              </span>
              <span className="text-degree">{day.temp}&deg;</span>
            </p>
            <p className="item item-rain">
              <i
                className="fas fa-umbrella"
                style={getRainIconStyling(day.pp)}
              ></i>
              <span className="text-percent">{day.pp}%</span>
            </p>
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

    return dailyForecast.map(displayDiv(classList));
  }
  render(props) {
    let { size } = this.state;
    let containerList = 'forecastDay-container';
    let wrapperList = 'days-wrapper';

    if (size === 'expanded') {
      containerList += ' expanded';
      wrapperList += ' expanded-wrapper';
    }

    return (
      <div className={containerList}>
        <div className="forecast-btn">
          <button className="resize-btn" onClick={this.resize}>
            <i className="fas fa-expand"></i>
          </button>
        </div>
        <div className={wrapperList}>{this.renderDays()}</div>
      </div>
    );
  }
}
export default ForecastDay;

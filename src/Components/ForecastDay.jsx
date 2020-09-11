// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// UTILITY FUNCTIONS
import { convertTemp } from './../Utils';

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
      dailyForecast: [],
      size: 'compact',
    };

    this.updateForecast = this.updateForecast.bind(this);
    this.resize = this.resize.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.dayForecast != prevProps.dayForecast) {
      this.updateForecast(this.props.dayForecast, this.props.units);
    }
  }
  updateForecast(forecastData, units, resize = false) {
    let { size } = this.state;

    // If resized, size should be toggled
    if (resize) {
      if (size === 'compact') size = 'expanded';
      else size = 'compact';
    }

    let forecastArr = [];
    let numOfDays = FORECAST_DAYS_COMPACT;

    if (size === 'expanded') numOfDays = FORECAST_DAYS_EXPANDED;

    // Create arr of dayObjs populated with forecastData & days of the week
    for (let i = 0; i < numOfDays; i++) {
      let dayObj = {
        day: '',
        temp: convertTemp(forecastData[i].temp.day, units),
        high: convertTemp(forecastData[i].temp.max, units),
        low: convertTemp(forecastData[i].temp.min, units),
        pp: Math.round(forecastData[i].pop * 100),
      };
      forecastArr[i] = dayObj;
    }

    let today = new Date();
    forecastArr = setForecastDays(forecastArr, today.getDay());

    this.setState({
      dailyForecast: forecastArr,
    });
  }
  resize() {
    let { size } = this.state;

    if (size === 'compact') size = 'expanded';
    else size = 'compact';

    this.updateForecast(this.props.dayForecast, this.props.units, true);

    this.setState({
      size: size,
    });
  }
  renderForecast(units) {
    let { dailyForecast, size } = this.state;
    if (!dailyForecast) return;

    let classList = 'day-compact';

    if (size === 'expanded') classList = 'day-expanded';

    // Curry function to .map method
    function displayDiv(units, classList) {
      return function (day) {
        return (
          <div key={uuidv4()} className={classList}>
            <br />
            <p>{day.day}</p>
            <p>
              {day.temp}&deg; {units} <i className="fas fa-umbrella"></i>{' '}
              {day.pp}%
            </p>
            <p>
              <i className="fas fa-long-arrow-alt-up"></i> {day.high}&deg;{' '}
              <i className="fas fa-long-arrow-alt-down"></i> {day.low}&deg;
            </p>
          </div>
        );
      };
    }

    return dailyForecast.map(displayDiv(units, classList));
  }
  render(props) {
    let { size } = this.state;
    let classList = 'forecastDay-container';

    if (size === 'expanded') classList += ' expanded';

    return (
      <div className={classList}>
        <button id="resizeBtn" onClick={this.resize}>
          <i className="fas fa-bars"></i>
        </button>
        {this.renderForecast(this.props.units)}
      </div>
    );
  }
}
export default ForecastDay;

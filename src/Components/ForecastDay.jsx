// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// `UTILITY FUNCTIONS
import { convertTemp } from './../Utils';

// LOCAL CONSTS
const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const FORECAST_DAYS = 7;

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
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.dayForecast != prevProps.dayForecast) {
      this.updateForecast(this.props.dayForecast, this.props.units);
    }
  }
  updateForecast(forecastData, units) {
    let forecastArr = [];

    // Create arr of dayObjs populated with forecastData & days of the week
    for (let i = 0; i < FORECAST_DAYS; i++) {
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
  renderForecast(units) {
    let { dailyForecast } = this.state;
    if (!dailyForecast) return;

    // Curry function to .map method
    function displayDiv(units) {
      return function (day) {
        return (
          <div key={uuidv4()}>
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

    return dailyForecast.map(displayDiv(units));
  }
  render(props) {
    return (
      <div className="forecastDay-container">
        {this.renderForecast(this.props.units)}
      </div>
    );
  }
}
export default ForecastDay;

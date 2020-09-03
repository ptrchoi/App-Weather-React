// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

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
function convertTemp(temp) {
  return Math.round((temp * 9) / 5 - 459.67);
}

// Forecast Component Class
class Forecast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dailyForecast: [],
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.forecast != prevProps.forecast) {
      this.updateForecast(this.props.forecast);
    }
  }
  updateForecast(forecastData) {
    let forecastArr = [];

    // Create arr of dayObjs populated with forecastData & days of the week
    for (let i = 0; i < FORECAST_DAYS; i++) {
      let dayObj = {
        day: '',
        temp: convertTemp(forecastData[i].temp.day),
        high: convertTemp(forecastData[i].temp.max),
        low: convertTemp(forecastData[i].temp.min),
        pp: forecastData[i].pop * 100,
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

    function displayDiv(units) {
      return function (day) {
        return (
          <div key={uuidv4()}>
            <br />
            <p>Day: {day.day}</p>
            <p>
              Temperature: {day.temp}&deg; {units}
            </p>
            <p>
              High: {day.high}&deg; {units}
            </p>
            <p>
              Low: {day.low}&deg; {units}
            </p>
            <p>{day.pp}% chance of precipitation</p>
            <br />
          </div>
        );
      };
    }

    return dailyForecast.map(displayDiv(units));
  }
  render(props) {
    return <div>{this.renderForecast(this.props.units)}</div>;
  }
}
export default Forecast;

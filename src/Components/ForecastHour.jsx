// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

function convertTemp(temp) {
  return Math.round((temp * 9) / 5 - 459.67);
}
function convertHour(unixTime) {
  // Convert to milliseconds and get new dateObj
  let dateObj = new Date(unixTime * 1000);
  let hour = dateObj.getHours();
  let daytime = 'AM';

  if (hour >= 12) {
    if (hour > 12) hour = hour - 12;
    daytime = 'PM';
  } else if (hour === 0) hour = 12;

  return hour + daytime;
}
// ForecastHour COMPONENT CLASS
class ForecastHour extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hourlyForecast: [],
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.hourForecast != prevProps.hourForecast) {
      this.updateForecast(this.props.hourForecast);
    }
  }
  updateForecast(forecastData) {
    let forecastArr = [];

    this.setState({
      hourlyForecast: forecastData,
    });
  }
  renderForecast(units) {
    let { hourlyForecast } = this.state;
    if (hourlyForecast.length <= 0) return;

    // Curry function to .map method
    function displayDiv(units) {
      return function (hour) {
        return (
          <div key={uuidv4()}>
            <br />
            <p>
              @ {convertHour(hour.dt)} {convertTemp(hour.temp)}&deg; {units}
            </p>
            <p>{Math.round(hour.pop * 100)}% chance of precipitation</p>
          </div>
        );
      };
    }

    return hourlyForecast.map(displayDiv(units));
  }
  render(props) {
    return (
      <div className="forecastHour-container">
        {this.renderForecast(this.props.units)}
      </div>
    );
  }
}
export default ForecastHour;

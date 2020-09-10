// LIBRARIES
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// UTILITY FUNCTIONS
import { convertTemp, convertTime } from './../Utils';

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
        let timeArr = convertTime(hour.dt); // timeArr = [ hour, ':', mins, daytime]

        // Due to Open Weather's naming convention of '1h', can't call it directly, so use Object.keys to access the data
        let rainObj = hour.rain;
        let rainfall = 0;
        if (rainObj) {
          rainfall = rainObj[Object.keys(rainObj)[0]];
        }

        return (
          <div key={uuidv4()}>
            <br />
            <p>
              {timeArr[0]}
              {timeArr[3]}
            </p>
            <p>
              {convertTemp(hour.temp, units)}&deg; {units}{' '}
              <i className="fas fa-umbrella"></i> {Math.round(hour.pop * 100)}%
            </p>
            {/* <p>Rainfall: {rainfall}"</p> */}
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

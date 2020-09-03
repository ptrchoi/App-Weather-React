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
        let timeObj = convertTime(hour.dt);
        return (
          <div key={uuidv4()}>
            <br />
            <p>
              @ {timeObj.hour}
              {timeObj.daytime} {convertTemp(hour.temp)}&deg; {units}
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
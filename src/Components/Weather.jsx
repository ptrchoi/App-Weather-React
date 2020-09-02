// LIBRARIES
import React from 'react';

// Weather Component Class
class Weather extends React.Component {
  constructor(props) {
    super(props);

  }
  render(props) {
    const { city, country } = this.props.location;

    return (
      <div>
      <p>Getting weather for {city}, {country}</p>
      </div>
    );
  }
}
export default Weather;
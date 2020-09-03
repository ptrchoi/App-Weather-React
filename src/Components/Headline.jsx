// LIBRARIES
import React from 'react';

// Headline  COMPONENT CLASS
class Headline extends React.Component {
  constructor(props) {
    super(props);

    this.getDate = this.getDate.bind(this);
  }
  getDate() {
    return new Date().toDateString();
  }
  getTime() {
    return new Date().toLocaleTimeString();
  }
  render(props) {
    const { city, country } = this.props.location;
    // console.log('city: ', city);
    // console.log('country: ', country);

    return (
      <div className="headline-container">
        <p>
          {city}, {country}
        </p>
        <p>{this.getDate()}</p>
        <p>{this.getTime()}</p>
      </div>
    );
  }
}
export default Headline;

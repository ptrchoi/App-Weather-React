// LIBRARIES
import React from 'react';

// Headline  COMPONENT CLASS
class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      stateName: '',
      country: '',
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.location != prevProps.location) {
      this.setState({
        city: this.props.location.city,
        stateName: this.props.location.stateName,
        country: this.props.location.country,
      });
    }
  }
  getDate() {
    return new Date().toDateString();
  }
  render(props) {
    const { city, stateName, country } = this.state;

    return (
      <div className="headline-container">
        <p>
          {city}, {stateName}, {country}
        </p>
        <p>{this.getDate()}</p>
        <p>{this.props.time}</p>
      </div>
    );
  }
}
export default Headline;

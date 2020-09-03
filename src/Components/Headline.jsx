// LIBRARIES
import React from 'react';

// Headline  COMPONENT CLASS
class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      country: '',
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.location != prevProps.location) {
      this.setState({
        city: this.props.location.city,
        country: this.props.location.country,
      });
    }
  }
  getDate() {
    return new Date().toDateString();
  }
  render(props) {
    const { city, country } = this.state;

    return (
      <div className="headline-container">
        <p>
          {city}, {country}
        </p>
        <p>{this.getDate()}</p>
        <p>{this.props.time}</p>
      </div>
    );
  }
}
export default Headline;

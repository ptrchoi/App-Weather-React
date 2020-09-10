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
          <span>{this.getDate()}</span>
          {'   '}
          <span>{this.props.time}</span>
        </p>
        <p>{city}</p>
      </div>
    );
  }
}
export default Headline;

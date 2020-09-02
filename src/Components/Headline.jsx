// LIBRARIES
import React from 'react';

// Headline Component Class
class Headline extends React.Component {
  render(props) {
    const { city, country } = this.props.location;
    // console.log('city: ', city);
    // console.log('country: ', country);

    return (
      <div>
        <p>{city}, {country}</p>
      </div>
    );
  }
}
export default Headline;
// LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// COMPONENTS
import Headline from './Components/Headline';
import Weather from './Components/Weather';

// STYLE SHEETS
import './styles/index.scss';
import './styles/base/app.scss';

// LOCAL FUNCTIONS
function getGoogleLocData(lat, lng) {
  const KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +lat + ',' + lng + '&key=' + KEY;

  return new Promise((resolve, reject) => {
    $.getJSON({
      url: googleUrl,
      success: resolve,
      error: reject
    });
  });
}
function fixAddressData(address) {
  // Split string into array of address strings
  let arr = address.split(" ");

  // Then split each string element into an array of chars
  arr = arr.map(el => el.split(""));

  // Remove any commas from each char array within the array
  arr = arr.map(charArr => {
    if (charArr.includes(",")) {
      let index = charArr.findIndex(ch => ch === ",");
      charArr.splice(index, 1);
    }
    // Convert charArr's back to strings
    let str = charArr.join("");

    return str;
  })
  return arr;
}

// APP COMPONENT CLASS
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: {
        x: null,
        y: null
      },
      location: {
        city: '',
        country: ''  
      }
    }

    this.setLocation = this.setLocation.bind(this);
  }
  componentDidMount() {
    // Get device geolocation & set location data if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        this.setLocation(position.coords.latitude, position.coords.longitude);
      });
    }
  }
  setLocation = async (lat, lng) => {
    const geoLocData = await getGoogleLocData(lat, lng);

    let addressArr = fixAddressData(geoLocData.plus_code.compound_code);

    // console.log("city: ", addressArr[1]);
    // console.log("country: ", addressArr[3]);

    this.setState({
      coordinates: {
        x: lat,
        y: lng
      },
      location: {
        city: addressArr[1],
        country: addressArr[3]  
      }
    });
  }
  render() {
    // let { city, country } = this.state.location;
    // console.log('city: ', city);
    // console.log('county: ', country);

    return (
      <div className="app-container">
        <Headline location={this.state.location} />
        <Weather location={this.state.location} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
export default App;

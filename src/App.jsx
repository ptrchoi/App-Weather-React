// LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';

// UTILITY FUNCTIONS
import { getGoogleLocData, fixAddressData } from './Utils';

// COMPONENTS
import Weather from './Components/Weather';

// STYLE SHEETS
import './styles/index.scss';
import './styles/base/app.scss';

// APP COMPONENT CLASS
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coords: {
        lat: null,
        lng: null,
      },
      location: {
        city: '',
        country: '',
      },
    };

    this.setLocation = this.setLocation.bind(this);
  }
  componentDidMount() {
    // Get device geolocation & set location data if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLocation(position.coords.latitude, position.coords.longitude);
      });
    }
  }
  setLocation = async (lat, lng) => {
    const geoLocData = await getGoogleLocData(lat, lng);

    // Get parsed and formatted address elements from data
    let addressArr = fixAddressData(geoLocData.plus_code.compound_code);

    this.setState({
      coords: {
        lat: lat,
        lng: lng,
      },
      location: {
        city: addressArr[1],
        country: addressArr[3],
      },
    });
  };
  render() {
    return (
      <div className="app-container">
        <Weather coords={this.state.coords} location={this.state.location} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
export default App;

// LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'regenerator-runtime/runtime';

// COMPONENTS
import Weather from './Components/Weather';

// STYLE SHEETS
import './styles/index.scss';
import './styles/base/variables.scss';
import './styles/base/app.scss';
import './styles/weather-icons.scss';

// APP COMPONENT CLASS
class App extends React.Component {
  componentDidMount() {
    // Set initial orientation
    this.adjustOrientation(window.orientation);
    // Function to counter device rotation to maintain portrait perspective
    window.addEventListener(
      'orientationchange',
      () => this.adjustOrientation(window.orientation),
      true
    );
  }
  adjustOrientation(orientation) {
    if (orientation === -90) {
      $('.app-container').addClass('orientright');
      $('.app-container').removeClass('orientleft');
    }
    if (orientation === 90) {
      $('.app-container').addClass('orientleft');
      $('.app-container').removeClass('orientright');
    }
    if (orientation === 0) {
      $('.app-container').removeClass('orientleft');
      $('.app-container').removeClass('orientright');
    }
  }

  render() {
    return (
      <div id="app" className="app-container">
        <Weather />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
export default App;

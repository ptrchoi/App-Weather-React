// LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'regenerator-runtime/runtime';

// COMPONENTS
import C from './constants.js';
import Weather from './Components/Weather';

// STYLE SHEETS
import './styles/index.scss';
import './styles/base/variables.scss';
import './styles/base/app.scss';
import './styles/weather-icons.scss';

// APP COMPONENT CLASS
class App extends React.Component {
  constructor(props) {
    super(props);

    this.adjustOrientation = this.adjustOrientation.bind(this);
  }
  componentDidMount() {
    // Find matches
    let mqList = window.matchMedia('(orientation: portrait)');

    // Set initial orientation
    this.adjustOrientation(mqList);

    // Listen for orientation changes (media query list)
    mqList.addEventListener('change', () => {
      this.adjustOrientation(mqList);
    });
  }
  // Adjust orientation (if landscape)
  adjustOrientation(mqList) {
    // If there are media query list matches, we're in portrait
    if (mqList.matches) {
      if ($('.app-container').hasClass('adjustedOrientation'))
        $('.app-container').removeClass('adjustedOrientation');
    } else {
      // Apply portrait orientation adjustment only on smaller screens (C.DESKTOP_MAX_WIDTH needs to match in app.scss media query for 'max-width')
      if ($(window).width() < C.DESKTOP_MAX_WIDTH)
        $('.app-container').addClass('adjustedOrientation');
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

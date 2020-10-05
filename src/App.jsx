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
  // Adjust orientation (if landscape && small screen)
  adjustOrientation(mqList) {
    // If there are media query list matches (portrait orientation), remove adjustment class, if assigned
    if (mqList.matches) {
      if ($('.app-container').hasClass('adjustedOrientation'))
        $('.app-container').removeClass('adjustedOrientation');
    } else {
      let width = $(window).width();
      let height = $(window).height();

      // Only adjust orientation on mobile screens (using TABLET_WIDTH breakpoint to include width of rotated tall phones (ie. iPhone X/Pixel XL/etc) in conjuction with MOBILE_HEIGHT)
      if (
        width < C.TABLET_WIDTH_BREAKPOINT &&
        height < C.MOBILE_HEIGHT_BREAKPOINT
      )
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

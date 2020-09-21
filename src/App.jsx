// LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';

// COMPONENTS
import Weather from './Components/Weather';

// STYLE SHEETS
import './styles/index.scss';
import './styles/base/app.scss';
import './styles/base/variables.scss';
import './styles/weather-icons.scss';

// APP COMPONENT CLASS
class App extends React.Component {
  render() {
    return (
      <div className="app-container">
        <Weather />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
export default App;

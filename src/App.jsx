// LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';

// STYLE SHEETS
import './styles/index.scss';
import './styles/base/app.scss';


// APP COMPONENT CLASS
class App extends React.Component {
  render() {
    // console.log('api key: ', process.env.REACT_APP_OPEN_WEATHER_API_KEY);
    return (
      <div className="app-container">App Component</div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
export default App;

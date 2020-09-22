// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import { getRainIconStyling } from '../Utils';

function Summary(props) {
  let { description, high, low, feelsLike, precProb } = props.wMain;

  if (props.layout === 'mobile') {
    return (
      <div className="summary-container">
        <div className="wrapper-summary">
          <p className="text-description">{description}</p>
          <p className="wrapper-precipitation">
            {/* {precProb}% */}
            <i
              className="icon-umbrella fas fa-umbrella"
              style={getRainIconStyling(precProb)}
            ></i>
            <span className="text-probability">{precProb}%</span>
          </p>
        </div>
        <div className="wrapper-summary">
          <p className="temp-high-low">
            <span className="temp-high">
              <i className="fas fa-long-arrow-alt-up"></i>
              {high}&deg;
            </span>
            <span className="temp-low">
              <i className="fas fa-long-arrow-alt-down"></i>
              {low}&deg;
            </span>
          </p>
          <p className="text-feelslike">Feels Like {feelsLike}&deg;</p>
          <button className="temporary-btn btn1" onClick={props.onSwipe}>
            <i className="fas fa-info-circle"></i>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="summary-container">
        <div className="wrapper-summary">
          <p className="text-description">{description}</p>
          <p className="wrapper-precipitation">
            <i
              className="icon-umbrella fas fa-umbrella"
              style={getRainIconStyling(precProb)}
            ></i>
            <span className="text-probability">{precProb}%</span>
          </p>
        </div>
        <div className="wrapper-summary">
          <p className="temp-high-low">
            <span className="temp-high">
              <i className="fas fa-long-arrow-alt-up"></i>
              {high}&deg;
            </span>
            <span className="temp-low">
              <i className="fas fa-long-arrow-alt-down"></i>
              {low}&deg;
            </span>
          </p>
          <p className="text-feelslike">feels like {feelsLike}&deg;</p>
        </div>
      </div>
    );
  }
}

export default Summary;

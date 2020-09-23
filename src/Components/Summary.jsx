// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import { getRainIconFillHeight } from '../Utils';

function Summary(props) {
  let { description, high, low, feelsLike, precProb } = props.wMain;

  if (props.layout === 'mobile') {
    return (
      <div className="summary-container">
        <div className="wrapper-summary">
          <p className="text-description">{description}</p>
          <div className="wrapper-precipitation">
            <div className="wrapper-raindrop-icon">
              <p>
                <span className="raindrop-under fas fa-tint"></span>
                <span
                  className="raindrop-over fas fa-tint"
                  style={getRainIconFillHeight(precProb)}
                ></span>
              </p>
            </div>
            <div className="wrapper-raindrop-text">
              <p className="text-probability">{precProb}%</p>
            </div>
          </div>
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
          <div className="wrapper-precipitation">
            <div className="wrapper-raindrop-icon">
              <p>
                <span className="raindrop-under fas fa-tint"></span>
                <span
                  className="raindrop-over fas fa-tint"
                  style={getRainIconFillHeight(precProb)}
                ></span>
              </p>
            </div>
            <div className="wrapper-raindrop-text">
              <p className="text-probability">{precProb}%</p>
            </div>
          </div>
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

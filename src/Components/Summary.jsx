// LIBRARIES
import React from 'react';

// UTILITY FUNCTIONS
import { getRainIconFillHeight } from '../Utils';

function Summary(props) {
  let { description, high, low, feelsLike, precProb } = props.wMain;

  if (props.layout === 'mobile') {
    return (
      <div className="summary-container">
        <div className="wrapper-summary summary-left">
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
        <div className="wrapper-summary summary-right">
          <p className="text-feelslike">feels Like {feelsLike}&deg;</p>
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
          <button className="swipe-btn right-btn" onClick={props.onSwipe}>
            details&nbsp;<i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="summary-container">
        <div className="wrapper-summary summary-left">
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
        <div className="wrapper-summary summary-right">
          <p className="text-feelslike">feels like {feelsLike}&deg;</p>
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
        </div>
      </div>
    );
  }
}

export default Summary;

// LIBRARIES
import React from 'react';
import $ from 'jquery';

// UTILITY FUNCTIONS
import { getRainIconStyling, getUVrating } from './../Utils';

// COMPONENTS
import UnitButton from './UnitButton';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

class MobileLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherView: 'summary',
    };

    this.swipeContent = this.swipeContent.bind(this);
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  swipeContent() {
    let { weatherView } = this.state;

    if (weatherView === 'summary') {
      $('.swipes-left').removeClass('swipe-in--right');
      $('.swipes-left').addClass('swipe-out--left');
      $('.swipes-right').removeClass('swipe-out--right');
      $('.swipes-right').addClass('swipe-in--left');

      weatherView = 'details';
    } else {
      $('.swipes-left').removeClass('swipe-out--left');
      $('.swipes-left').addClass('swipe-in--right');
      $('.swipes-right').removeClass('swipe-in--left');
      $('.swipes-right').addClass('swipe-out--right');

      weatherView = 'summary';
    }

    this.setState({
      weatherView: weatherView,
    });
  }
  handleUnitsChange() {
    this.props.onUnitsChanged();
  }
  handleResize(size) {
    if (size === 'compact') {
      $('.m-box-3').removeClass('m-box-3--expanded');
      $('.m-box-3').removeClass('m-box-3--expanded');
    } else {
      $('.m-box-3').addClass('m-box-3--expanded');
      $('.m-box-3').addClass('m-box-3--expanded');
    }
  }
  render(props) {
    let {
      units,
      wMain,
      wDetails,
      dayForecast,
      hourForecast,
      layout,
    } = this.props;
    let {
      currentTemp,
      description,
      iconCode,
      high,
      low,
      feelsLike,
      precProb,
    } = wMain;
    let {
      humidity,
      dewPt,
      pressure,
      uvi,
      visibility,
      windSpeed,
      windDeg,
      sunrise,
      sunset,
    } = wDetails;

    // Add Weather Icon prefix to iconCode
    let iconClass = 'wi wi-owm-' + iconCode;

    return (
      <div className="m-container">
        <div className="m-box-1">
          <div className="m-temp-group m-wIcon">
            <i className={iconClass}></i>
          </div>
          <div className="m-temp-group">
            <div className="m-unit-slider">
              <UnitButton onUnitsButton={this.handleUnitsChange} />
            </div>
            <div className="temp-wrapper">{currentTemp}&deg;</div>
          </div>
        </div>
        <div className="m-box-2 swipes-left">
          <div className="m-summary-group">
            <p className="m-p-description">{description}</p>
            <p className="m-p-precipitation">
              {precProb}%
              <i
                className="m-rain-icon fas fa-umbrella"
                style={getRainIconStyling(precProb)}
              ></i>
            </p>
          </div>
          <div className="m-summary-group">
            <p>
              <span className="m-high-temp">
                <i className="fas fa-long-arrow-alt-up"></i>
                {high}&deg;
              </span>
              <span className="m-low-temp">
                <i className="fas fa-long-arrow-alt-down"></i>
                {low}&deg;
              </span>
            </p>
            <p>Feels Like {feelsLike}&deg;</p>
            <button
              className="m-temporary-btn btn1"
              onClick={this.swipeContent}
            >
              <i className="fas fa-info-circle"></i>
            </button>
          </div>
        </div>
        <div className="m-box-2 swipes-right ">
          <div className="m-details">
            <button
              className="m-temporary-btn btn2"
              onClick={this.swipeContent}
            >
              <i className="fas fa-info-circle"></i>
            </button>
            <p>Humidity: {humidity}%</p>
            <p>
              Dew Point: {dewPt}
              &deg;{units}
            </p>
            <p>Pressure: {pressure} inHg</p>
            <p>
              UV Index: {uvi}{' '}
              <span className="uvi-rating" style={getUVrating(uvi).styling}>
                {getUVrating(uvi).rating}
              </span>
            </p>
            <p>Visibility: {visibility} mi</p>
            <br />
            <p>Wind Speed: {windSpeed} mi/hr</p>
            <p>Wind Direction: {windDeg} </p>
            <br />
            <p>
              <span className="daytime">
                <i className="sun-icon detail-icon fas fa-sun"></i>
                Sunrise: {sunrise}
              </span>
            </p>
            <p>
              <span className="daytime">
                <i className="moon-icon detail-icon fas fa-moon"></i>
                Sunset: {sunset}
              </span>
            </p>
          </div>
        </div>
        <div className="m-box-3 swipes-left">
          <ForecastDay
            dayForecast={dayForecast}
            units={units}
            layout={layout}
            onResize={this.handleResize}
          />
        </div>
        <div className="m-box-3 swipes-right ">
          <ForecastHour
            hourForecast={hourForecast}
            units={units}
            layout={layout}
            onResize={this.handleResize}
          />
        </div>
      </div>
    );
  }
}
export default MobileLayout;

// LIBRARIES
import React from 'react';
import $ from 'jquery';

// UTILITY FUNCTIONS
import { getRainIconStyling, getUVrating } from '../Utils';

// COMPONENTS
import C from '../constants';
import UnitButton from './UnitButton';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

class Main extends React.Component {
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
  handleResize(size, layout, whichBox) {
    if (layout === 'mobile') {
      if (size === 'compact') {
        $('.box-summary').removeClass('hidden');
        $('.box-details').removeClass('hidden');
        $('.box-days').removeClass('box-days--expanded');
        $('.box-hours').removeClass('box-hours--expanded');
      } else {
        $('.box-summary').addClass('hidden');
        $('.box-details').addClass('hidden');
        $('.box-days').addClass('box-days--expanded');
        $('.box-hours').addClass('box-hours--expanded');
      }
    } else {
      // DESKTOP LAYOUT
      if (size === 'compact') {
        if (whichBox === 'days') $('.box-hours').removeClass('hidden');
        else $('.box-days').removeClass('hidden');
      } else {
        if (whichBox === 'days') $('.box-hours').addClass('hidden');
        else $('.box-days').addClass('hidden');
      }
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
    let iconMapping = C.ICON_PREFIX + iconCode;

    if (layout === 'mobile') {
      return (
        <div className="main-container">
          <div className="box-temperature">
            <div className="wrapper-temperature icon-weather">
              <i className={iconMapping}></i>
            </div>
            <div className="wrapper-temperature">
              <div className="unit-slider">
                <UnitButton onUnitsButton={this.handleUnitsChange} />
              </div>
              <div className="text-temperature">{currentTemp}&deg;</div>
            </div>
          </div>
          <div className="box-summary swipes swipes-left">
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
              <button
                className="temporary-btn btn1"
                onClick={this.swipeContent}
              >
                <i className="fas fa-info-circle"></i>
              </button>
            </div>
          </div>
          <div className="box-details swipes swipes-right ">
            <button className="temporary-btn btn2" onClick={this.swipeContent}>
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
            <p>
              <span>
                <i className="wind-icon fas fa-wind"></i>
              </span>{' '}
              {windSpeed}mi/hr {windDeg}{' '}
            </p>
            <br />
            <p>
              <span className="daytime">
                <i className="sun-icon detail-icon fas fa-sun"></i>
                {sunrise}
              </span>
            </p>
            <p>
              <span className="daytime">
                <i className="moon-icon detail-icon fas fa-moon"></i>
                {sunset}
              </span>
            </p>
          </div>
          <div className="box-days swipes swipes-left">
            <ForecastDay
              dayForecast={dayForecast}
              units={units}
              layout={layout}
              onResize={(size) => {
                this.handleResize(size, layout, 'days');
              }}
            />
          </div>
          <div className="box-hours swipes swipes-right ">
            <ForecastHour
              hourForecast={hourForecast}
              units={units}
              layout={layout}
              onResize={(size) => {
                this.handleResize(size, layout, 'hours');
              }}
            />
          </div>
        </div>
      );
    } else {
      // layout === 'desktop'
      return (
        <div className="main-container">
          <div className="column">
            <div className="box-temperature">
              <div className="wrapper-temperature icon-weather">
                <i className={iconMapping}></i>
              </div>
              <div className="wrapper-temperature">
                <div className="unit-slider">
                  <UnitButton onUnitsButton={this.handleUnitsChange} />
                </div>
                <div className="text-temperature">{currentTemp}&deg;</div>
              </div>
            </div>
            <div className="box-summary">
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
            <div className="box-details">
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
              <p>
                <span>
                  <i className="wind-icon fas fa-wind"></i>
                </span>{' '}
                {windSpeed}mi/hr {windDeg}{' '}
              </p>
              <br />
              <p>
                <span className="daytime">
                  <i className="sun-icon detail-icon fas fa-sun"></i>
                  {sunrise}
                </span>
              </p>
              <p>
                <span className="daytime">
                  <i className="moon-icon detail-icon fas fa-moon"></i>
                  {sunset}
                </span>
              </p>
            </div>
          </div>
          <div className="column">
            <div className="box-days">
              <ForecastDay
                dayForecast={dayForecast}
                units={units}
                layout={layout}
                onResize={(size) => {
                  this.handleResize(size, layout, 'days');
                }}
              />
            </div>
            <div className="box-hours">
              <ForecastHour
                hourForecast={hourForecast}
                units={units}
                layout={layout}
                onResize={(size) => {
                  this.handleResize(size, layout, 'hours');
                }}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}
export default Main;

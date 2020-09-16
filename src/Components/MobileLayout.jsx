// LIBRARIES
import React from 'react';
import $ from 'jquery';

// COMPONENTS
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
    let { units, wMain, wDetails, dayForecast, hourForecast } = this.props;
    let { currentTemp, description, high, low, feelsLike, precProb } = wMain;
    let { humidity, uvi } = wDetails;

    return (
      <div className="m-container">
        <div className="m-box-1">
          <p>
            {currentTemp}&deg; {units}
            <button onClick={this.handleUnitsChange}>
              <i className="fas fa-temperature-low"></i>
            </button>
          </p>
        </div>
        <div className="m-box-2 swipes-left">
          <p>{description}</p>
          <p>
            <i className="fas fa-long-arrow-alt-up"></i>
            {high}&deg; {units} <i className="fas fa-long-arrow-alt-down"></i>
            {low}&deg; {units}
          </p>
          <p>
            Feels Like {feelsLike}&deg; {units}{' '}
          </p>
          <p>
            <i className="fas fa-umbrella"></i> {precProb}%
          </p>
          <button className="m_tempButton" onClick={this.swipeContent}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="m-box-2 swipes-right ">
          <p>Humidity: {humidity}%</p>
          <p>UV Index: {uvi}</p>
          <button className="m-tempButton" onClick={this.swipeContent}>
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        <div className="m-box-3 swipes-left">
          <ForecastDay
            dayForecast={dayForecast}
            units={units}
            onResize={this.handleResize}
          />
        </div>
        <div className="m-box-3 swipes-right ">
          <ForecastHour
            hourForecast={hourForecast}
            units={units}
            onResize={this.handleResize}
          />
        </div>
      </div>
    );
  }
}
export default MobileLayout;

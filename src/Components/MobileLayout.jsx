// LIBRARIES
import React from 'react';
import $ from 'jquery';

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
    let { humidity, uvi } = wDetails;

    // Add Weather Icon prefix to iconCode
    let iconClass = 'wi wi-owm-' + iconCode;

    return (
      <div className="m-container">
        <div className="m-box-1">
          <div className="wIcon">
            <i className={iconClass}></i>
          </div>
          <div className="temp-wrapper">
            {currentTemp}&deg;
            <UnitButton onUnitsButton={this.handleUnitsChange} />
          </div>
        </div>
        <div className="m-box-2 swipes-left">
          <p>{description}</p>
          <p>
            <i className="fas fa-long-arrow-alt-up"></i>
            {high}&deg; <i className="fas fa-long-arrow-alt-down"></i>
            {low}&deg;
          </p>
          <p>Feels Like {feelsLike}&deg;</p>
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

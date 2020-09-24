// LIBRARIES
import React from 'react';
import $ from 'jquery';

// COMPONENTS
import Current from './Current';
import Summary from './Summary';
import Details from './Details';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';
import UnitButton from './UnitButton';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherView: 'summary',
      mobileForecastType: 'day',
    };

    this.swipeContent = this.swipeContent.bind(this);
    this.swapForecast = this.swapForecast.bind(this);
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
  swapForecast(e, caller) {
    e.preventDefault();
    let { mobileForecastType } = this.state;
    if (caller === mobileForecastType) return;

    if (mobileForecastType === 'day') {
      $('.mobile-box-hours').removeClass('hidden');
      $('.mobile-box-days').addClass('hidden');
      $('.day-btn').removeClass('active-btn');
      $('.hour-btn').addClass('active-btn');
      mobileForecastType = 'hour';
    } else {
      $('.mobile-box-days').removeClass('hidden');
      $('.mobile-box-hours').addClass('hidden');
      $('.hour-btn').removeClass('active-btn');
      $('.day-btn').addClass('active-btn');
      mobileForecastType = 'day';
    }

    this.setState({
      mobileForecastType: mobileForecastType,
    });
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

    if (layout === 'mobile') {
      return (
        <div className="main-container">
          <Current
            units={units}
            wMain={wMain}
            onUnitsButton={this.props.onUnitsChanged}
          />
          <div className="box-summary swipeable swipes-left">
            <Summary
              wMain={wMain}
              layout={layout}
              className="swipeable swipes-left"
              onSwipe={this.swipeContent}
            />
          </div>
          <div className="box-details swipeable swipes-right">
            <button className="temporary-btn btn2" onClick={this.swipeContent}>
              <i className="fas fa-info-circle"></i>
            </button>
            <Details units={units} wDetails={wDetails} />
          </div>

          <div className="box-forecasts">
            <button
              className="forecast-btn day-btn active-btn"
              onClick={(e) => {
                this.swapForecast(e, 'day');
              }}
            >
              DAY
            </button>
            <span>&nbsp;|&nbsp;</span>
            <button
              className="forecast-btn hour-btn"
              onClick={(e) => {
                this.swapForecast(e, 'hour');
              }}
            >
              HOUR
            </button>
            <div className="mobile-box-days">
              <ForecastDay
                dayForecast={dayForecast}
                units={units}
                layout={layout}
              />
            </div>
            <div className="mobile-box-hours hidden">
              <ForecastHour
                hourForecast={hourForecast}
                units={units}
                layout={layout}
              />
            </div>
          </div>
        </div>
      );
    } else {
      // layout === 'desktop'
      return (
        <div className="main-container">
          <div className="column left-column">
            <Current
              units={units}
              wMain={wMain}
              onUnitsButton={this.props.onUnitsChanged}
            />
            <div className="box-summary">
              <Summary wMain={wMain} layout={layout} />
            </div>
            <div className="box-details">
              <Details units={units} wDetails={wDetails} />
            </div>
          </div>
          <div className="column right-column">
            <div className="box-forecasts">
              <div className="box-days">
                <ForecastDay
                  dayForecast={dayForecast}
                  units={units}
                  layout={layout}
                />
              </div>
              <div className="box-hours">
                <ForecastHour
                  hourForecast={hourForecast}
                  units={units}
                  layout={layout}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default Main;

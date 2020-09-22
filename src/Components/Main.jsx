// LIBRARIES
import React from 'react';
import $ from 'jquery';

// COMPONENTS
import Current from './Current';
import Summary from './Summary';
import Details from './Details';
import ForecastDay from './ForecastDay';
import ForecastHour from './ForecastHour';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherView: 'summary',
    };

    this.swipeContent = this.swipeContent.bind(this);
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
  handleResize(size, layout, whichBox) {
    // MOBILE layout - forecasts expands over summary/details sections
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
      // DESKTOP layout - forecast expands over the other forecast section
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
          <div className="box-days swipeable swipes-left">
            <ForecastDay
              dayForecast={dayForecast}
              units={units}
              layout={layout}
              onResize={(size) => {
                this.handleResize(size, layout, 'days');
              }}
            />
          </div>
          <div className="box-hours swipeable swipes-right ">
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

// LIBRARIES
import React from 'react';

function UnitButton(props) {
  console.log('toggleType: ', props.toggleType);

  // Set slider/checkbox to initial F/C from props

  if (props.toggleType === 'units') {
    if (props.units === 'C') {
      return (
        <div className="onoffswitch">
          <input
            type="checkbox"
            name="onoffswitch"
            className="onoffswitch-checkbox"
            id="unit-switch"
            onClick={props.onToggleUnits}
            defaultChecked
          />
          <label className="onoffswitch-label" htmlFor="unit-switch">
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
          </label>
        </div>
      );
    } else {
      return (
        <div className="onoffswitch">
          <input
            type="checkbox"
            name="onoffswitch"
            className="onoffswitch-checkbox"
            id="unit-switch"
            onClick={props.onToggleUnits}
          />
          <label className="onoffswitch-label" htmlFor="unit-switch">
            <span className="onoffswitch-inner"></span>
            <span className="onoffswitch-switch"></span>
          </label>
        </div>
      );
    }
  } else {
    if (props.forecastType === 'hour') {
      return (
        <div className="onoffswitch2">
          <input
            type="checkbox"
            name="onoffswitch2"
            className="onoffswitch2-checkbox"
            id="forecast-switch"
            onClick={props.onToggleForecast}
            defaultChecked
          />
          <label className="onoffswitch2-label" htmlFor="forecast-switch">
            <span className="onoffswitch2-inner"></span>
            <span className="onoffswitch2-switch"></span>
          </label>
        </div>
      );
    } else {
      return (
        <div className="onoffswitch2">
          <input
            type="checkbox"
            name="onoffswitch2"
            className="onoffswitch2-checkbox"
            id="forecast-switch"
            onClick={props.onToggleForecast}
          />
          <label className="onoffswitch2-label" htmlFor="forecast-switch">
            <span className="onoffswitch2-inner"></span>
            <span className="onoffswitch2-switch"></span>
          </label>
        </div>
      );
    }
  }
}

export default UnitButton;

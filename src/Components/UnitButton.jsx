// LIBRARIES
import React from 'react';

function UnitButton(props) {
  // Set slider/checkbox to initial F/C from props
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
}
export default UnitButton;

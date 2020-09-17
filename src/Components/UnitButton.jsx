// LIBRARIES
import React from 'react';

function UnitButton(props) {
  return (
    <div className="onoffswitch">
      <input
        type="checkbox"
        name="onoffswitch"
        className="onoffswitch-checkbox"
        id="unit-switch"
        onClick={props.onUnitsButton}
      />
      <label className="onoffswitch-label" for="unit-switch">
        <span className="onoffswitch-inner"></span>
        <span className="onoffswitch-switch"></span>
      </label>
    </div>
  );
}

export default UnitButton;

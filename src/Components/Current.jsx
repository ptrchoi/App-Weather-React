// LIBRARIES
import React from 'react';

// COMPONENTS
import C from '../constants';
import UnitButton from './UnitButton';

function Current(props) {
  let { units, wMain } = props;
  let { currentTemp, iconCode } = wMain;

  // Add Weather Icon prefix to iconCode
  let iconMapping = C.ICON_PREFIX + iconCode;

  return (
    <div className="box-temperature">
      <div className="wrapper-temperature icon-weather">
        <i className={iconMapping}></i>
      </div>
      <div className="wrapper-temperature">
        <div className="unit-slider">
          <UnitButton units={units} onToggleUnits={props.onUnitsButton} />
        </div>
        <div className="text-temperature">{currentTemp}&deg;</div>
      </div>
    </div>
  );
}

export default Current;

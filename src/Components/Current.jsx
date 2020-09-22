// LIBRARIES
import React from 'react';

// COMPONENTS
import C from '../constants';
import UnitButton from './UnitButton';

function Current(props) {
  let { currentTemp, iconCode } = props.wMain;

  // Add Weather Icon prefix to iconCode
  let iconMapping = C.ICON_PREFIX + iconCode;

  return (
    <div className="box-temperature">
      <div className="wrapper-temperature icon-weather">
        <i className={iconMapping}></i>
      </div>
      <div className="wrapper-temperature">
        <div className="unit-slider">
          <UnitButton onUnitsButton={props.onUnitsButton} />
        </div>
        <div className="text-temperature">{currentTemp}&deg;</div>
      </div>
    </div>
  );
}

export default Current;

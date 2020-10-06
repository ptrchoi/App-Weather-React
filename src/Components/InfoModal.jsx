import React from 'react';

function InfoModal(props) {
  let { modalOpen } = props;
  const modalOnOff = modalOpen
    ? 'modal-container modal-container--open'
    : 'modal-container';

  return (
    <div className={modalOnOff}>
      <div className="sidebar">
        <ul className="info-text">
          <li>Weather data from OpenWeather.com</li>
          <li>Images from Unsplash.com</li>
          <li>Designed and developed by Peter Choi</li>
        </ul>
      </div>
    </div>
  );
}

export default InfoModal;

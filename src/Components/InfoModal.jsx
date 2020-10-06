import React from 'react';

function InfoModal(props) {
  let { modalOpen } = props;
  const modalOnOff = modalOpen
    ? 'modal-container modal-container--open'
    : 'modal-container';

  return (
    <div className={modalOnOff}>
      <div className="sidebar">
        <div className="info-heading">
          <p className="app-title">Weather App</p>
          <p className="app-subtitle">
            designed and developed by{' '}
            <a href="https://ptrchoi.com" target="_blank">
              Peter Choi
            </a>
          </p>
        </div>
        <ul className="fa-ul">
          <li>
            <span className="fa-li">
              <i className="fas fa-umbrella"></i>
            </span>
            Weather data from{' '}
            <a href="https://openweathermap.org/" target="_blank">
              OpenWeather.com
            </a>{' '}
            API
          </li>
          <li>
            <span className="fa-li">
              <i className="fas fa-images"></i>
            </span>
            Images from{' '}
            <a href="https://unsplash.com/" target="_blank">
              Unsplash.com
            </a>{' '}
            API
          </li>
          <li>
            <span className="fa-li">
              <i className="fas fa-cloud-sun-rain"></i>
            </span>
            Weather Icon library by{' '}
            <a
              href="https://erikflowers.github.io/weather-icons/"
              target="_blank"
            >
              Erik Flowers
            </a>
          </li>
          <li>
            <span className="fa-li">
              <i className="fas fa-palette"></i>
            </span>
            Weather Icon art by{' '}
            <a href="https://twitter.com/artill" target="_blank">
              Lukas Bischoff
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default InfoModal;

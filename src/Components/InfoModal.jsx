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
            created by{' '}
            <a href="https://ptrchoi.com" target="_blank">
              Peter Choi
            </a>
          </p>
        </div>
        <span className="horizontal-divider"></span>
        <ul className="fa-ul">
          <li>
            <span className="bullet-wrapper fa-li">
              <i className="fas fa-umbrella"></i>
            </span>
            <span className="li-text">
              Weather data -{' '}
              <a href="https://openweathermap.org/" target="_blank">
                OpenWeather.com
              </a>
            </span>
          </li>
          <li>
            <span className="bullet-wrapper fa-li">
              <i className="fas fa-images"></i>
            </span>
            <span className="li-text">
              Images -{' '}
              <a href="https://unsplash.com/" target="_blank">
                Unsplash.com
              </a>
            </span>
          </li>
          <li>
            <span className="bullet-wrapper fa-li">
              <i className="fas fa-cloud-sun-rain"></i>
            </span>
            <span className="li-text">
              Weather icons -{' '}
              <a
                href="https://erikflowers.github.io/weather-icons/"
                target="_blank"
              >
                Erik Flowers
              </a>
            </span>
          </li>
          <li>
            <span className="bullet-wrapper fa-li">
              <i className="fas fa-palette"></i>
            </span>
            <span className="li-text">
              Weather icon art -{' '}
              <a href="https://twitter.com/artill" target="_blank">
                Lukas Bischoff
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default InfoModal;

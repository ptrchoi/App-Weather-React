import React from 'react';

function InfoModal(props) {
  let { modalOpen } = props;
  const modalOnOff = modalOpen ? 'modal-container' : 'modal-container hidden';

  return <div className={modalOnOff}></div>;
}

export default InfoModal;

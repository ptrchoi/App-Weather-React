import React from 'react';

function MenuButton(props) {
  let { modalOpen } = props;
  const iconClass = modalOpen
    ? 'burger-icon burger-icon--closed'
    : 'burger-icon';

  return (
    <div className={iconClass} onClick={props.onMenuToggle}>
      <div className="burger-icon--bar1" />
      <div className="burger-icon--bar2" />
      <div className="burger-icon--bar3" />
    </div>
  );
}

export default MenuButton;

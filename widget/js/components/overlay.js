import React from 'react';
import Spinner from 'react-spinkit';
import '../../css/overlay.css';

const Overlay = ({ isLoading, render, onClickClose, ...rest }) => (
  <nav className="Overlay">
    {isLoading ? (
      <Spinner />
    ) : (
      <div>
        <button
          key="closeButton"
          className="Overlay-close"
          onClick={onClickClose}
        >
          x
        </button>
        {render({ isLoading, onClickClose, ...rest })}
      </div>
    )}
  </nav>
);

Overlay.defaultProps = {
  isLoading: false
};

export default Overlay;

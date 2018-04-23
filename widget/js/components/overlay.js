import React, { Fragment } from 'react';
import Spinner from 'react-spinkit';
import '../../css/overlay.css';

const Overlay = ({ isLoading, render, onClickClose, ...rest }) => (
  <nav className="Overlay">
    {isLoading ? (
      <Spinner />
    ) : (
      <Fragment>
        <div className="Overlay-main">
          {render({ isLoading, onClickClose, ...rest })}
        </div>
        <button
          key="closeButton"
          className="Overlay-close btn btn-primary"
          onClick={onClickClose}
        >
          Close
        </button>
      </Fragment>
    )}
  </nav>
);

Overlay.defaultProps = {
  isLoading: false
};

export default Overlay;

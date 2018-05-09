import React, { Fragment } from 'react';
import Spinner from 'react-spinkit';
import '../../css/overlay.css';

const Overlay = ({
  isLoading,
  render,
  onClickClose,
  showSubmit,
  onClickSubmit,
  submitText,
  ...rest
}) => (
  <nav className="Overlay">
    {isLoading ? (
      <Spinner />
    ) : (
      <Fragment>
        <div className="Overlay-main">
          {render({ isLoading, onClickClose, ...rest })}
        </div>
        <hr className="Overlay-divider" />
        <div className="Overlay-controls">
          {showSubmit && (
            <button className="btn btn-primary" onClick={onClickSubmit}>
              {submitText || 'Submit'}
            </button>
          )}
          <button
            key="closeButton"
            className="Overlay-close btn btn-primary"
            onClick={onClickClose}
          >
            Close
          </button>
        </div>
      </Fragment>
    )}
  </nav>
);

Overlay.defaultProps = {
  isLoading: false,
  showSubmit: false
};

export default Overlay;

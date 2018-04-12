import React from 'react';
import { noop } from '../utilities/noop';
import '../../css/link-arrow.css';

export default ({ direction, onClick }) => (
  <span className={`arrow ${direction}-arrow`} onClick={onClick || noop} />
);

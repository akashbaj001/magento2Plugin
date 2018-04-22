import React from 'react';
import { Link } from 'react-router-dom';
import Arrow from './link-arrow';
import { reminders, history, info } from '../constants/routes';
import '../../css/account.css';

const Account = ({ customerName }) => (
  <div className="Account">
    <div className="Account-banner titleBarBackgroundTheme">
      <div className="Account-banner-content">
        <span className="Account-welcome">Welcome</span>
        <span className="Account-customerName">{customerName}</span>
      </div>
    </div>
    <ul className="Account-list">
      <li className="Account-list-item">
        <Link to={reminders}>
          Reminders <Arrow direction="right" />
        </Link>
      </li>
      <li className="Account-list-item">
        <Link to={history}>
          Order History <Arrow direction="right" />
        </Link>
      </li>
      <li className="Account-list-item">
        <Link to={info}>
          Billing/shipping <Arrow direction="right" />
        </Link>
      </li>
    </ul>
  </div>
);

export default Account;

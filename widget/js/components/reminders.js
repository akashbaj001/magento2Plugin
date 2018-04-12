import React from 'react';
import ReminderList from './component-list';
import Toggle from 'react-toggle';
import { products } from '../constants/routes';
import { Link } from 'react-router-dom';
import 'react-toggle/style.css';
import '../../css/reminders.css';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const formatDate = date =>
  `${
    MONTHS[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}, ${date.getHours() % 12 || 12}:${(
    '0' + date.getMinutes()
  ).slice(-2)}${(date.getHours() % 12 || 12) - 12 > 0 ? 'am' : 'pm'}`;

const Reminders = ({
  reminders,
  areRemindersEnabled,
  onToggleReminders,
  onClickRemoveReminder
}) => (
  <div className="Reminders">
    <h1 className="Reminders-header">Purchase Reminders</h1>
    <div className="Reminders-toggle-wrapper">
      <span id="Reminders-toggle-label">Enable purchase reminders:</span>
      <Toggle
        className="Reminders-toggle"
        checked={areRemindersEnabled}
        onChange={onToggleReminders}
      />
    </div>
    <ReminderList
      items={reminders}
      onClickRemoveReminder={onClickRemoveReminder}
      renderedElement={({ date, reminder, sku, arrayIndex }) => (
        <div key={arrayIndex} className="Reminder">
          <div className="Reminder-left">
            <p className="Reminder-date">{formatDate(new Date(date))}</p>
            <p className="Reminder-text">{reminder}</p>
          </div>
          <div className="Reminder-right">
            <span
              name={arrayIndex}
              onClick={() => onClickRemoveReminder(arrayIndex)}
              className="Reminder-remove"
            >
              x
            </span>
          </div>
        </div>
      )}
    />
  </div>
);

export default Reminders;

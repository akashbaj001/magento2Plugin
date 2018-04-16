import React, { Component } from 'react';
import Reminders from '../components/reminders';
import Spinner from 'react-spinkit';

class RemindersContainer extends Component {
  state = {
    isHydrated: false
  };

  componentDidMount() {
    buildfire.auth.login(
      null,
      (err, { userToken }) =>
        userToken
          ? buildfire.datastore.get(`reminders${userToken}`, (err, res) =>
              buildfire.notifications.localNotification.schedule(
                { title: '', text: '', at: new Date(), data: { sku: '' } },
                (err, data) =>
                  buildfire.datastore.save(
                    {
                      ...res.data,
                      reminders: [
                        ...(res.data.reminders ? res.data.reminders : []),
                        {
                          reminder:
                            'Time to order new blades. Save 10% if you order in the next two days.',
                          sku: '00156',
                          date: new Date().toString(),
                          notificationId: data.id
                        }
                      ]
                    },
                    `reminders${userToken}`,
                    () =>
                      buildfire.datastore.get(
                        `reminders${userToken}`,
                        (err, res) =>
                          this.setState({
                            isHydrated: true,
                            reminders: res.data.reminders.sort(
                              (a, b) => new Date(b.date) - new Date(a.date)
                            ),
                            areRemindersEnabled: res.data.areRemindersEnabled
                          })
                      )
                  )
              )
            )
          : this.setState({
              isHydrated: true,
              reminders: [],
              areRemindersEnabled: true
            })
    );
  }

  handleToggleReminders = () =>
    // TODO also cancel all or reschedule all local notifications
    buildfire.auth.getCurrentUser((err, { userToken }) =>
      this.setState(
        ({ areRemindersEnabled }) => ({
          areRemindersEnabled: !areRemindersEnabled
        }),
        () =>
          buildfire.datastore.save(
            {
              reminders: [...this.state.reminders],
              areRemindersEnabled: this.state.areRemindersEnabled
            },
            `reminders${userToken}`,
            (err, status) =>
              err
                ? this.setState(prevState => ({
                    areRemindersEnabled: !areRemindersEnabled
                  }))
                : {}
          )
      )
    );

  handleClickRemoveReminder = name =>
    buildfire.auth.getCurrentUser((err, { userToken }) =>
      this.setState(
        ({ reminders }) => ({
          reminders: [
            ...reminders.slice(0, parseInt(name, 10)),
            ...reminders.slice(parseInt(name, 10) + 1)
          ]
        }),
        () =>
          buildfire.datastore.save(
            {
              reminders: [
                ...this.state.reminders.slice(0, parseInt(name, 10)),
                ...this.state.reminders.slice(parseInt(name, 10) + 1)
              ],
              areRemindersEnabled: this.state.areRemindersEnabled
            },
            `reminders${userToken}`,
            (err, status) =>
              err
                ? this.setState({ reminders })
                : window.buildfire.notifications.localNotification.cancel(
                    reminders[parseInt(name, 10)].notificationId
                  )
          )
      )
    );

  render() {
    return this.state.isHydrated ? (
      <Reminders
        reminders={this.state.reminders}
        areRemindersEnabled={this.state.areRemindersEnabled}
        onToggleReminders={this.handleToggleReminders}
        onClickRemoveReminder={this.handleClickRemoveReminder}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default RemindersContainer;

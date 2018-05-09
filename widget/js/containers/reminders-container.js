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
      (err, customer) =>
        customer
          ? buildfire.publicData.get(
              `reminders${customer.userToken}`,
              (err, res) =>
                res.data.areRemindersEnabled
                  ? buildfire.notifications.localNotification.schedule(
                      {
                        title: 'Every Man Jack',
                        text:
                          'Time to order new blades. Save 10% if you order in the next two days.',
                        at: new Date(),
                        data: { sku: '00156' }
                      },
                      (err, data) =>
                        buildfire.publicData.save(
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
                          `reminders${customer.userToken}`,
                          () =>
                            buildfire.publicData.get(
                              `reminders${customer.userToken}`,
                              (err, res) =>
                                this.setState({
                                  isHydrated: true,
                                  reminders: res.data.reminders.sort(
                                    (a, b) =>
                                      new Date(b.date) - new Date(a.date)
                                  ),
                                  areRemindersEnabled:
                                    res.data.areRemindersEnabled
                                })
                            )
                        )
                    )
                  : this.setState({
                      isHydrated: true,
                      reminders: res.data.reminders.sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                      ),
                      areRemindersEnabled: res.data.areRemindersEnabled
                    })
            )
          : this.setState({
              isHydrated: true,
              reminders: [],
              areRemindersEnabled: true
            })
    );
  }

  handleToggleReminders = () =>
    buildfire.auth.login(
      null,
      (err, customer) =>
        customer
          ? this.setState(
              ({ areRemindersEnabled }) => ({
                areRemindersEnabled: !areRemindersEnabled
              }),
              () =>
                buildfire.publicData.save(
                  {
                    reminders: [...this.state.reminders],
                    areRemindersEnabled: this.state.areRemindersEnabled
                  },
                  `reminders${customer.userToken}`,
                  (err, status) =>
                    err
                      ? this.setState(prevState => ({
                          areRemindersEnabled: !prevState.areRemindersEnabled
                        }))
                      : this.state.areRemindersEnabled
                        ? this.state.reminders.forEach(
                            ({ date, reminder, sku }) =>
                              buildfire.notifications.localNotification.schedule(
                                // TODO check that its date is greater than now() before scheduling a duplicate one
                                {
                                  title: 'Every Man Jack',
                                  text: reminder,
                                  at: date,
                                  data: { sku }
                                }
                              )
                          )
                        : this.state.reminders.forEach(({ notificationId }) =>
                            buildfire.notifications.localNotification.cancel(
                              notificationId
                            )
                          )
                )
            )
          : {}
    );

  handleClickRemoveReminder = name =>
    buildfire.auth.login(
      null,
      (err, customer) =>
        customer
          ? buildfire.publicData.save(
              {
                reminders: this.state.reminders.filter(
                  (reminder, idx) => idx !== parseInt(name, 10)
                ),
                areRemindersEnabled: this.state.areRemindersEnabled
              },
              `reminders${customer.userToken}`,
              (err, status) => {
                if (!err) {
                  window.buildfire.notifications.localNotification.cancel(
                    this.state.reminders[parseInt(name, 10)].notificationId
                  );
                  this.setState(({ reminders }) => ({
                    reminders: reminders.filter(
                      (reminder, idx) => idx !== parseInt(name, 10)
                    )
                  }));
                }
              }
            )
          : {}
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

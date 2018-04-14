import React, { Component } from 'react';
import Account from '../components/account';
import Spinner from 'react-spinkit';

class AccountContainer extends Component {
  state = {
    isHydrated: false
  };

  componentDidMount() {
    //buildfire.auth.login(null, (err, { firstName }) =>
    this.setState({ customerName: /*firstName ||*/ '', isHydrated: true });
    //);
  }

  render() {
    return this.state.isHydrated ? (
      <Account customerName={this.state.customerName} />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default AccountContainer;

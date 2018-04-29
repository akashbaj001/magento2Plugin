import React, { Component } from 'react';
import Account from '../components/account';
import Spinner from 'react-spinkit';
import { home, root } from '../constants/routes';
import { Link, withRouter } from 'react-router-dom';

class AccountContainer extends Component {
  state = {
    isHydrated: false
  };

  isHome = () =>
    this.props.location.pathname === root ||
    this.props.location.pathname === home;

  goBack = () => !this.isHome() && this.props.history.goBack();

  componentDidMount() {
    buildfire.auth.login(
      null,
      (err, res) =>
        res
          ? this.setState({
              customerName: (res && res.firstName) || '',
              isHydrated: true
            })
          : this.goBack()
    );
  }

  render() {
    return this.state.isHydrated ? (
      <Account customerName={this.state.customerName} />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default withRouter(AccountContainer);

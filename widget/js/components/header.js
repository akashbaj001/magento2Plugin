import React, { Component } from 'react';
import Arrow from './link-arrow';
import { home, root } from '../constants/routes';
import { Link, withRouter } from 'react-router-dom';
import { getLogo } from '../utilities/media-utils';
import '../../css/header.css';

class Header extends Component {
  isHome = () =>
    this.props.location.pathname === root ||
    this.props.location.pathname === home;

  goBack = () => !this.isHome() && this.props.history.goBack();

  render() {
    return (
      <header className="Header">
        {!this.isHome() && <Arrow direction="left" onClick={this.goBack} />}
        <Link to={home}>
          <img className="Header-logo" src={this.props.logoImageURL} />
        </Link>
      </header>
    );
  }
}

export default withRouter(Header);

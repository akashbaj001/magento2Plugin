import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import {
  home,
  category,
  subcategory,
  cart,
  account,
  history,
  product,
  reminders,
  info,
  products
} from './constants/routes';
import Header from './components/header';
import Nav from './components/nav';
import HomeContainer from './containers/home-container';
import ProductContainer from './containers/product-container';
import BrowseContainer from './containers/browse-container';
import CartContainer from './containers/cart-container';
import AccountContainer from './containers/account-container';
import HistoryContainer from './containers/history-container';
import RemindersContainer from './containers/reminders-container';
import InfoContainer from './containers/info-container';
import SubcategoryContainer from './containers/subcategory-container';
import NotFound from './components/not-found';
import '../css/bootstrap.css';
import '../css/core.css';

class App extends Component {
  state = {
    isHydrated: false,
    shouldShowHeader: true
  };

  componentWillMount() {
    buildfire.datastore.onUpdate(({ data: { content } }) => {
      this.setState({ logoImageURL: content.logoImageURL });
    }, true);
    this.setState({
      logoImageURL: window.buildfireConfig.logoImageURL,
      isHydrated: true
    });
  }

  componentDidMount() {
    buildfire.navigation.onAppLauncherInactive(() =>
      this.setState({ shouldShowHeader: false })
    );
    buildfire.navigation.onAppLauncherActive(() =>
      this.setState({ shouldShowHeader: true })
    );
    window.buildfire.notifications.localNotification.onClick = ({ sku }) =>
      this.setState({ redirectSku: sku });
  }

  render() {
    return (
      <Router>
        <div id="main">
          <Redirect exact from="/" to="/home" />
          {this.state.redirectSku && (
            <Redirect to={`${products}/${this.state.redirectSku}`} />
          )}
          {this.state.isHydrated && (
            <Fragment>
              {this.state.shouldShowHeader && (
                <Header logoImageURL={this.state.logoImageURL} />
              )}
              <Switch>
                <Route exact path={home} component={HomeContainer} />
                <Route path={category} component={BrowseContainer} />
                <Route path={subcategory} component={SubcategoryContainer} />
                <Route path={cart} component={CartContainer} />
                <Route path={history} component={HistoryContainer} />
                <Route path={reminders} component={RemindersContainer} />
                <Route path={info} component={InfoContainer} />
                <Route path={account} component={AccountContainer} />
                <Route path={product} component={ProductContainer} />
                <Route component={NotFound} />
              </Switch>
              <Nav />
            </Fragment>
          )}
        </div>
      </Router>
    );
  }
}

render(<App />, document.getElementById('content'));

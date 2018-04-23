import React, { Component } from 'react';
import { getOrdersForCustomer } from '../services/orders-service';
import { getCustomer, getCart, addToCart } from '../services/cart-service';
import History from '../components/history';
import Spinner from 'react-spinkit';
import { home, root, cart } from '../constants/routes';
import { withRouter } from 'react-router-dom';

class HistoryContainer extends Component {
  state = {
    isHydrated: false,
    expandedKeys: []
  };

  isHome = () =>
    this.props.location.pathname === root ||
    this.props.location.pathname === home;

  goBack = () => !this.isHome() && this.props.history.goBack();

  componentDidMount() {
    buildfire.auth.login(
      null,
      (err, customer) =>
        /*customer
          ?*/ getCustomer(
          /*customer.SSO.accessToken*/ 'u5rwuq1uvv0c73ktu2qnsmovyix2ee8p'
        ).then(custRes =>
          getOrdersForCustomer(JSON.parse(custRes).id).then(res =>
            this.setState({ isHydrated: true, orders: JSON.parse(res) })
          )
        )
      //: this.goBack()
    );
  }

  handleClickReorder = ({ target }) =>
    buildfire.auth.login(
      null,
      (err, customer) =>
        customer
          ? getCart(customer.SSO.accessToken).then(cartRes =>
              Promise.all(
                this.state.orders.items
                  .find(({ increment_id }) => increment_id === target.name)
                  .items.map(({ sku, qty_ordered }) =>
                    addToCart(
                      {
                        sku,
                        qty: qty_ordered,
                        quoteID: JSON.parse(cartRes).id
                      },
                      customer.SSO.accessToken
                    )
                  )
              ).then(res => this.props.history.push(cart))
            )
          : {}
    );

  handleAccordionChange = expandedKeys => this.setState({ expandedKeys });

  render() {
    return this.state.isHydrated ? (
      <History
        orders={this.state.orders}
        expandedKeys={this.state.expandedKeys}
        onClickReorder={this.handleClickReorder}
        onAccordionChange={this.handleAccordionChange}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default withRouter(HistoryContainer);

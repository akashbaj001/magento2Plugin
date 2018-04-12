import React, { Component } from 'react';
import { getOrdersForCustomer } from '../services/orders-service';
import { addToCart } from '../services/cart-service';
import History from '../components/history';
import Spinner from 'react-spinkit';

class HistoryContainer extends Component {
  state = {
    isHydrated: false
  };

  componentDidMount() {
    getOrdersForCustomer(34826) // TODO
      .then(res => this.setState({ isHydrated: true, orders: JSON.parse(res) }))
      .catch(err => console.log(err));
  }

  handleClickReorder = ({ target }) =>
    Promise.all(
      this.state.orders.items
        .find(({ quote_id }) => quote_id === parseInt(target.name, 10))
        .items.map(({ sku, qty_ordered }) =>
          addToCart({ sku, qty: qty_ordered })
        )
    )
      .then(res => console.log(res))
      .catch(err => console.log(err));

  render() {
    return this.state.isHydrated ? (
      <History
        orders={this.state.orders}
        onClickReorder={this.handleClickReorder}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default HistoryContainer;

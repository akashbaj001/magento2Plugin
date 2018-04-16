import React, { Component } from 'react';
import { getOrdersForCustomer } from '../services/orders-service';
import { getCustomer, addToCart } from '../services/cart-service';
import History from '../components/history';
import Spinner from 'react-spinkit';

class HistoryContainer extends Component {
  state = {
    isHydrated: false
  };

  componentDidMount() {
    getCustomer().then(custRes =>
      getOrdersForCustomer(JSON.parse(custRes).id).then(res =>
        this.setState({ isHydrated: true, orders: JSON.parse(res) })
      )
    );
  }

  handleClickReorder = ({ target }) =>
    Promise.all(
      this.state.orders.items
        .find(({ quote_id }) => quote_id === parseInt(target.name, 10))
        .items.map(({ sku, qty_ordered }) =>
          addToCart({ sku, qty: qty_ordered })
        )
    )
      .then(res => console.log(res)) // TODO add to cart, route to cart page
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

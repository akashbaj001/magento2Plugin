import React, { Component } from 'react';
import {
  getCart,
  getShippingMethods,
  placeOrder,
  removeFromCart
} from '../services/cart-service';
import { getProduct } from '../services/product-service';
import Cart from '../components/cart';
import Spinner from 'react-spinkit';

class CartContainer extends Component {
  state = {
    isHydrated: false,
    shouldShowShippingMenu: false,
    shouldShowCouponOverlay: false,
    couponCode: ''
  };

  componentDidMount() {
    // TODO if you press cancel login it still reroutes
    buildfire.auth.login({}, () =>
      getCart()
        .then(res => {
          const parsedRes = JSON.parse(res);

          getShippingMethods().then(shippingMethods => {
            Promise.all(parsedRes.items.map(({ sku }) => getProduct(sku))).then(
              products => {
                const parsedShippingMethods = JSON.parse(shippingMethods);
                this.setState({
                  isHydrated: true,
                  items: parsedRes.items.map(item => ({
                    ...item,
                    productDetails: products
                      .map(product => JSON.parse(product))
                      .find(({ sku }) => sku === item.sku)
                  })),
                  shippingMethods: parsedShippingMethods.filter(
                    ({ available }) => available
                  ),
                  selectedShippingMethod:
                    (parsedShippingMethods &&
                      parsedShippingMethods.length > 0 &&
                      parsedShippingMethods[0]) ||
                    null
                });
              }
            );
          });
        })
        .catch(err => console.log(err))
    );
  }

  handleChangeQuantity = ({ target }) =>
    this.setState(({ items }) => {
      if (isNaN(target.value)) {
        return {};
      }
      const newItems = [...items];
      const itemIndex = newItems.findIndex(
        item => item.item_id === parseInt(target.name, 10)
      );
      if (target.value <= 1) {
        newItems[itemIndex].qty = 1;
      } else {
        newItems[itemIndex].qty = parseInt(target.value, 10);
      }

      return { items: newItems };
    });

  handleQuantityDecrement = id =>
    this.setState(({ items }) => {
      const newItems = [...items];
      const itemIndex = newItems.findIndex(item => item.item_id === id);
      const currQty = newItems[itemIndex].qty;
      newItems[itemIndex].qty = currQty <= 1 ? 1 : currQty - 1;
      return { items: newItems };
    });

  handleQuantityIncrement = id =>
    this.setState(({ items }) => {
      const newItems = [...items];
      const itemIndex = newItems.findIndex(item => item.item_id === id);
      newItems[itemIndex].qty += 1;
      return { items: newItems };
    });

  handleClickRemove = id => {
    buildfire.auth.login({}, () => {
      // Save current set of items in case removal request fails.
      const oldItems = this.state.items;
      this.setState(
        ({ items }) => {
          const newItems = [...items];
          return { items: newItems.filter(item => item.item_id != id) };
        },
        () => removeFromCart(id).catch(() => this.setState({ items: oldItems }))
      );
    });
  };

  handleClickChangeShipping = () =>
    this.setState({ shouldShowShippingMenu: true });

  handleClickCloseShipping = () =>
    this.setState({ shouldShowShippingMenu: false });

  handleClickShippingMethod = methodCode =>
    this.setState({
      selectedShippingMethod: this.state.shippingMethods.find(
        ({ method_code }) => methodCode === method_code
      )
    });

  handleClickCloseCouponOverlay = () =>
    this.setState({ shouldShowCouponOverlay: false });

  handleClickApplyCoupon = () =>
    this.setState({ shouldShowCouponOverlay: true });

  handleClickCheckout = () =>
    buildfire.auth.login(null, () =>
      placeOrder()
        .then(res => {
          console.log(res);
          // TODO
          // to get the two below custom attributes you have to do a GET to the product details for every product purchased
          // if purchased product has app_product_reminder_enabled = "1", add reminder to datastore, schedule local notification (if enabled)
          // when adding to data store, include app_product_reminder_message
          if (true) {
            buildfire.datastore.insert(
              {
                reminders: [
                  {
                    reminder:
                      'Time to order new blades. Save 10% if you order in the next two days.',
                    sku: '01007',
                    date: ''
                  }
                ]
              },
              'reminders',
              false
            );
          }
        })
        .catch(err => console.log(err))
    );

  handleInputChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  getSubtotal = () =>
    this.state.items.reduce((acc, curr) => (acc += curr.price * curr.qty), 0);

  getShipping = () =>
    this.state.selectedShippingMethod
      ? this.state.selectedShippingMethod.amount
      : {};

  getDiscount = () => 0; // TODO

  getTaxes = () => 0; // TODO

  getTotal = () =>
    this.getSubtotal() +
    this.getShipping() -
    this.getDiscount() +
    this.getTaxes();

  render() {
    return this.state.isHydrated ? (
      <Cart
        items={this.state.items}
        onInputChange={this.handleInputChange}
        shouldShowCouponOverlay={this.state.shouldShowCouponOverlay}
        onClickCloseCouponOverlay={this.handleClickCloseCouponOverlay}
        couponCode={this.state.couponCode}
        shippingMethods={this.state.shippingMethods}
        selectedShippingMethod={this.state.selectedShippingMethod}
        onChangeQuantity={this.handleChangeQuantity}
        onQuantityDecrement={this.handleQuantityDecrement}
        onQuantityIncrement={this.handleQuantityIncrement}
        onClickRemove={this.handleClickRemove}
        onClickChangeShipping={this.handleClickChangeShipping}
        onClickCloseShipping={this.handleClickCloseShipping}
        onClickShippingMethod={this.handleClickShippingMethod}
        onClickCheckout={this.handleClickCheckout}
        onClickApplyCoupon={this.handleClickApplyCoupon}
        shouldShowShippingMenu={this.state.shouldShowShippingMenu}
        subTotal={this.getSubtotal()}
        shipping={this.getShipping()}
        discount={this.getDiscount()}
        taxes={this.getTaxes()}
        total={this.getTotal()}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default CartContainer;

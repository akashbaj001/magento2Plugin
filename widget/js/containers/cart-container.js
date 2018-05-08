import React, { Component } from 'react';
import {
  getCart,
  placeOrder,
  removeFromCart,
  getTotals,
  addCoupon,
  getCoupons,
  getShippingAddress,
  setShippingAddress,
  setPaymentInformation,
  getBillingAddress,
  estimateShippingMethods
} from '../services/cart-service';
import { getProduct } from '../services/product-service';
import Cart from '../components/cart';
import Spinner from 'react-spinkit';
import { info, home, root } from '../constants/routes';
import { withRouter } from 'react-router-dom';

class CartContainer extends Component {
  state = {
    isHydrated: false,
    shouldShowShippingMenu: false,
    shouldShowCouponOverlay: false,
    shouldShowPaymentOverlay: false,
    couponCodeInput: '',
    shippingMethods: [],
    items: [],
    cardMonth: 'Jan - 01'
  };

  isHome = () =>
    this.props.location.pathname === root ||
    this.props.location.pathname === home;

  goBack = () => !this.isHome() && this.props.history.goBack();

  componentDidMount() {
    buildfire.auth.login({}, (err, customer) => {
      if (customer) {
        const cart = JSON.parse(sessionStorage.getItem('cart'));
        if (cart) {
          this.fetchRemainingCartData(cart);
        } else {
          getCart(customer.SSO.accessToken).then(res => {
            const parsedRes = JSON.parse(res);
            sessionStorage.setItem('cart', res);
            this.fetchRemainingCartData(parsedRes);
          });
        }
      } else {
        this.goBack();
      }
    });
  }

  fetchRemainingCartData = cart =>
    getCoupons(customer.SSO.accessToken).then(unparsedCoupons =>
      getTotals(customer.SSO.accessToken).then(unparsedTotals =>
        Promise.all(
          cart.items.map(({ sku }) => {
            const productFromStorage = sessionStorage.getItem(`product${sku}`);
            return productFromStorage
              ? Promise.resolve(productFromStorage)
              : getProduct(sku);
          })
        ).then(products => {
          products.map(product =>
            sessionStorage.setItem(
              `product${product.sku}`,
              JSON.stringify(product)
            )
          );
          const totals = JSON.parse(unparsedTotals);
          const couponCodes = JSON.parse(unparsedCoupons);
          this.setState({
            isHydrated: true,
            items: cart.items.map(item => ({
              ...item,
              productDetails: products
                .map(product => JSON.parse(product))
                .find(({ sku }) => sku === item.sku)
            })),
            discount: totals.discount_amount,
            taxes: totals.tax_amount,
            subTotal: totals.subtotal,
            shipping: totals.shipping_amount,
            total: totals.grand_total,
            couponCode:
              couponCodes && couponCodes.length > 0
                ? `Coupon Code: ${couponCodes}`
                : '',
            cart
          });
          getShippingAddress(customer.SSO.accessToken)
            .then(unparsedShippingAddress => {
              const shippingAddress = JSON.parse(unparsedShippingAddress);
              if (
                Array.isArray(shippingAddress) &&
                shippingAddress.length === 0
              ) {
                this.props.history.push(info); // TODO some kind of indicator
              }
              estimateShippingMethods(
                shippingAddress.id,
                customer.SSO.accessToken
              ).then(shippingMethods => {
                const parsedShippingMethods = JSON.parse(shippingMethods);
                this.setState({
                  shippingMethods: parsedShippingMethods.filter(
                    ({ available }) => available
                  ),
                  selectedShippingMethod:
                    (parsedShippingMethods &&
                      parsedShippingMethods.length > 0 &&
                      parsedShippingMethods[0]) ||
                    null
                });
              });
            })
            .catch(
              err => console.log(err) || this.setState({ isHydrated: true })
            );
        })
      )
    );

  fetchTotals = () =>
    buildfire.auth.login({}, (err, customer) => {
      if (customer) {
        Promise.resolve(
          getTotals(customer.SSO.accessToken).then(unparsedTotals => {
            const totals = JSON.parse(unparsedTotals);
            this.setState({
              discount: totals.discount_amount,
              taxes: totals.tax_amount,
              subTotal: totals.subtotal,
              shipping: totals.shipping_amount,
              total: totals.grand_total
            });
          })
        );
      }
    });

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
    }, this.fetchTotals);

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
    }, this.fetchTotals);

  handleClickRemove = id => {
    buildfire.auth.login({}, (err, customer) => {
      if (customer) {
        // Save current set of items in case removal request fails.
        const oldItems = this.state.items;
        this.setState(
          ({ items }) => {
            const newItems = [...items];
            return { items: newItems.filter(item => item.item_id != id) };
          },
          () =>
            removeFromCart(id, customer.SSO.accessToken)
              .then(() => {
                this.fetchTotals();
                sessionStorage.removeItem('cart');
              })
              .catch(() => this.setState({ items: oldItems }))
        );
      }
    });
  };

  handleClickChangeShipping = () =>
    this.setState({ shouldShowShippingMenu: true });

  handleClickCloseShipping = () =>
    this.setState({ shouldShowShippingMenu: false }, this.fetchTotals);

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

  handleClickSubmitCoupon = code =>
    this.setState({ shouldShowCouponOverlay: false }, () =>
      buildfire.auth.login({}, (err, customer) =>
        this.setState({ couponCode: 'Applying code...' }, () =>
          addCoupon(code, customer.SSO.accessToken)
            .then(() =>
              this.setState(
                { couponCode: `Coupon Code: ${code}` },
                this.fetchTotals
              )
            )
            .catch(() =>
              this.setState({ couponCode: 'Coupon code is not valid.' })
            )
        )
      )
    );

  handleClickCheckout = () => this.setState({ shouldShowPaymentOverlay: true });

  handleClickSubmitPayment = () =>
    buildfire.auth.login(
      null,
      (err, customer) =>
        customer
          ? getShippingAddress(customer.SSO.accessToken).then(
              unparsedShippingAddress => {
                const shippingAddress = JSON.parse(unparsedShippingAddress);
                if (
                  Array.isArray(shippingAddress) &&
                  shippingAddress.length === 0
                ) {
                  this.props.history.push(info); // TODO some kind of indicator
                }
                setShippingAddress(
                  {
                    region: shippingAddress.region.region_code,
                    country_id: shippingAddress.country_id,
                    street: shippingAddress.street,
                    telephone: shippingAddress.telephone,
                    postcode: shippingAddress.postcode,
                    city: shippingAddress.city,
                    firstname: shippingAddress.firstname,
                    lastname: shippingAddress.lastname
                  },
                  this.state.selectedShippingMethod.carrier_code,
                  this.state.selectedShippingMethod.method_code,
                  customer.SSO.accessToken
                ).then(() =>
                  getBillingAddress(customer.SSO.accessToken).then(
                    unparsedBillingAddress => {
                      const billingAddress = JSON.parse(unparsedBillingAddress);
                      if (
                        Array.isArray(billingAddress) &&
                        billingAddress.length === 0
                      ) {
                        this.props.history.push(info); // TODO some kind of indicator
                      }
                      setPaymentInformation(
                        this.state.cart.id,
                        {
                          city: billingAddress.city,
                          countryId: billingAddress.country_id,
                          customerId: billingAddress.customer_id,
                          firstname: billingAddress.firstname,
                          lastname: billingAddress.lastname,
                          postcode: billingAddress.postcode,
                          region: billingAddress.region.region,
                          regionCode: billingAddress.region.region_code,
                          regionId: billingAddress.region.region_id,
                          street: billingAddress.street,
                          telephone: billingAddress.telephone
                        },
                        customer.SSO.accessToken
                      ).then(() =>
                        placeOrder(
                          {
                            payment: {
                              method: 'authorizenet_directpost'
                            },
                            'billing-address-same-as-shipping': 'on', // TODO this should probably be off
                            billing_address_id: '',
                            controller: 'checkout_flow',
                            cc_type: 'VI' // TODO won't always be visa... https://stackoverflow.com/questions/72768/how-do-you-detect-credit-card-type-based-on-number
                          },
                          customer.SSO.accessToken
                        )
                          .then(res =>
                            placePayment({
                              ...res.authorizenet_directpost,
                              x_card_code: this.state.verificationNumber,
                              x_exp_date:
                                this.state.cardMonth + this.state.cardYear, // TODO need to format this MM/YY
                              x_card_num: this.state.cardNumber
                            }) // TODO all the arguments to placePayment should be either in the state (CC) or in the response from placeOrder
                              .then(res => {
                                console.log(res);
                                // TODO
                                // to get the two below custom attributes you have to do a GET to the product details for every product purchased
                                // if purchased product has app_product_reminder_enabled = "1", add reminder to datastore, schedule local notification (if enabled)
                                // when adding to data store, include app_product_reminder_message. Also check if areRemindersEnabled in publicData.
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
                          )
                          .catch(err => console.log(err))
                      );
                    }
                  )
                );
              }
            )
          : {}
    );

  handleInputChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  handleClickClosePayment = () =>
    this.setState({ shouldShowPaymentOverlay: false });

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
        subTotal={this.state.subTotal}
        shipping={this.state.shipping}
        discount={this.state.discount}
        taxes={this.state.taxes}
        total={this.state.total}
        couponCodeInput={this.state.couponCodeInput}
        onClickSubmitCoupon={this.handleClickSubmitCoupon}
        cardNumber={this.state.cardNumber}
        cardMonth={this.state.cardMonth}
        verificationNumber={this.state.verificationNumber}
        shouldShowPaymentOverlay={this.state.shouldShowPaymentOverlay}
        cardYear={this.state.cardYear}
        onClickSubmitPayment={this.handleClickSubmitPayment}
        onClickClosePayment={this.handleClickClosePayment}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default withRouter(CartContainer);

import React, { Component } from 'react';
import { getProduct, getAttributeById } from '../services/product-service';
import { getCart, addToCart } from '../services/cart-service';
import Product from '../components/product';
import Spinner from 'react-spinkit';

const FRAGRANCE_ATTRIBUTE_ID = 157;

class ProductContainer extends Component {
  state = {
    isHydrated: false,
    quantity: 1
  };

  componentDidMount() {
    const data = JSON.parse(
      sessionStorage.getItem(`product${this.props.match.params.sku}`)
    );
    data
      ? this.setState(data)
      : getProduct(this.props.match.params.sku)
          .then(res =>
            getAttributeById(FRAGRANCE_ATTRIBUTE_ID).then(fragranceData => {
              const loadData = {
                isHydrated: true,
                product: {
                  ...JSON.parse(res),
                  fragranceData: JSON.parse(fragranceData)
                }
              };
              sessionStorage.setItem(
                `product${this.props.match.params.sku}`,
                JSON.stringify(loadData)
              );
              this.setState(loadData);
            })
          )
          .catch(err => console.log(err));
  }

  handleChangeQuantity = ({ target }) => {
    if (isNaN(target.value)) {
      return;
    }

    if (target.value <= 1) {
      this.setState({ quantity: 1 });
    } else {
      this.setState({ quantity: parseInt(target.value, 10) });
    }
  };

  handleQuantityDecrement = () =>
    this.setState(({ quantity }) => ({
      quantity: quantity <= 1 ? 1 : quantity - 1
    }));

  handleQuantityIncrement = () =>
    this.setState(({ quantity }) => ({ quantity: quantity + 1 }));

  handleClickAddToCart = ({ target }) =>
    buildfire.auth.login(null, (err, customer) => {
      if (customer) {
        const cart = sessionStorage.getItem('cart');
        cart
          ? addToCart(
              {
                sku: target.name,
                qty: this.state.quantity,
                quoteID: cart.id
              },
              customer.SSO.accessToken
            )
          : getCart(customer.SSO.accessToken).then(res =>
              addToCart(
                {
                  sku: target.name,
                  qty: this.state.quantity,
                  quoteID: JSON.parse(res).id
                },
                customer.SSO.accessToken
              )
            );
      }
    });

  render() {
    return this.state.isHydrated ? (
      <Product
        product={this.state.product}
        quantity={this.state.quantity}
        customAttributeDetails={window.buildfireConfig.sections}
        onChangeQuantity={this.handleChangeQuantity}
        onQuantityDecrement={this.handleQuantityDecrement}
        onQuantityIncrement={this.handleQuantityIncrement}
        onClickAddToCart={this.handleClickAddToCart}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default ProductContainer;

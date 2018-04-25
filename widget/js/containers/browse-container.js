import React, { Component } from 'react';
import { getCategoryDetails } from '../services/category-service';
import { getProductsForCategory } from '../services/product-service';
import { getCart, addToCart } from '../services/cart-service';
import Browse from '../components/browse';
import Spinner from 'react-spinkit';

class BrowseContainer extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ isHydrated: false }, this.fetchData);
    }
  }

  state = {
    isHydrated: false
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const data = JSON.parse(
      sessionStorage.getItem(`browse${this.props.match.params.id}`)
    );
    data
      ? this.setState(data)
      : getCategoryDetails(this.props.match.params.id)
          .then(category => {
            getProductsForCategory(this.props.match.params.id).then(
              products => {
                const loadData = {
                  isHydrated: true,
                  products: JSON.parse(products).items.filter(
                    item => item.status === 1
                  ),
                  category: JSON.parse(category)
                };
                sessionStorage.setItem(
                  `browse${this.props.match.params.id}`,
                  JSON.stringify(loadData)
                );
                this.setState(loadData);
              }
            );
          })
          .catch(err => console.log(err));
  };

  handleClickAddToCart = ({ target }) =>
    buildfire.auth.login(null, (err, customer) => {
      if (customer) {
        const cart = sessionStorage.getItem('cart');
        if (cart) {
          addToCart(
            { sku: target.name, qty: 1, quoteID: cart.id },
            customer.SSO.accessToken
          );
        } else {
          getCart(customer.SSO.accessToken).then(res => {
            const parsedCart = JSON.parse(res);
            sessionStorage.setItem('cart', null);
            addToCart(
              {
                sku: target.name,
                qty: 1,
                quoteID: JSON.parse(res).id
              },
              customer.SSO.accessToken
            );
          });
        }
      }
    });

  render() {
    return this.state.isHydrated ? (
      <Browse
        products={this.state.products}
        categoryName={this.state.category.name}
        imageAttributeKey={window.buildfireConfig.productImageAtName}
        shortDescriptionAtName={
          window.buildfireConfig.shortCategoryDescriptionAtName
        }
        onClickAddToCart={this.handleClickAddToCart}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default BrowseContainer;

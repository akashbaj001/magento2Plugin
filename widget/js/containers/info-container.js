import React, { Component } from 'react';
import {
  getCustomer,
  updateCustomer,
  getCountryList
} from '../services/cart-service';
import Info from '../components/info';
import Spinner from 'react-spinkit';

const TYPE_BILLING = 'billing';
const TYPE_SHIPPING = 'shipping';

class InfoContainer extends Component {
  state = {
    isHydrated: false,
    overlayType: 'billing',
    billingCountry: 'United States',
    shippingCountry: 'United States'
  };

  componentDidMount() {
    getCustomer()
      .then(res =>
        getCountryList().then(unparsedCountries =>
          this.setState({
            isHydrated: true,
            customer: JSON.parse(res),
            countryList: JSON.parse(unparsedCountries)
          })
        )
      )
      .catch(err => console.log(err));
  }

  handleClickUpdate = ({ target: name }) =>
    this.setState(() => ({
      shouldShowEditOverlay: true,
      overlayType: name === 'billing' ? TYPE_BILLING : TYPE_SHIPPING
    }));

  handleClickCloseOverlay = () =>
    this.setState({ shouldShowEditOverlay: false });

  // TODO merge old customer model from GET with new customer info from form. The PUT will merge everything for you except addresses array
  handleClickSubmit = () =>
    this.setState({ shouldShowEditOverlay: false }, () =>
      updateCustomer(this.state.customer)
    );

  handleInputChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  render() {
    return this.state.isHydrated ? (
      <Info
        billingAddress={this.state.customer.addresses.find(
          ({ default_billing }) => default_billing
        )}
        shippingAddress={this.state.customer.addresses.find(
          ({ default_shipping }) => default_shipping
        )}
        countryList={this.state.countryList}
        selectedCountryName={this.state[`${this.state.overlayType}Country`]}
        onClickUpdate={this.handleClickUpdate}
        shouldShowEditOverlay={this.state.shouldShowEditOverlay}
        onClickCloseOverlay={this.handleClickCloseOverlay}
        overlayType={this.state.overlayType}
        onClickSubmit={this.handleClickSubmit}
        onInputChange={this.handleInputChange}
        isLoading={this.state.isLoading || !this.state.isHydrated}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default InfoContainer;

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
    buildfire.auth.login(null, () =>
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
        .catch(err => console.log(err))
    );
  }

  handleClickUpdate = ({ target: name }) =>
    this.setState(() => ({
      shouldShowEditOverlay: true,
      overlayType: name === 'billing' ? TYPE_BILLING : TYPE_SHIPPING
    }));

  handleClickCloseOverlay = () =>
    this.setState({ shouldShowEditOverlay: false });

  handleClickSubmit = () =>
    buildfire.auth.login(null, () =>
      this.setState(
        prevState => {
          const customerToUpdate = { ...prevState.customer };
          const addressIndex = customerToUpdate.addresses.findIndex(
            address => ({ default_billing, default_shipping }) =>
              this.state.overlayType == TYPE_BILLING
                ? default_billing
                : default_shipping
          );
          const addressToUpdate = customerToUpdate.addresses[addressIndex];
          addressToUpdate.city = this.state[`${this.state.overlayType}City`];
          addressToUpdate.firstname = this.state[
            `${this.state.overlayType}FirstName`
          ];
          addressToUpdate.lastname = this.state[
            `${this.state.overlayType}LastName`
          ];
          addressToUpdate.telephone = this.state[
            `${this.state.overlayType}PhoneNumber`
          ];
          addressToUpdate.street = [
            this.state[`${this.state.overlayType}StreetAddressOne`],
            this.state[`${this.state.overlayType}StreetAddressTwo`]
          ];
          addressToUpdate.region = {};
          addressToUpdate.region_id = 0;
          addressToUpdate.postcode = this.state[`${this.state.overlayType}Zip`];
          addressToUpdate.country_id = this.state.countryList.find(
            ({ full_name_english }) =>
              full_name_english ===
              this.state[`${this.state.overlayType}Country`]
          ).id;
          addressToUpdate.customer_id = customerToUpdate.id;
          addressToUpdate.default_billing = addressToUpdate.default_billing;
          addressToUpdate.default_shipping = addressToUpdate.default_shipping;
          customerToUpdate.addresses[addressIndex];
          return {
            shouldShowEditOverlay: false,
            customer: customerToUpdate
          };
        },
        () => updateCustomer(this.state.customer)
      )
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

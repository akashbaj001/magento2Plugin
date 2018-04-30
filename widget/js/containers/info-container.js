import React, { Component } from 'react';
import {
  getCustomer,
  updateCustomer,
  getCountryList
} from '../services/cart-service';
import Info from '../components/info';
import Spinner from 'react-spinkit';
import { home, root } from '../constants/routes';
import { withRouter } from 'react-router-dom';

const TYPE_BILLING = 'billing';
const TYPE_SHIPPING = 'shipping';

class InfoContainer extends Component {
  state = {
    isHydrated: false,
    overlayType: 'billing',
    billingCountry: 'United States',
    shippingCountry: 'United States'
  };

  isHome = () =>
    this.props.location.pathname === root ||
    this.props.location.pathname === home;

  goBack = () => !this.isHome() && this.props.history.goBack();

  componentDidMount() {
    buildfire.auth.login(
      null,
      (err, customer) =>
        customer
          ? getCustomer(customer.SSO.accessToken)
              .then(res =>
                getCountryList().then(unparsedCountries =>
                  this.setState(() => {
                    const customerRes = JSON.parse(res);
                    const shipping = customerRes.addresses.find(
                      ({ default_shipping }) => default_shipping
                    );
                    const billing = customerRes.addresses.find(
                      ({ default_billing }) => default_billing
                    );
                    return {
                      isHydrated: true,
                      customer: customerRes,
                      countryList: JSON.parse(unparsedCountries),
                      billingFirstName: billing.firstname || '',
                      billingLastName: billing.lastname || '',
                      billingPhoneNumber: billing.telephone || '',
                      billingStreetAddressOne: billing.street[0] || '',
                      billingStreetAddressTwo: billing.street[1] || '',
                      billingCity: billing.city || '',
                      billingStateProvince: billing.region.region || '',
                      billingZip: billing.postcode || '',
                      billingCountry:
                        billing.full_name_english || 'United States',
                      shippingFirstName: shipping.firstname || '',
                      shippingLastName: shipping.lastname || '',
                      shippingPhoneNumber: shipping.telephone || '',
                      shippingStreetAddressOne: shipping.street[0] || '',
                      shippingStreetAddressTwo: shipping.street[1] || '',
                      shippingCity: shipping.city || '',
                      shippingStateProvince: shipping.region.region || '',
                      shippingZip: shipping.postcode || '',
                      shippingCountry:
                        shipping.full_name_english || 'United States'
                    };
                  })
                )
              )
              .catch(err => console.log(err))
          : this.goBack()
    );
  }

  handleClickUpdate = ({ target: { name } }) =>
    this.setState(() => ({
      shouldShowEditOverlay: true,
      overlayType: name === 'billing' ? TYPE_BILLING : TYPE_SHIPPING
    }));

  handleClickCloseOverlay = () =>
    this.setState({ shouldShowEditOverlay: false });

  handleClickSubmit = () =>
    buildfire.auth.login(
      null,
      (err, customer) =>
        customer
          ? this.setState(
              prevState => {
                const customerToUpdate = JSON.parse(
                  JSON.stringify(prevState.customer)
                );
                const addressIndex = customerToUpdate.addresses.findIndex(
                  address => ({ default_billing, default_shipping }) =>
                    this.state.overlayType == TYPE_BILLING
                      ? default_billing
                      : default_shipping
                );
                const addressToUpdateWithRegion =
                  customerToUpdate.addresses[addressIndex];
                const {
                  region,
                  ...addressToUpdate
                } = addressToUpdateWithRegion;
                addressToUpdate.city = this.state[
                  `${this.state.overlayType}City`
                ];
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
                const selectedRegion = this.state.countryList
                  .find(
                    ({ full_name_english }) =>
                      full_name_english ===
                      this.state[`${this.state.overlayType}Country`]
                  )
                  .available_regions.find(
                    region =>
                      region.name ===
                      this.state[`${this.state.overlayType}StateProvince`]
                  );
                const formattedRegion = {
                  region_id: selectedRegion.id,
                  region: selectedRegion.name,
                  region_code: selectedRegion.code
                };
                addressToUpdate.region = formattedRegion;
                addressToUpdate.region_id = selectedRegion.id;
                addressToUpdate.postcode = this.state[
                  `${this.state.overlayType}Zip`
                ];
                addressToUpdate.country_id = this.state.countryList.find(
                  ({ full_name_english }) =>
                    full_name_english ===
                    this.state[`${this.state.overlayType}Country`]
                ).id;
                addressToUpdate.customer_id = customerToUpdate.id;
                addressToUpdate.default_billing =
                  addressToUpdate.default_billing;
                addressToUpdate.default_shipping =
                  addressToUpdate.default_shipping;
                customerToUpdate.addresses[addressIndex] = addressToUpdate;
                return {
                  shouldShowEditOverlay: false,
                  customer: customerToUpdate
                };
              },
              () => updateCustomer(this.state.customer)
            )
          : {}
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
        billingFirstName={this.state.billingFirstName}
        shippingFirstName={this.state.shippingFirstName}
        billingLastName={this.state.billingLastName}
        shippingLastName={this.state.shippingLastName}
        billingPhoneNumber={this.state.billingPhoneNumber}
        shippingPhoneNumber={this.state.shippingPhoneNumber}
        billingStreetAddressOne={this.state.billingStreetAddressOne}
        shippingStreetAddressOne={this.state.shippingStreetAddressOne}
        billingStreetAddressTwo={this.state.billingStreetAddressTwo}
        shippingStreetAddressTwo={this.state.shippingStreetAddressTwo}
        billingCity={this.state.billingCity}
        shippingCity={this.state.shippingCity}
        billingStateProvince={this.state.billingStateProvince}
        shippingStateProvince={this.state.shippingStateProvince}
        billingZip={this.state.billingZip}
        shippingZip={this.state.shippingZip}
        billingCountry={this.state.billingCountry}
        shippingCountry={this.state.shippingCountry}
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

export default withRouter(InfoContainer);

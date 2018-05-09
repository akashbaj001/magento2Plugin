import React, { Fragment } from 'react';
import Overlay from './overlay';
import '../../css/info.css';

const TYPE_BILLING = 'billing';
const TYPE_SHIPPING = 'shipping';

const Info = ({
  countryList,
  selectedCountryName,
  billingAddress,
  shippingAddress,
  onClickUpdate,
  shouldShowEditOverlay,
  onClickCloseOverlay,
  onClickSubmit,
  overlayType,
  onInputChange,
  shippingFirstName,
  shippingLastName,
  shippingPhoneNumber,
  shippingStreetAddressOne,
  shippingStreetAddressTwo,
  shippingCity,
  shippingStateProvince,
  shippingZip,
  shippingCountry,
  billingFirstName,
  billingLastName,
  billingPhoneNumber,
  billingStreetAddressOne,
  billingStreetAddressTwo,
  billingCity,
  billingStateProvince,
  billingZip,
  billingCountry,
  isLoading
}) => (
  <div className="Info">
    {shouldShowEditOverlay && (
      <Overlay
        onClickSubmit={onClickSubmit}
        onClickClose={onClickCloseOverlay}
        isLoading={isLoading}
        showSubmit
        render={() => (
          <div className="Info-form form-group">
            <h2>Contact Information</h2>
            <label htmlFor="first-name">First Name</label>
            <input
              id="first-name"
              name={`${overlayType}FirstName`}
              className="form-control"
              value={
                overlayType === TYPE_BILLING
                  ? billingFirstName
                  : shippingFirstName
              }
              onChange={onInputChange}
            />
            <label htmlFor="last-name">Last Name</label>
            <input
              id="last-name"
              name={`${overlayType}LastName`}
              className="form-control"
              value={
                overlayType === TYPE_BILLING
                  ? billingLastName
                  : shippingLastName
              }
              onChange={onInputChange}
            />
            <label htmlFor="phone-number">Phone Number</label>
            <input
              id="phone-number"
              name={`${overlayType}PhoneNumber`}
              className="form-control"
              value={
                overlayType === TYPE_BILLING
                  ? billingPhoneNumber
                  : shippingPhoneNumber
              }
              onChange={onInputChange}
            />
            <h2>Address</h2>
            <label htmlFor="street-address">Street Address</label>
            <input
              id="street-address"
              name={`${overlayType}StreetAddressOne`}
              className="form-control"
              value={
                overlayType === TYPE_BILLING
                  ? billingStreetAddressOne
                  : shippingStreetAddressOne
              }
              onChange={onInputChange}
            />
            <input
              id="street-address"
              name={`${overlayType}StreetAddressTwo`}
              className="form-control"
              value={
                overlayType === TYPE_BILLING
                  ? billingStreetAddressTwo
                  : shippingStreetAddressTwo
              }
              onChange={onInputChange}
            />
            <label htmlFor="city">City</label>
            <input
              id="city"
              name={`${overlayType}City`}
              className="form-control"
              value={overlayType === TYPE_BILLING ? billingCity : shippingCity}
              onChange={onInputChange}
            />
            <label htmlFor="state-province">State/Province</label>
            <select
              id="state-province"
              name={`${overlayType}StateProvince`}
              className="form-control"
              value={
                overlayType === TYPE_BILLING
                  ? billingStateProvince
                  : shippingStateProvince
              }
              onChange={onInputChange}
            >
              {(() => {
                const selectedCountry = countryList.find(
                  ({ full_name_english }) =>
                    full_name_english === selectedCountryName
                );
                const regions = selectedCountry.available_regions || [];
                return regions.map(({ id, name }) => (
                  <option id={id} key={id}>
                    {name}
                  </option>
                ));
              })()}
            </select>
            <label htmlFor="zip-postal">Zip/Postal Code</label>
            <input
              id="zip-postal"
              name={`${overlayType}Zip`}
              className="form-control"
              value={overlayType === TYPE_BILLING ? billingZip : shippingZip}
              onChange={onInputChange}
            />
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name={`${overlayType}Country`}
              className="form-control"
              value={selectedCountryName}
              value={
                overlayType === TYPE_BILLING ? billingCountry : shippingCountry
              }
              onChange={onInputChange}
            >
              {countryList.map(({ id, full_name_english }) => (
                <option key={id} id={full_name_english}>
                  {full_name_english}
                </option>
              ))}
            </select>
          </div>
        )}
      />
    )}
    <div className="Info-item">
      <h2>Billing Address:</h2>
      <div className="Info-item-body">
        <div className="Info-item-body-left">
          {billingAddress ? (
            <Fragment>
              <p>{billingAddress.street[0]}</p>
              {billingAddress.street[1] && <p>{billingAddress.street[1]}</p>}
              <p>
                {billingAddress.city}, {billingAddress.region_code}{' '}
                {billingAddress.postcode}
              </p>
            </Fragment>
          ) : (
            <p>Please set a shipping address.</p>
          )}
        </div>
        <div className="Info-item-body-right">
          <button
            name="billing"
            className="Info-item-update btn btn-lg btn-primary"
            onClick={onClickUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
    <div className="Info-item">
      <h2>Shipping Address:</h2>
      <div className="Info-item-body">
        <div className="Info-item-body-left">
          {shippingAddress ? (
            <Fragment>
              <p>{shippingAddress.street[0]}</p>
              {shippingAddress.street[1] && <p>{shippingAddress.street[1]}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.region.region_code}{' '}
                {shippingAddress.postcode}
              </p>
            </Fragment>
          ) : (
            <p>Please set a shipping address.</p>
          )}
        </div>
        <div className="Info-item-body-right">
          <button
            name="shipping"
            className="Info-item-update btn btn-lg btn-primary"
            onClick={onClickUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Info;

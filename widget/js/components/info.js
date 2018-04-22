import React from 'react';
import Overlay from './overlay';
import '../../css/info.css';

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
        onClickClose={onClickCloseOverlay}
        isLoading={isLoading}
        render={({ onCLickClose }) => (
          <div className="Info-form form-group">
            <h2>Contact Information</h2>
            <label htmlFor="first-name">First Name</label>
            <input
              id="first-name"
              name={`${overlayType}FirstName`}
              className="form-control"
              onChange={onInputChange}
            />
            <label htmlFor="last-name">Last Name</label>
            <input
              id="last-name"
              name={`${overlayType}LastName`}
              className="form-control"
              onChange={onInputChange}
            />
            <label htmlFor="phone-number">Phone Number</label>
            <input
              id="phone-number"
              name={`${overlayType}PhoneNumber`}
              className="form-control"
              onChange={onInputChange}
            />
            <h2>Address</h2>
            <label htmlFor="street-address">Street Address</label>
            <input
              id="street-address"
              name={`${overlayType}StreetAddressOne`}
              className="form-control"
              onChange={onInputChange}
            />
            <input
              id="street-address"
              name={`${overlayType}StreetAddressTwo`}
              className="form-control"
              onChange={onInputChange}
            />
            <label htmlFor="city">City</label>
            <input
              id="city"
              name={`${overlayType}City`}
              className="form-control"
              onChange={onInputChange}
            />
            <label htmlFor="state-province">State/Province</label>
            <select
              id="state-province"
              name={`${overlayType}StateProvince`}
              className="form-control"
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
              onChange={onInputChange}
            />
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name={`${overlayType}Country`}
              className="form-control"
              value={selectedCountryName}
              onChange={onInputChange}
            >
              {countryList.map(({ id, full_name_english }) => (
                <option key={id} id={full_name_english}>
                  {full_name_english}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={onClickSubmit}>
              Submit
            </button>
          </div>
        )}
      />
    )}
    <div className="Info-item">
      <h2>Billing Address:</h2>
      <div className="Info-item-body">
        <div className="Info-item-body-left">
          <p>{billingAddress.street[0]}</p>
          {billingAddress.street[1] && <p>{billingAddress.street[1]}</p>}
          <p>
            {billingAddress.city}, {billingAddress.region_code}{' '}
            {billingAddress.postcode}
          </p>
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
          <p>{shippingAddress.street[0]}</p>
          {shippingAddress.street[1] && <p>{shippingAddress.street[1]}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.region.region_code}{' '}
            {shippingAddress.postcode}
          </p>
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

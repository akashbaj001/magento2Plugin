import $ from 'jquery';
import config from '../config';

const { apiBasePath } = config;

export const getCart = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const estimateShippingMethods = (address, token) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        'carts/mine/estimate-shipping-methods-by-address-id'
      )}`,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        addressId: address
      }),
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const getShippingMethods = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/shipping-methods')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const addToCart = ({ sku, qty, quoteID }, token) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/items')}`,
      data: JSON.stringify({
        cartItem: {
          quote_id: quoteID,
          sku,
          qty
        }
      }),
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const removeFromCart = (itemID, token) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`carts/mine/items/${itemID}`)}`,
      method: 'DELETE',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const getBillingAddress = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('customers/me/billingAddress')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const getPaymentMethods = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/payment-methods')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const setShippingAddress = (
  address,
  shippingCarrierCode,
  shippingMethodCode,
  token
) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        'carts/mine/shipping-information'
      )}`,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        addressInformation: {
          shippingAddress: { ...address },
          shippingCarrierCode,
          shippingMethodCode
        }
      }),
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const getShippingAddress = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        'customers/me/shippingAddress'
      )}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const setPaymentInformation = (cartId, billingAddress, token) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        'carts/mine/set-payment-information'
      )}`,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        cartId,
        paymentMethod: { method: 'authorizenet_directpost' },
        billingAddress: { ...billingAddress }
      }),
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const placePayment = data =>
  Promise.resolve(
    $.ajax({
      url: 'https://secure.authorize.net/gateway/transact.dll',
      method: 'POST',
      processData: false,
      contentType: false,
      data: Object.keys(data).reduce((formData, key) => {
        formData.append(key, data[key]);
        return formData;
      }, new FormData())
    })
  );

export const placeOrder = (data, token) =>
  Promise.resolve(
    $.ajax({
      url: `${
        window.buildfireConfig.domain
      }/authorizenet/directpost_payment/place/`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: $.param(data)
    })
  );

export const getCustomer = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('customers/me')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const updateCustomer = customer =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`customers/${customer.id}`)}`,
      data: JSON.stringify({ customer: { ...customer } }),
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      }
    })
  );

export const getCountryList = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('directory/countries')}`,
      method: 'GET',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      }
    })
  );

export const getTotals = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/totals')}`,
      method: 'GET',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  );

export const addCoupon = (code, token) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`carts/mine/coupons/${code}`)}`,
      method: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

export const getCoupons = token =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`carts/mine/coupons`)}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: `Bearer ${token}` }
    })
  );

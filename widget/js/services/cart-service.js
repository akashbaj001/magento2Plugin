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
      url: `${apiBasePath}${encodeURIComponent('carts/mine/billing-address')}`,
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

export const placeOrder = ({ paymentMethod, shippingMethod }, token) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/order')}`,
      data: JSON.stringify({ paymentMethod, shippingMethod }),
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      headers: { Authorization: `Bearer ${token}` }
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

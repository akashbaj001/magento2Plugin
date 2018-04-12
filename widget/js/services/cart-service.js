import $ from 'jquery';
import config from '../config';

const { apiBasePath } = config;

export const getCart = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer b3cneb2bjlut4fnat1v6nce5wwkc95fm' }
    })
  );

export const getShippingMethods = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/shipping-methods')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer b3cneb2bjlut4fnat1v6nce5wwkc95fm' }
    })
  );

export const addToCart = ({ sku, qty }) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/items')}`,
      data: {
        cartItem: {
          quote_id: 203254, // TODO
          sku: sku,
          qty: qty
        }
      },
      method: 'POST',
      dataType: 'json',
      headers: { Authorization: 'Bearer p9cl0098h2l941w6483pujmeons1pntw' }
    })
  );

export const removeFromCart = itemID =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`carts/mine/items/${itemID}`)}`,
      method: 'DELETE',
      dataType: 'json',
      headers: { Authorization: 'Bearer p9cl0098h2l941w6483pujmeons1pntw' }
    })
  );

export const getBillingAddress = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/billing-address')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer dc8kxgk9lhck2wg9i0ldwneqofyt4guo' }
    })
  );

export const getPaymentMethods = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/payment-methods')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer dc8kxgk9lhck2wg9i0ldwneqofyt4guo' }
    })
  );

export const getShippingAddress = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        'customers/me/shippingAddress'
      )}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer p9cl0098h2l941w6483pujmeons1pntw' }
    })
  );

export const placeOrder = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/order')}`,
      method: 'PUT',
      dataType: 'json',
      headers: { Authorization: 'Bearer p9cl0098h2l941w6483pujmeons1pntw' }
    })
  );

export const getCustomer = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('customers/me')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer 6xjaj87m3mhm6r78tqptt3dkjbdfrdhh' }
    })
  );

export const updateCustomer = customer =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`customers/${customer.id}`)}`,
      data: {
        customer
      },
      method: 'PUT',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      }
    })
  );

export const getCountryList = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`directory/countries`)}`,
      method: 'GET',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      }
    })
  );

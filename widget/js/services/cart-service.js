import $ from 'jquery';
import config from '../config';

const { apiBasePath } = config;

export const getCart = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const getShippingMethods = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/shipping-methods')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const addToCart = ({ sku, qty, quoteID }) =>
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
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const removeFromCart = itemID =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`carts/mine/items/${itemID}`)}`,
      method: 'DELETE',
      dataType: 'json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const getBillingAddress = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/billing-address')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const getPaymentMethods = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/payment-methods')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
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
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const placeOrder = ({ paymentMethod, shippingMethod }) =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('carts/mine/order')}`,
      data: JSON.stringify({ paymentMethod, shippingMethod }),
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const getCustomer = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('customers/me')}`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Bearer 27i7m3u3u9o106dvitx8enxf37ve168f' }
    })
  );

export const updateCustomer = customer =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`customers/${customer.id}`)}`,
      data: JSON.stringify({
        customer
      }),
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
      url: `${apiBasePath}${encodeURIComponent(`directory/countries`)}`,
      method: 'GET',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      }
    })
  );

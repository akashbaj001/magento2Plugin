import $ from 'jquery';
import config from '../config';

const { apiBasePath } = config;

export const getProduct = sku =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`products/${sku}`)}`,
      method: 'GET',
      dataType: 'json'
    })
  );

export const getAttributeById = attributeID =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        `products/attributes?searchCriteria[filter_groups][0][filters][0][field]=attribute_id&searchCriteria[filter_groups][0][filters][0][value]=${attributeID}`
      )}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      },
      dataType: 'json'
    })
  );

export const getProductsForCategory = categoryID =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        `products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${categoryID}`
      )}`,
      method: 'GET',
      dataType: 'json'
    })
  );

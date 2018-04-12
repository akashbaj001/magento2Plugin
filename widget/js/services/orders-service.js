import $ from 'jquery';
import config from '../config';

const { apiBasePath } = config;

export const getOrdersForCustomer = customerId =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(
        `orders?searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][value]=${customerId}`
      )}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window.buildfireConfig.integrationToken}`
      },
      dataType: 'json'
    })
  );

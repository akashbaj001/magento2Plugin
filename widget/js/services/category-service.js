import $ from 'jquery';
import config from '../config';

const { apiBasePath } = config;

export const getCategories = () =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent('categories')}`,
      method: 'GET',
      dataType: 'json'
    })
  );

export const getCategoryDetails = categoryID =>
  Promise.resolve(
    $.ajax({
      url: `${apiBasePath}${encodeURIComponent(`categories/${categoryID}`)}`,
      method: 'GET',
      dataType: 'json'
    })
  );

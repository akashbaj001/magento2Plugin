import config from '../config';

const { rootPath } = config;

export const root = rootPath;
export const home = `${rootPath}home`;
export const categories = `${rootPath}category`;
export const category = `${categories}/:id`;
export const subcategories = `${rootPath}subcategories`;
export const subcategory = `${subcategories}/:id`;
export const cart = `${rootPath}cart`;
export const account = `${rootPath}account`;
export const history = `${account}/history`;
export const products = `${rootPath}product`;
export const product = `${products}/:sku`;
export const reminders = `${account}/reminders`;
export const info = `${account}/info`;

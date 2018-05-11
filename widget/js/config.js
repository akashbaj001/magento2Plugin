const proxy =
  'https://jklyjr9rfh.execute-api.us-east-1.amazonaws.com/production/hop?url=';
const apiVersion = 'V1';
export default {
  apiBasePath: `${proxy}${encodeURIComponent(
    `${window.buildfireConfig.domain}/rest/${apiVersion}/`
  )}`,
  rootPath: '/',
  mediaPath: 'pub/media/catalog',
  baseMedia: 'media',
  proxyBasePath: proxy
};

const proxy =
  'https://ktuw266wb7.execute-api.us-east-1.amazonaws.com/dev/hop?url=';
const apiVersion = 'V1';
export default {
  apiBasePath: `${proxy}${encodeURIComponent(
    `${window.buildfireConfig.domain}/rest/${apiVersion}/`
  )}`,
  rootPath: '/',
  mediaPath: 'pub/media/catalog',
  baseMedia: 'media'
};

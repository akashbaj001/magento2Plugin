import config from '../config';

const { mediaPath, baseMedia } = config;

export const getProductMediaUrl = name =>
  `${window.buildfireConfig.domain}/${mediaPath}/product${name}`;
export const getCategoryMediaUrl = name =>
  `${window.buildfireConfig.domain}/${mediaPath}/category/${name}`;

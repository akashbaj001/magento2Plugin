import React from 'react';
import CategoryList from './component-list';
import { subcategories } from '../constants/routes';
import { getCategoryMediaUrl } from '../utilities/media-utils';
import { Link } from 'react-router-dom';
import '../../css/home.css';

const Home = ({ categories, adBannerImageUrl, categoryImageAtName }) => (
  <div className="Home">
    {adBannerImageUrl && (
      <img className="Home-adBanner" src={adBannerImageUrl} />
    )}
    <CategoryList
      items={categories.map(({ id, ...rest }) => ({
        ...rest,
        categoryImageAtName,
        uniqueKey: id,
        id
      }))}
      renderedElement={HomeCategoryCard}
    />
  </div>
);

const HomeCategoryCard = ({
  id,
  name,
  categoryImageAtName,
  categoryDetails: { custom_attributes }
}) => (
  <div className="Home-card">
    <Link to={`${subcategories}/${id}`}>
      {categoryImageAtName &&
      custom_attributes.find(
        ({ attribute_code }) => attribute_code === categoryImageAtName
      ).value ? (
        <img
          className="Home-card-image"
          src={getCategoryMediaUrl(
            custom_attributes.find(
              ({ attribute_code }) => attribute_code === categoryImageAtName
            ).value
          )}
        />
      ) : (
        <p />
      )}
      {/* TODO show name instead */}
    </Link>
  </div>
);

export default Home;

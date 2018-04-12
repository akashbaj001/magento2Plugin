import React from 'react';
import CategoryList from './component-list';
import { getCategoryMediaUrl } from '../utilities/media-utils';
import { Link } from 'react-router-dom';
import '../../css/subcategory.css';

const CategoryCard = ({
  id,
  name,
  categoryThumbnailAtName,
  custom_attributes
}) => (
  <div className="Category">
    <Link to={`/category/${id}`} className="text-primary">
      <img
        className="Category-image"
        src={getCategoryMediaUrl(
          custom_attributes.find(
            ({ attribute_code }) => attribute_code === categoryThumbnailAtName
          ).value
        )}
      />
      <p className="Category-name">{name}</p>
    </Link>
  </div>
);

const Subcategory = ({
  category,
  categoryThumbnailAtName,
  categoryImageAtName
}) => (
  <div className="CategoryList">
    <img
      className="CategoryList-banner"
      src={getCategoryMediaUrl(
        category.custom_attributes.find(
          ({ attribute_code }) => attribute_code === categoryImageAtName
        ).value
      )}
    />
    <div className="CategoryList-grid">
      <CategoryList
        items={category.childCategoryData.map(({ id, ...rest }) => ({
          ...rest,
          categoryImageAtName,
          categoryThumbnailAtName,
          uniqueKey: id,
          id
        }))}
        renderedElement={CategoryCard}
      />
    </div>
  </div>
);

export default Subcategory;

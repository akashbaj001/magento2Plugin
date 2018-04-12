import React from 'react';
import { getProductMediaUrl } from '../utilities/media-utils';
import Carousel from 'react-slick';
import QuantitySelect from './quantity-select';
import '../../css/product.css';
import '../../css/slick.css';
import '../../css/slick-theme.css';

const Product = ({
  product,
  quantity,
  customAttributeDetails,
  onChangeQuantity,
  onQuantityDecrement,
  onQuantityIncrement,
  onClickAddToCart
}) => (
  <div className="Product-wrapper">
    <div className="Product">
      {product.media_gallery_entries && (
        <Carousel
          className="Product-carousel"
          arrows={false}
          dots
          swipe
          swipeToSlide
        >
          {product.media_gallery_entries
            .filter(({ enabled }) => !enabled)
            .sort(
              (imageA, imageB) => (imageA.position < imageB.position ? -1 : 1)
            )
            .map(({ file }) => (
              <img
                key={file}
                style={{ height: 'auto' }}
                className="Product-image"
                src={getProductMediaUrl(file)}
              />
            ))}
        </Carousel>
      )}
      <div className="Product-details">
        <h1 className="Product-title">{product.name}</h1>
        <p className="Product-price">${product.price}</p>
        {customAttributeDetails.map(
          ({ name, value }) =>
            product.custom_attributes.find(
              attribute => attribute.attribute_code === value
            ) && (
              <div className="Product-section">
                {name && <h2>{name}</h2>}
                <p
                  className="Product-section"
                  dangerouslySetInnerHTML={{
                    __html: product.custom_attributes.find(
                      attribute => attribute.attribute_code === value
                    ).value
                  }}
                />
              </div>
            )
        )}
      </div>
      <div className="Product-sticky">
        <QuantitySelect
          quantity={quantity}
          onChangeQuantity={onChangeQuantity}
          onQuantityDecrement={onQuantityDecrement}
          onQuantityIncrement={onQuantityIncrement}
        />
        <button
          className="Product-atc btn btn-primary"
          name={product.sku}
          onClick={onClickAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

export default Product;

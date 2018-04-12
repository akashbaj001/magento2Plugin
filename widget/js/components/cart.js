import React from 'react';
import CartList from './component-list';
import QuantitySelect from './quantity-select';
import Overlay from './overlay';
import { products } from '../constants/routes';
import { getProductMediaUrl } from '../utilities/media-utils';
import { Link } from 'react-router-dom';
import '../../css/cart.css';

const CartCard = ({
  sku,
  name,
  price,
  qty,
  custom_attributes,
  onChangeQuantity,
  onQuantityDecrement,
  onQuantityIncrement,
  eventName,
  onClickRemove,
  productDetails
}) => (
  <div className="Cart-card">
    <img
      className="Cart-card-image"
      src={getProductMediaUrl(
        productDetails.custom_attributes.find(
          attribute =>
            attribute.attribute_code ===
            window.buildfireConfig.productImageAtName
        ).value
      )}
    />
    <div className="Cart-card-left">
      <p className="Cart-card-name">
        <Link to={`${products}/${sku}`} className="text-primary">
          {name}
        </Link>
      </p>
      <p className="Cart-card-price">${price}</p>
    </div>
    <div className="Cart-card-right">
      <QuantitySelect
        quantity={qty}
        onChangeQuantity={onChangeQuantity}
        onQuantityDecrement={onQuantityDecrement}
        onQuantityIncrement={onQuantityIncrement}
        eventName={eventName}
      />
      <span
        className="Cart-card-remove"
        onClick={() => onClickRemove(eventName)}
      >
        x
      </span>
    </div>
  </div>
);

const Cart = ({
  isLoading,
  items,
  shippingMethods,
  selectedShippingMethod,
  quantity,
  shouldShowShippingMenu,
  onClickChangeShipping,
  onClickCloseShipping,
  onClickShippingMethod,
  onChangeQuantity,
  onQuantityDecrement,
  onQuantityIncrement,
  onClickCheckout,
  onClickRemove,
  subTotal,
  shipping,
  discount,
  taxes,
  total
}) => {
  if (items && items.length > 0) {
    return (
      <div className="Cart">
        {shouldShowShippingMenu && (
          <Overlay
            onClickClose={onClickCloseShipping}
            isLoading={isLoading}
            render={({ onClickClose }) => (
              <div className="Overlay-content">
                {shippingMethods &&
                  shippingMethods.map(
                    ({ method_title, amount, method_code }) => (
                      <div
                        key={method_code}
                        className={
                          method_code === selectedShippingMethod.method_code
                            ? 'text-primary'
                            : ''
                        }
                        onClick={() => onClickShippingMethod(method_code)}
                      >
                        <p>{method_title}</p>
                        <p>${amount}</p>
                      </div>
                    )
                  )}
              </div>
            )}
          />
        )}
        <CartList
          items={items.map(({ sku, ...rest }) => ({
            ...rest,
            sku,
            uniqueKey: sku
          }))}
          renderedElement={CartCard}
          quantity={quantity}
          onChangeQuantity={onChangeQuantity}
          onQuantityDecrement={onQuantityDecrement}
          onQuantityIncrement={onQuantityIncrement}
          onClickRemove={onClickRemove}
        />
        <div className="Cart-bottom">
          <div className="Cart-bottom-left">
            <button className="btn btn-secondary">Apply Coupon Code</button>
            <p className="Cart-amount">Subtotal ${subTotal}</p>
            <p className="Cart-amount">
              Shipping{' '}
              <sup
                className="Cart-editShipping text-primary"
                onClick={onClickChangeShipping}
              >
                [edit]
              </sup>{' '}
              ${shipping}
            </p>
            <p>{selectedShippingMethod.method_title}</p>
            <p className="Cart-amount">Discount ${discount}</p>
            <p className="Cart-amount">Taxes ${taxes}</p>
            <p className="Cart-total">Total ${total}</p>
          </div>
          <div className="Cart-bottom-right">
            <button
              className="Cart-checkout btn btn-primary"
              onClick={onClickCheckout}
            >
              Check Out
            </button>
            {/* TODO you can get a message: Shipping address not set. if shipping address isn't set and you try to GET shipping-methods */}
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Your cart is empty.</p>;
  }
};

export default Cart;

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
    {window.buildfireConfig.productImageAtName &&
      productDetails.custom_attributes.find(
        attribute =>
          attribute.attribute_code === window.buildfireConfig.productImageAtName
      ).value && (
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
      )}
    <div className="Cart-card-left">
      <p className="Cart-card-name clamp-one">
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
  onInputChange,
  onClickApplyCoupon,
  shouldShowCouponOverlay,
  onClickCloseCouponOverlay,
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
  total,
  couponCode
}) => {
  if (items && items.length > 0) {
    return (
      <div className="Cart">
        {shouldShowCouponOverlay && (
          <Overlay
            onClickClose={onClickCloseCouponOverlay}
            isLoading={isLoading}
            render={({ onClickClose }) => (
              <div className="Overlay-content">
                <label className="Cart-coupon-label" htmlFor="coupon-code">
                  Enter your code:
                </label>
                <input
                  id="coupon-code"
                  name="couponCode"
                  className="List-noItems Cart-coupon form-control"
                  onChange={onInputChange}
                  value={couponCode}
                />
              </div>
            )}
          />
        )}
        {shouldShowShippingMenu && (
          <Overlay
            onClickClose={onClickCloseShipping}
            isLoading={isLoading}
            render={({ onClickClose }) => (
              <div className="Overlay-content">
                {shippingMethods &&
                  shippingMethods.map(
                    ({ method_title, amount, method_code }, index) => (
                      <div key={method_code}>
                        <input
                          type="radio"
                          style={{ marginRight: '10px' }}
                          key={`radio${method_title}`}
                          onChange={() => onClickShippingMethod(method_code)}
                          id={method_code}
                          value={method_code}
                          checked={
                            method_code === selectedShippingMethod.method_code
                          }
                        />
                        <label
                          className={
                            method_code === selectedShippingMethod.method_code
                              ? 'text-primary'
                              : ''
                          }
                          htmlFor={method_code}
                          key={`label${method_title}`}
                        >
                          {method_title} ${amount}
                        </label>
                      </div>
                    )
                  )}
              </div>
            )}
          />
        )}
        <CartList
          items={items.map(({ item_id, ...rest }) => ({
            ...rest,
            item_id,
            uniqueKey: item_id
          }))}
          renderedElement={CartCard}
          quantity={quantity}
          onChangeQuantity={onChangeQuantity}
          onQuantityDecrement={onQuantityDecrement}
          onQuantityIncrement={onQuantityIncrement}
          onClickRemove={onClickRemove}
        />
        <button
          className="Cart-coupon-button btn btn-info"
          onClick={onClickApplyCoupon}
        >
          Apply Coupon Code
        </button>
        <div className="Cart-bottom">
          <div className="Cart-bottom-left">
            <p className="Cart-amount">
              <span className="align-left">Subtotal</span>{' '}
              <span className="align-right">${subTotal}</span>
            </p>
            <p className="Cart-amount">
              <span className="align-left">Shipping</span>{' '}
              {shippingMethods && (
                <span
                  className="Cart-editShipping text-primary"
                  onClick={onClickChangeShipping}
                >
                  [edit]
                </span>
              )}
              <span className="align-right">${shipping}</span>
            </p>
            <p className="Cart-amount">
              <span className="align-left">Discount</span>{' '}
              <span className="align-right">${discount}</span>
            </p>
            <p className="Cart-amount">
              <span className="align-left">Taxes</span>{' '}
              <span className="align-right">${taxes}</span>
            </p>
            <p className="Cart-total">
              <span className="align-left">Total</span>{' '}
              <span className="align-right">${total}</span>
            </p>
            {/* TODO see /carts/mine/collect-totals */}
          </div>
          <div className="Cart-bottom-right">
            <button
              className="Cart-checkout btn-lg btn-primary"
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
    return <p className="Cart-empty">Your cart is empty.</p>;
  }
};

export default Cart;

import React from 'react';
import '../../css/quantity-select.css';

export default ({
  onQuantityDecrement,
  onQuantityIncrement,
  onChangeQuantity,
  quantity,
  eventName
}) => (
  <div className="QuantityInput">
    <span onClick={() => onQuantityDecrement(eventName)}>-</span>
    <input
      type="text"
      value={quantity}
      onChange={onChangeQuantity}
      name={eventName}
    />
    <span onClick={() => onQuantityIncrement(eventName)}>+</span>
  </div>
);

import React from 'react';

const ComponentList = ({
  items,
  renderedElement,
  showNoItemsMessage,
  ...rest
}) => {
  const RenderedElement = renderedElement;
  if (items && items.length > 0) {
    return items.map((item, index) => (
      <RenderedElement
        {...item}
        {...rest}
        eventName={item.uniqueKey}
        key={item.uniqueKey}
        arrayIndex={index}
      />
    ));
  } else if (showNoItemsMessage) {
    return <p className="List-noItems">No items found.</p>;
  } else {
    return null;
  }
};

ComponentList.defaultProps = {
  showNoItemsMessage: true
};

export default ComponentList;

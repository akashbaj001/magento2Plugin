import React from 'react';
import List from './component-list';
import Arrow from './link-arrow';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';
import { Link } from 'react-router-dom';
import { products } from '../constants/routes';
import 'react-accessible-accordion/dist/fancy-example.css';
import '../../css/history.css';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const formatDate = date =>
  `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const HistoryCard = ({
  created_at,
  increment_id,
  items,
  onClickReorder,
  expandedKeys,
  arrayIndex
}) => (
  <AccordionItem className="History-card">
    <AccordionItemTitle className="History-card-title">
      <div className="History-card-title-left">
        <p className="History-card-title-date">
          {formatDate(new Date(created_at))}
        </p>
        <p className="History-card-title-id">Order ID: {increment_id}</p>
      </div>
      <div className="History-card-title-right">
        <p className="History-card-title-price">
          ${items.reduce(
            (acc, { base_price, qty_ordered }) =>
              (acc += base_price * qty_ordered),
            0
          )}
        </p>
        <Arrow direction={expandedKeys.includes(arrayIndex) ? 'up' : 'down'} />
      </div>
    </AccordionItemTitle>
    <AccordionItemBody className="History-card-body">
      <List
        items={items.map(({ sku, ...rest }) => ({
          uniqueKey: sku,
          sku,
          ...rest
        }))}
        renderedElement={({ sku, name, base_price, qty_ordered }) => (
          <div>
            <Link
              to={`${products}/${sku}`}
              className="History-card-link text-primary"
            >
              {name}
            </Link>
            <div className="History-card-right">
              <p className="History-card-qty">{qty_ordered}</p>
              <p className="History-card-price">${base_price}</p>
            </div>
          </div>
        )}
      />
      <button
        className="History-card-body-reorder btn btn-lg btn-primary"
        name={increment_id}
        onClick={onClickReorder}
      >
        Reorder
      </button>
    </AccordionItemBody>
  </AccordionItem>
);

const History = ({
  orders,
  onClickReorder,
  onAccordionChange,
  expandedKeys
}) => {
  if (orders.items && orders.items.length > 0) {
    return (
      <div className="History">
        <h1 className="History-title">Order History</h1>
        <Accordion
          onChange={onAccordionChange}
          className="History-accordion accordion"
          accordion={false}
        >
          <List
            items={orders.items
              .map(({ increment_id, ...rest }) => ({
                uniqueKey: increment_id,
                increment_id,
                ...rest
              }))
              .sort((a, b) => b.increment_id - a.increment_id)}
            onClickReorder={onClickReorder}
            expandedKeys={expandedKeys}
            renderedElement={HistoryCard}
          />
        </Accordion>
      </div>
    );
  } else {
    return <p className="List-noItems">No products found.</p>;
  }
};

export default History;

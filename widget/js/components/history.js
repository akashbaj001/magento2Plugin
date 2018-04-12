import React from 'react';
import List from './component-list';
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

const HistoryCard = ({ created_at, quote_id, items, onClickReorder }) => (
  <AccordionItem className="History-card">
    <AccordionItemTitle className="History-card-title">
      <div className="History-card-title-left">
        <p className="History-card-title-date">
          {formatDate(new Date(created_at))}
        </p>
        <p className="History-card-title-id">Order ID: {quote_id}</p>
      </div>
      <div className="History-card-title-right">
        <p className="History-card-title-price">
          ${items.reduce(
            (acc, { base_price, qty_ordered }) =>
              (acc += base_price * qty_ordered),
            0
          )}
        </p>
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
        className="History-card-body-reorder btn btn-primary"
        name={quote_id}
        onClick={onClickReorder}
      >
        Reorder
      </button>
    </AccordionItemBody>
  </AccordionItem>
);

const History = ({ orders, onClickReorder }) => {
  if (orders.items && orders.items.length > 0) {
    return (
      <div className="History">
        <h1 className="History-title">Order History</h1>
        <Accordion className="History-accordion accordion" accordion={false}>
          <List
            items={orders.items
              .map(({ quote_id, ...rest }) => ({
                uniqueKey: quote_id,
                quote_id,
                ...rest
              }))
              .sort((a, b) => b.quote_id - a.quote_id)}
            onClickReorder={onClickReorder}
            renderedElement={HistoryCard}
          />
        </Accordion>
      </div>
    );
  } else {
    return <p>No products found.</p>;
  }
};

export default History;

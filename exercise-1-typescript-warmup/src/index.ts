/* tslint:disable:no-console */

import { loadOrders } from './adapters/order.adapter';

const orderMap = loadOrders();

// TODO: iterate through orders and log their status
console.log(`${orderMap.size} orders`);

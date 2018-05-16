import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import morgan from 'morgan';

import { appAdapter } from './app.adapter';
import { orderAdapter } from './order.adapter';

export function createApp() {
    // Create Express App
    const app = express();

    // Add middleware to enable CORS
    app.use(cors());

    // Add middleware to parse the POST data of the body
    app.use(bodyParser.urlencoded({ extended: true }));

    // Add middleware to parse application/json
    app.use(bodyParser.json());

    // Add middleware to log requests
    // app.use(morgan('combined'));

    // Add routes
    app.post('/orders', orderAdapter.createOrder);
    app.get('/orders', orderAdapter.getOrders);

    app.post('/reset', appAdapter.resetServer);

    return app;
}

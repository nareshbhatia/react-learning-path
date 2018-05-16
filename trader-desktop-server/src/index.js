// -----------------------------------------------------------------------------
// Load environment variables from the .env file before doing anything else
// -----------------------------------------------------------------------------
import { config as envConfig } from 'dotenv';
envConfig();

// --- Remaining imports -----
import { createServer } from 'http';
import WebSocket from 'ws';
import { createApp } from './adapters/app.factory';
import {
    broadcast,
    createBroadcastService
} from './adapters/broadcast-service';
import { orderStore } from './stores/order-store';

// -----------------------------------------------------------------------------
// Configure the HTTP Server using the Express App
// -----------------------------------------------------------------------------
const port = process.env.SERVER_PORT;
const app = createApp();
const server = createServer(app);

// -----------------------------------------------------------------------------
// Add WebSockets to the server
// -----------------------------------------------------------------------------
const wss = new WebSocket.Server({ server });
createBroadcastService(wss);

// -----------------------------------------------------------------------------
// Start the HTTP Server
// -----------------------------------------------------------------------------
server.listen(port, () => console.log('Listening on port ' + port));

// Start processing orders
const intervalId = processOrders();

// -----------------------------------------------------------------------------
// When SIGINT is received (i.e. Ctrl-C is pressed), shutdown services
// -----------------------------------------------------------------------------
process.on('SIGINT', () => {
    console.log('SIGINT received ...');
    console.log('Shutting down the server');

    // Stop order processing
    clearInterval(intervalId);

    server.close(() => {
        console.log('Server has been shutdown');
        console.log('Exiting process ...');
        process.exit(0);
    });
});

function processOrders() {
    const tick = parseInt(process.env.TICK, 10);
    return setInterval(function() {
        const orders = orderStore.getOrders();
        orders.forEach(order => {
            const isChanged = order.processTick();
            if (isChanged) {
                broadcast('orderChanged', order);
            }
        });
    }, tick);
}

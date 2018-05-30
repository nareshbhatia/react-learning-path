Exercise 4: Integrating with the Server
=======================================

Overview
--------
In this exercise we will integrate the header with the trader-desktop server. Specifically we will get the following functionality to work:
- New Orders button will create an appropriate number of random orders at the client and send them to the server for placement and execution.
- Reset button will clear orders stored on the server.
- On startup, client will ask the server for all existing orders. When the server returns those orders, client will load them in the OrderStore. This will automatically change the order count in the header.
- Any additions/changes to orders on the server will be pushed down the client using WebSockets. Client will listen to its socket and update the OrderStore. This will automatically update the order count in the header in case that number has changed.

Note that the [trader-desktop-server](../trader-desktop-server) has been provided to you as part of this repository. You don't need to write it. Just follow the instructions in the README file.

Technical Design
----------------
We will add a couple of methods in the OrderStore to create and reset orders at the server. These methods will not affect the store itself, so they are not MobX actions, but just convenience methods for the header to trigger server requests. Basically user interactions in the header will trigger these methods in the OrderStore, which will in turn call *adapters* that know how to communicate with the server. Server responses will be handed back by the adapters to the OrderStore. OrderStore will update the orders and this will trigger re-rendering of the header component - thanks to MobX magic! The use of adapters to communicate with the server is part of the *Ports-and-Adapters* pattern (see references in the Resources section).

The adapters will be created by the root store and will be accessible by the child stores (in our case, the OrderStore). This approach allows the root store to switch the implementation of the adapters (to a different communication protocol or even a mock adapter) without having to change the code in OrderStore. This implies that we will define an interface for each adapter and then provide one or more implementations for it.

For an example of using adapters in this way, see the implementation of the [RootStore](https://github.com/nareshbhatia/mobx-shop/blob/master/src/shared/stores/root.store.js) in MobX Shop.

Exercise
--------
### Add new package dependencies
In this exercise we will need two new libraries:

1. [uuid](https://github.com/kelektiv/node-uuid) will be used to generate unique ids for our orders.
2. [axios](https://github.com/axios/axios) will be used to communicate with the server using HTTP requests.

Install the two libraries (and their TypeScript type definitions) by executing the following command in the `shared` directory:

    yarn add uuid @types/uuid axios

### Create orders at the server
Add the functionality to create multiple orders at the server when the New Orders button is clicked.

- Create an interface called `OrderAdapter` at `shared/src/adapters/order.adapter.ts`. Create a concrete implementation called `HttpOrderAdapter`. This adapter is used to create orders at the server and fetch all existing orders from the server. The full code for this adapter is shown below. Review the code and make sure you understand it:

```typescript jsx
import axios from 'axios';
import { JsOrder } from '../domain/order';

const api = process.env.REACT_APP_API;

export interface OrderAdapter {
    createOrder(jsOrder: JsOrder): Promise<any>;
    fetchOrders(): Promise<JsOrder[]>;
}

export class HttpOrderAdapter implements OrderAdapter {
    createOrder(jsOrder: JsOrder): Promise<any> {
        return axios.post(api + '/orders', jsOrder);
    }

    fetchOrders(): Promise<JsOrder[]> {
        return axios.get(api + '/orders').then(response => {
            return response.data;
        });
    }
}
```

- Note that in the code above we are picking up the API URL from an environment variable. This gives us the ability to change the API URL without changing the code files. To set this environment variable for our app, create a file called `.env` under `myapp` with the following content:

```
REACT_APP_API=http://localhost:8080
REACT_APP_WSAPI=ws://localhost:8080
```

- Now we need to add an `OrderAdapter` to the `TestRootStore`. However we cannot add the HTTP implementation of the `OrderAdapter` because we need to be able to test the shared package in a standalone way, without connection to the server. Hence create a `MockOrderAdapter` at `shared/src/stores/test-support/mock-order.adapter.ts`. This adapter should fulfill the `OrderAdapter` interface, but does not send a request to the server. When any of its methods is called, it simply prints a message on the console and returns an empty Promise.

- Now create an instance of the `MockOrderAdapter` in `TestRootStore`:

```typescript jsx
export class TestRootStore {
    orderStore = new OrderStore(this);

    // Adapters for use by all stores
    adapters = {
        orderAdapter: new MockOrderAdapter()
    };
}
```

- Add a method in `OrderStore` that will create a specified number of random orders and send them to the server:

```typescript jsx
createOrdersAtServer = (numOrdersToCreate: number) => {
    const { orderAdapter } = this.rootStore.adapters;

    // Create specified number of random JsOrders
    // Use the generateOrder() function for this (described below)

    // Send the generated orders to the server using the orderAdapter
};
```

- Write a function called `generateOrder()` in `shared/src/stores/generate-order.ts`. A skeleton is provided below:

```typescript jsx
import { v4 } from 'uuid';
import { JsOrder } from '../domain/order';

const sides = ['BUY', 'SELL'];
const symbols = [
    'AAPL',
    'ADBE',
    'AKAM',
    'AMD',
    'AMZN',
    'BA',
    'BAC',
    'CCE',
    'CL',
    'CSCO',
    'CVX',
    'DIS',
    'DOW',
    'DWA',
    'EA',
    'EBAY',
    'EMC',
    'EMN',
    'GE',
    'GOOG',
    'GS',
    'K',
    'MSFT',
    'NU',
    'RTN',
    'TSLA',
    'TWTR',
    'URBN'
];
const numSymbols = symbols.length;

export const generateOrder = (): JsOrder => {
    return {
        id: v4(),
        side: /* pick a random side from sides above */,
        symbol: /* pick a random symbol from symbols above */,
        quantity: /* pick a random quantity from 1 to 1000000 */1,
        committed: 0,
        executed: 0
    };
};
```

- Wire the New Trades button to `orderStore.createOrders()`.

- Bring up Storybook and make sure the header functionality is not broken. Specifically, you should be able to click on the New Trades button without crashing the app. Since this setup uses the `MockOrderAdapter`, it should simply print a message on the console.

- We are now done with all the infrastructure needed to create orders at the server. Wire the real `HttpOrderAdapter` to the `RootStore` in `myapp`. Test whether you can create orders at the server. Use the instructions in the trader-desktop-server to check if the orders are created. 

### Reset the server (to delete all the orders)
Add the functionality to reset the server when the Reset button is clicked.

- Create an interface called `OrderAdapter` at `shared/src/adapters/order.adapter.ts`. Create a concrete implementation called `HttpOrderAdapter`. This adapter is used to create orders at the server and fetch all existing orders from the server. The full code for this adapter is shown below. Review the code and make sure you understand it:

- Create an interface called `ServerAdapter` at `shared/src/adapters/server.adapter.ts`. Create a concrete implementation called `HttpServerAdapter`. This adapter is used to reset the server, clearing all of its data (in our case, all the orders). The full code for this adapter is shown below. Review the code and make sure you understand it:

```typescript jsx
import axios from 'axios';

const api = process.env.REACT_APP_API;

export interface ServerAdapter {
    reset(): Promise<any>;
}

export class HttpServerAdapter {
    reset(): Promise<any> {
        return axios.post(api + '/reset');
    }
}

- Create a `MockServerAdapter` at `shared/src/stores/test-support/mock-server.adapter.ts`. When its `reset` method is called, it simply prints a message on the console and returns an empty Promise.

- Now create an instance of the `MockServerAdapter` in `TestRootStore`:

- Add a method in `OrderStore` that will reset the server:

```typescript jsx
resetServer = () => {
    const { serverAdapter } = this.rootStore.adapters;
    return serverAdapter.reset();
};
```

- Wire the Reset button to `orderStore.resetServer()`.

- Bring up Storybook and test the Reset button.

- We are now done with all the infrastructure needed to reset the server. Wire the real `HttpServerAdapter` to the `RootStore` in `myapp`. Test whether you can reset the server. 

### Load orders from the server on startup
- Add a method to the `OrderStore` to load orders from the server:

```typescript jsx
loadOrders() {
    const { orderAdapter } = this.rootStore.adapters;
    orderAdapter.fetchOrders().then(this.initialize);
}
```

- Call the above method when the app starts up. Here's the modified code in `myapp/src/app.tsx`:

```typescript jsx
const rootStore = new RootStore();
rootStore.init();
rootStore.orderStore.loadOrders();
```

### Listen to messages from the server
The server pushes messages to the client whenever orders are added or modified. This allows the blotter to be updated automatically whenever another user changes the state of the server. The server uses WebSockets to push messages to the client. Let's add the capability to listen to these messages.

- Add a `SocketListener` at `shared/src/adapters/socket.listener.ts`. The code for it is shown below. Note that the `SocketListener` requires a reference to the `OrderStore` so that it can call the actions in it.

```typescript jsx
import { OrderStore } from '../stores/order.store';

const api = process.env.REACT_APP_WSAPI;
const socket = new WebSocket(api!);

let orderStore: OrderStore;

socket.onmessage = (event: any) => {
    if (!orderStore) {
        return;
    }

    const { type, payload } = JSON.parse(event.data);
    switch (type) {
        case 'orderCreated':
            orderStore.createOrder(payload);
            break;

        case 'orderChanged':
            orderStore.updateOrder(payload);
            break;

        case 'allOrdersDeleted':
            orderStore.deleteAllOrders();
            break;

        default:
            break;
    }
};

export const SocketListener = {
    setOrderStore: (store: OrderStore) => {
        orderStore = store;
    }
};
```

- Modify `app.jsx` to provide `OrderStore` to `SocketListener`:

```typescript jsx
const rootStore = new RootStore();
rootStore.init();
rootStore.orderStore.loadOrders();
SocketListener.setOrderStore(rootStore.orderStore);
```

- Now fire up multiple instances of myapp. Create orders from any instance. All instances should show an updated count in their headers!

Resources
---------
- Ports-and-Adapters pattern: See [Hexagonal Architecture](http://alistair.cockburn.us/Hexagonal+architecture) by Alistair Cockburn and [Onion Architecture](http://jeffreypalermo.com/blog/the-onion-architecture-part-1/) by Jeffrey Palermo.

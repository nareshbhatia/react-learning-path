Exercise 3: Integrating Header with a MobX Store
================================================

Overview
--------
In this exercise we will create a MobX store that will hold the state of the header we built in exercise 2. We will then wire up this store to the header. At a very high level, the rendering of the header will be controlled by the state stored in the MobX store. This follows the best practice of *UI as a function of state*. In addition, user actions (and server responses) will fire MobX actions in the store. These MobX actions are the only mechanism by which the store should be changed. This is also a best practice known as *One-way Data Flow*. When actions change the state in the store, MobX automatically fires render methods of the affected components.

We will build the MobX store in our `shared` package. This store will be a reusable component - similar to the shared UI components and domain types that we have already built in the `shared` package. Since this store deals with the domain of *Orders*, we will call it the `OrderStore`. We will write unit tests to make sure the header interacts correctly with the store as well as the server. Of course, in order to test the header as a standalone component, we will not integrate it with a real server. We will just test if it will send the right messages to the server and react correctly to the responses.

Technical Design
----------------
The server will send and receive orders from the client in JSON format. Here's an example of an Order on the wire:

```typescript jsx
{
    id: 'o100',
    side: 'BUY',
    symbol: 'AAPL',
    quantity: 10000,
    committed: 0,
    executed: 0    
}
```

As you can see, this is a "dumb" JavaScript object with no intelligence. In technical terms, it has no behavior, just the data. We will call these objects `JsOrder`s.

In order to do smart things with orders, the client needs to convert `JsOrder`s into MobX objects with observable properties. These objects will also have methods to give them behavior. We will officially call these objects `Order`s. To reiterate, when a `JsOrder` is received from the server, the client will convert it to an `Order` for internal operations. When the client must send an `Order` to the server, it will convert it to a `JsOrder`.

The next thing we need to figure out is: what state do we need to maintain to render the header correctly? At a minimum, we need:
1. The value of the visibility filter - so that the correct radio button can be selected.
2. Number of orders to create - so that the number can be rendered in the input field.
3. Total number of orders in the system - so that the number of orders indicator can be rendered correctly. For this requirement we will go a step further. Since eventually we will have to render the orders themselves, we will maintain a map of `Order` objects in the store - the number of orders can be derived from it. I prefer to keep a map, instead of an array, because it is faster to look up an order in a map than in an array. This is going to be important when the server pushes a notification to the client saying that order #xyz has changed.

In addition, we may want to keep a flag called `loading` which is true whenever the client is bulk loading all the orders from the server (for example at start up). This can be used to show a loading indicator. However, to keep our design simple, we will ignore this flag for now.

Based on this we need the following properties the `OrderStore`:

- `orderMap`: a MobX observable map from an `id` to an `Order`
- `filter`: VisibilityFilter
- `numOrdersToCreate`: number

In addition, we will need the following actions to change the state:
- `initialize`: When the server sends a full list of `jsOrder`s, we will use this action to initialize the store with `Order`s.
- `createOrder`: This action is to create one order in the store. 
- `updateOrder`: This action is to update one order in the store.
- `deleteAllOrders`: This action will be invoked when the server has been reset.
- `setFilter`: This action is used to change the filter when a radio button is clicked 
- `setNumOrdersToCreate`: This action is used to change the number of orders to create when the user is typing in the input box.

Exercise
--------
### Create the Order class
- We start by defining the `Order` domain object. Create a class called `Order` at `shared/src/domain/order.ts`. A skeleton of this object is given below. It is a simplified version of the `Order` class defined in exercise 1. Instead of keeping placements and executions, we simply keep the total committed and total executed quantities. Note that we decorate the object to make it a MobX observable.

```typescript jsx
import { action, computed, decorate, observable } from 'mobx';

export enum Side {
    BUY = 'BUY',
    SELL = 'SELL'
}

export interface OrderStatus {
    committed: number;
    done: number;
    notDone: number;
    uncommitted: number;
    pctDone: number;
    pctNotDone: number;
    pctUncommitted: number;
}

/**
 * An interface describing a plain JavaScript order.
 * Such an object will be used to receive/send orders to the server.
 */
export interface JsOrder {
    id: string;
    side: string;
    symbol: string;
    quantity: number;
    committed: number;
    executed: number;
}

/**
 * An order to buy or sell a security for a specific fund.
 */
export class Order {
    constructor(
        readonly id: string,
        public side: Side,
        public symbol: string,
        public quantity: number,
        public committed: number = 0,
        public executed: number = 0
    ) {}

    /**
     * Updates the order from a plain JavaScript object
     */
    update(jsOrder: JsOrder) {}

    /**
     * Converts the MobX observable to a plain JavaScript object
     */
    serialize(): JsOrder {}

    /**
     * Returns true when the order is fully placed (i.e. fully committed)
     * @returns {boolean}
     */
    get isPlaced(): boolean {}

    /**
     * Returns true when the order is fully executed (a.k.a. done)
     * @returns {boolean}
     */
    get isExecuted(): boolean {}

    get status(): OrderStatus {}
}

decorate(Order, {
    id: observable,
    side: observable,
    symbol: observable,
    quantity: observable,
    committed: observable,
    executed: observable,
    isPlaced: computed,
    isExecuted: computed,
    status: computed,
    update: action
});
```

- Write tests for the `Order` object and then fill in its details to make the tests pass. Try to get 100% coverage.

### Create the OrderStore
- We will use the [best practices](https://mobx.js.org/best/store.html#combining-multiple-stores) described in the MobX documentation to create our stores. According to this document, an effective way to structure your stores is to create a `RootStore` that instantiates all stores, and shares references. The final `RootStore` with all of its sub-stores will be created in the `myapp` package. For testing purposes, let's create a `TestRootStore` in the shared package. Create this store at `shared/src/stores/test-support/test-root.store.ts`. You can use [this example](https://github.com/nareshbhatia/mobx-shop/blob/master/src/shared/stores/root.store.js) to structure the `TestRootStore`. Ignore the adapters for now.
- Create a class called `OrderStore` at `shared/src/stores/order.store.ts`. The constructor should accepts a `rootStore` parameter and save it as a property. Make the type of the `rootStore` as `any`. This is not ideal, but will do for now.
- Use the [decorate()](https://mobx.js.org/refguide/modifiers.html) syntax to add the observable properties and the actions described under Technical Design. Have empty stubs for the actions to start with. You will need the following import statement to use MobX features:

```typescript jsx
import { action, computed, decorate, observable, ObservableMap } from 'mobx';
```

- Note the signatures of `initialize`, `createOrder` and `updateOrder`. They take `JsOrder`s as inputs:

```typescript jsx
initialize = (jsOrders: JsOrder[]) => {};
createOrder = (jsOrder: JsOrder) => {};
updateOrder = (jsOrder: JsOrder) => {};
```

- Add reasonable initial values to the observable properties, e.g. `orderMap` should be an empty observable map, `filter` should be `VisibilityFilter.ALL` and `numOrdersToCreate` should be 10.
- Add a computed property to `OrderStore` called `numOrders`. It should return the number of orders in `orderMap`.
- Write unit tests to test `OrderStore`. Test that the various actions are changing the state correctly. For example, the `initialize` action should populate the store with the supplied orders. Try to get 100% coverage.

### Wire RootStore to the Header
- Inject `rootStore` into the `Header` and let its state drive the component. If you have any hardcoded values in the `Header`, these should be now replaced by the values from OrderStore. In addition, the `Header` should also be declared as a MobX `Observer`, so that it can react to state changes. This could be a rather complex step, so I am providing you the skeleton code below:

```typescript jsx
export interface HeaderProps {
    rootStore?: any;
    children?: any;
}

export const Header = inject('rootStore')(
    decorate<HeaderProps>(
        observer(
            class extends React.Component<
                HeaderProps &
                    WithStyles<
                        'toolbar' | 'title' | 'button' | 'numOrdersIndicator'
                    >
            > {
                render() {
                    ...
                }
            }
        )
    )
);
```

- Now modify `Header` test (`header.test.tsx`) to make sure that MobX injection works in the tests. To do this, you will have to wrap the `Header` in the MobX provider. See below:

```typescript jsx
test('Header renders specified title', () => {
    const rootStore = new TestRootStore();

    const wrapper = mount(
        <MuiThemeProvider theme={getTestTheme()}>
            <Provider rootStore={rootStore}>
                <Header>React Template</Header>
            </Provider>
        </MuiThemeProvider>
    );
    expect(wrapper.find('h1').text()).toEqual('React Template');
});
```

- Once the above test starts working, add more tests to make sure that `OrderStore` is indeed driving the `Header` component. Here are some suggestions:
  - Header displays the correct visibility filter
  - Header displays the correct number of orders to create
  - Header displays the correct number of orders
  
- Now do the same with Storybook (`header.story.tsx`) - make sure that `OrderStore` is indeed driving the `Header` component. For Storybook, I used a different trick to inject the `rootStore` into the `Header`. Instead of *providing* the store using the MobX `Provider`, I passed it a prop. The `Header` component really doesn't care how it gets the store!!

```typescript jsx
storiesOf('Header', module)
    .addDecorator(StoryDecorator)
    .add('with title', () => {
        const rootStore = new TestRootStore();
        const { orderStore } = rootStore;
        orderStore.initialize(jsOrders);

        return <Header rootStore={rootStore}>TRADER DESKTOP</Header>;
    });
```

- Make sure that the `VisibilitySelector` responds correctly to mouse clicks. Also make sure that the number of orders to create can be changed. For this you will have to make sure that the `Header` is correcly handling the `onVisibilityChanged` and `onNumOrdersToCreateChanged` events. We will take care of the remaining two events in the next exercise.

Tips
----
- When testing with Jest/Enzyme, use "data-testid" attribute on nodes you want to select for testing. For example:

```typescript jsx
<div className={classes.numOrdersIndicator} data-testid="numOrders">
    {orderStore.numOrders}
</div>
```

You can now select this node in Enzyme using `wrapper.find('[data-testid="numOrders"]')`.


Resources
---------
- [Ten minute introduction to MobX and React](https://mobx.js.org/getting-started.html)
- [MobX documentation](https://mobx.js.org/)
- [mobx-react](https://github.com/mobxjs/mobx-react) - React bindings for MobX
- [MobX Tutorial on egghead.io](https://egghead.io/courses/manage-complex-state-in-react-apps-with-mobx)
- [Best Practices for building large scale maintainable projects](https://mobx.js.org/best/store.html) - We are using the technique described in the last section - "Combining multiple stores".
- [Introducing mobx-state-router](https://medium.com/@NareshBhatia/introducing-mobx-state-router-dae4cb9386fb): This article explains the concept of UI as a function of state and how this principle was used to create the mobx-state-router.

Exercise 5: Order List
======================

Overview
--------
At this point, you know all the fundamentals of React, MobX and Material UI. You should be able to solve the remaining exercises with minimal instructions.

In this exercise we will create the main component of the trader desktop that displays the list of orders. For now, we will not implement the stacked chart in the last column. That will be done in the next exercise.

Exercise
--------
### Extend the theme to include additional colors and fonts
The OrderList component will need additional shades of grey and also business specific colors that represent buy and sell orders. It also needs a bold font in addition to the light, regular and medium weight fonts provided by material UI. The code for all these additions has been provided in the attached file called `get-test-theme.ts`. Copy it over to your project.

### Add ability to filter orders
Add a method called `getVisibleOrders()` to `OrderStore`. This method should return the orders based on the setting of the Visibility filter. We will use this method in `OrderList` to show only the orders that should be visible based on the filter setting.

### Create the OrderList component
Create the `OrderList` component in the folder `shared/src/components/order-list`. This component is responsible for fetching the visible orders from the `OrderStore` using the `getVisibleOrders()` method and then rendering each visible order. Obviously, you will have to make `OrderStore` available to `OrderList`. To do this you will have to inject the `RootStore` into `OrderList`, just like you did for the `Header` component.

The actual component that renders each order is called `OrderView` and should be created in a separate file under `shared/src/components/order-list`.

To summarize, `OrderList` is responsible for getting visible orders from the `OrderStore` and rendering the overall table (the `<thead>` and the `<tbody>`). `OrderView` is responsible for rendering each order (the `<tr>`).

Structure the `order-list` folder similar to the peer `header` folder. Create an `index.js` file that exports just the `OrderList` component. This is the only component visible to the outside world.

### Create a Storybook story for OrderList
Create a file called `order-list.story.tsx` and in it, create a story to test `OrderList` standalone - without any connection to the server. Again, user the `Header` story as guidance.

### Add OrderList to myapp
Add `OrderList` to the `HomePage` right below the header. Make sure it renders when the app is started and correctly displays the orders on the server.

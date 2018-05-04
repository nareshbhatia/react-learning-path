Exercise 1: TypeScript Warmup
=============================
> Note: While my preferred language for all the exercises is TypeScript, you may substitute it with ES2015, if that's what you prefer.

Overview
--------
In this exercise we will calculate the status of an Order. This is in preparation of displaying the status as a visual bar chart.

The status of an order depends on the total quantity of the order, the quantity placed and the quantity executed.

**Example:**

```
quantity = 10000
committed = 7000
done (executed) = 4000

Hence:
notDone = committed - done = 7000 - 4000 = 3000
uncommitted = quantity - committed = 10000 - 7000 = 3000

Order status in percentages:
pctDone = done / quantity = 4000 / 10000 = 0.40
pctNotDone = notDone / quantity = 3000 / 10000 = 0.30
pctUncommitted = uncommitted / quantity = 3000 / 10000 = 0.30
```

Note that `pctDone + pctNotDone + pctUncommitted` should equal 1, i.e. 100%. We will use this formula to eventually render our bar chart.

Exercise
--------
I assume you have already cloned this repository. Perform the following steps to prepare the first exercise.

```
$ cd exercise-1-typescript-warmup
$ yarn install
```

The `src` folder contains the starter code for this exercise:

- The `domain` folder contains starter code for domain objects: `Order`, `Placement` & `Execution`. 
- This folder also contains some preliminary tests for `Order` & `Placement` objects. We are using Jest as our testing tool. Run the tests by executing `yarn test` on the command line. In the true TDD spirit, the tests will fail. Your job is to write the code inside the domain objects to make them pass. In order to learn some of the newer features of ES6/TypeScript, use [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) to calculate `Order` and `Placement` status - do not use a simple `for` loop. 
- Think of other test cases to test your code exhaustively. The goal is that the `Order` object should return the correct `OrderStatus` for all combinations of `Orders`, `Placements` & `Executions`.
- Strive to get 100% code coverage in your tests, but don't write meaningless tests just to get to that number!
- Once you are confident that your domain objects are working correctly, write the main program: `src/index.ts`. The purpose of the main program is to load the orders from the data file (`data/index.ts`) and log the status of each. Note that the data is in a normalized format, similar to what you might get from a database. The `loadOrders()` method in the order adapter should convert this normalized data to connected `Order`, `Placement` & `Execution` objects.
- To run the main program, you must first compile your source code using `yarn build`. This compiles TypScript into ES5 and outputs the resulting code into the `dist` folder. Now you can run the compiled code by executing `yarn start`.   

Tips
----
- File names should always be lowercase to avoid subtle bugs due to platform differences. Use a `-` or `.` to separate words, e.g. `order-view.tsx` or `order.store.ts`.
- Run prettier often to clean up your code (`yarn format`). Prettier allows the code to look consistent across our team. Do not alter prettier options in package.json.
- Run lint often to make sure that your code has zero lint errors (`yarn lint`). Don't relax the supplied lint rules.
- The test title should indicate the intent of what you are testing, not the mechanics. Here are examples of good and bad test titles:
  - GOOD: "A partially placed order returns the correct uncommitted percentage"
  - BAD: "A 30% placed order returns 70% uncommitted status" (this does not communicate the intent of the test)

Questions
---------
- What are string literals and why are they useful?
- What are interfaces and why are they useful?
- What are accessors and why are they useful?
- What are constructor parameter properties?
- Is a readonly property modifiable by a method of the class?
- What are generics? Why are they useful?
- What is the difference between an Array and a Map? When would you use one vs. the other?

Resources
---------
- [Official TypeScript documentation](https://www.typescriptlang.org/docs)
- [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/) - An excellent resource for learning TypeScript - must read cover-to-cover!
- [Jest documentation](https://facebook.github.io/jest/)


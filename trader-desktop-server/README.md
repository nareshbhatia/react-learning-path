Trader Desktop Server
=====================

Setup
-----
```bash
$ yarn install
$ yarn build
```

Running the server
------------------
```bash
$ yarn start
OR
$ node dist/index.js
```

To verify that the application is working correctly, point your browser to [http://localhost:8080/orders](http://localhost:8080/orders) - you should see a response with a list of orders in JSON format. Since the persistence layer is in memory, the list will be empty.

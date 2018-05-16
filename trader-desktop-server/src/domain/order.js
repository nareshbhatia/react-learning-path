/**
 * An order to buy or sell a security.
 */
export class Order {
    id;
    side;
    symbol;
    quantity;
    committed;
    executed;
    nextPlacementTime;
    nextExecutionTime;

    constructor(id, side, symbol, quantity) {
        this.id = id;
        this.side = side;
        this.symbol = symbol;
        this.quantity = quantity;
        this.committed = 0;
        this.executed = 0;
        this.computeNextPlacementTime();
        this.computeNextExecutionTime();
    }

    get isPlaced() {
        return this.committed >= this.quantity;
    }

    get isExecuted() {
        return this.executed >= this.quantity;
    }

    processTick = () => {
        const now = new Date().getTime();
        let isOrderChanged = false;

        if (this.nextPlacementTime && now >= this.nextPlacementTime) {
            this.place();
            isOrderChanged = true;
        }

        if (this.nextExecutionTime && now >= this.nextExecutionTime) {
            this.execute();
            isOrderChanged = true;
        }

        return isOrderChanged;
    };

    place = () => {
        // Compute a random quantity to place (max 25%)
        let quantityToPlace = getRandomInt(1, 0.25 * this.quantity);

        // What's the maximum we can place based on what's committed
        const maxQuantityToPlace = this.quantity - this.committed;
        if (quantityToPlace > maxQuantityToPlace) {
            quantityToPlace = maxQuantityToPlace;
        }

        // Do the placement
        this.committed += quantityToPlace;

        this.computeNextPlacementTime();
    };

    execute = () => {
        // Compute a random quantity to execute (max 25%)
        let quantityToExecute = getRandomInt(1, 0.25 * this.quantity);

        // What's the maximum we can execute based on what's been committed
        let maxQuantityToExecute = this.committed - this.executed;
        if (quantityToExecute > maxQuantityToExecute) {
            quantityToExecute = maxQuantityToExecute;
        }

        // What's the maximum we can execute based on what's been executed
        maxQuantityToExecute = this.quantity - this.executed;
        if (quantityToExecute > maxQuantityToExecute) {
            quantityToExecute = maxQuantityToExecute;
        }

        // Do the execution
        this.executed += quantityToExecute;

        this.computeNextExecutionTime();
    };

    computeNextPlacementTime = () => {
        if (this.isPlaced) {
            this.nextPlacementTime = null;
        } else {
            const maxIntrvl = parseInt(process.env.MAX_PLACEMENT_INTERVAL, 10);
            const waitTime = getRandomInt(1, maxIntrvl);
            this.nextPlacementTime = new Date().getTime() + waitTime;
        }
    };

    computeNextExecutionTime = () => {
        if (this.isExecuted) {
            this.nextExecutionTime = null;
        } else {
            const maxIntrvl = parseInt(process.env.MAX_EXECUTION_INTERVAL, 10);
            const waitTime = getRandomInt(1, maxIntrvl);
            this.nextExecutionTime = new Date().getTime() + waitTime;
        }
    };
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
// Based on: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

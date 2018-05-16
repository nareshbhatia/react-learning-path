const orders = [];

class OrderStore {
    addOrder(order) {
        orders.push(order);
    }

    getOrders() {
        return orders;
    }

    /**
     * Deletes all orders.
     */
    deleteAllOrders() {
        orders.length = 0;
    }
}

export const orderStore = new OrderStore();

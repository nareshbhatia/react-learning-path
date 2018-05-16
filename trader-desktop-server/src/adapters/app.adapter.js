import { orderStore } from '../stores/order-store';
import { broadcast } from '../adapters/broadcast-service';

class AppAdapter {
    resetServer = (req, res) => {
        orderStore.deleteAllOrders();
        broadcast('allOrdersDeleted');
        res.status(204).send(); // No Content
    };
}

export const appAdapter = new AppAdapter();

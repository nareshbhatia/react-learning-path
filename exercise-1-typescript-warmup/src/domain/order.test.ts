import { Order, OrderStatus } from './order';
import { Placement } from './placement';
import { Side } from './types';

test('A partially placed order returns the correct uncommitted percentage', () => {
    const order = new Order('o100', Side.BUY, 'AAPL', 10000);
    const placement = new Placement('p110', Side.BUY, 'AAPL', 3000);
    order.place(placement);
    expect(order.status.pctUncommitted).toBeCloseTo(0.7);
});

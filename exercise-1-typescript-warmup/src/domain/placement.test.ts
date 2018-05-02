import { Execution } from './execution';
import { Placement } from './placement';
import { Side } from './types';

test('A partially executed placement returns the correct done quantity', () => {
    const placement = new Placement('p110', Side.BUY, 'AAPL', 3000);
    const execution = new Execution('e111', 300);
    placement.execute(execution);
    expect(placement.done).toBeCloseTo(300);
});

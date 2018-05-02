/**
 * An execution of a buy or sell order placed with a broker.
 */
export class Execution {
    constructor(readonly id: string, readonly quantity: number) {}
}

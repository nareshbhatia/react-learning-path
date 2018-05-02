export const jsOrders = [
    {
        id: 'o100',
        side: 'BUY',
        symbol: 'AAPL',
        quantity: 10000
    },
    {
        id: 'o200',
        side: 'SELL',
        symbol: 'MSFT',
        quantity: 10000
    }
];

export const jsPlacements = [
    {
        id: 'p110',
        side: 'BUY',
        symbol: 'AAPL',
        quantity: 3000,
        orderId: 'o100'
    },
    {
        id: 'p120',
        side: 'BUY',
        symbol: 'AAPL',
        quantity: 4000,
        orderId: 'o100'
    },
    {
        id: 'p210',
        side: 'SELL',
        symbol: 'MSFT',
        quantity: 6000,
        orderId: 'o200'
    },
    {
        id: 'p220',
        side: 'SELL',
        symbol: 'MSFT',
        quantity: 1000,
        orderId: 'o200'
    },
    {
        id: 'p230',
        side: 'SELL',
        symbol: 'MSFT',
        quantity: 1000,
        orderId: 'o200'
    }
];

export const jsExecutions = [
    {
        id: 'e111',
        quantity: 1500,
        placementId: 'p110'
    },
    {
        id: 'e112',
        quantity: 500,
        placementId: 'p110'
    },
    {
        id: 'e121',
        quantity: 800,
        placementId: 'p120'
    },
    {
        id: 'e122',
        quantity: 1200,
        placementId: 'p120'
    },
    {
        id: 'e211',
        quantity: 2000,
        placementId: 'p210'
    },
    {
        id: 'e221',
        quantity: 1000,
        placementId: 'p220'
    }
];

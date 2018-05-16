import WebSocket from 'ws';

class BroadcastService {
    wss;

    constructor(wss) {
        this.wss = wss;
    }

    broadcast = (type, payload) => {
        const data = JSON.stringify({
            type,
            payload
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };
}

let theBroadcastService = null;

export function createBroadcastService(wss) {
    theBroadcastService = new BroadcastService(wss);
}

export function broadcast(event, payload) {
    theBroadcastService.broadcast(event, payload);
}

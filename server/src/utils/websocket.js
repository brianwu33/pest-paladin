const { WebSocketServer } = require("ws");

// Store userID ➔ WebSocket connections
const userConnections = new Map();

const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("listening", () => console.log("✅ WebSocket server is listening"));

    wss.on("connection", (ws, req) => {
        const params = new URLSearchParams(req.url.split("?")[1]);
        const userID = params.get("userID");

        if (!userID) {
            ws.close(4001, "No userID provided");
            return;
        }

        userConnections.set(userID, ws);
        console.log(`✅ WebSocket connected for user: ${userID}`);

        ws.on("close", () => {
            console.log(`❌ WebSocket disconnected for user: ${userID}`);
            userConnections.delete(userID);
        });
    });
};

const sendNotificationToUser = (userID, notification) => {
    const userSocket = userConnections.get(userID);

    if (userSocket && userSocket.readyState === WebSocket.OPEN) {
        userSocket.send(JSON.stringify(notification));
    } else {
        console.warn(`🚨 WebSocket not found for user: ${userID}`);
    }
};

module.exports = { createWebSocketServer, sendNotificationToUser };

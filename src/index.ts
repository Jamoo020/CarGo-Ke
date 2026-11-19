import http from "http";
import app from "./app";
import { config } from "./config";
import { Server as SocketIOServer } from "socket.io";
import { configureTripSockets, isAllowedSocketOrigin } from "./socket";

const port = config.port;
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: config.socketAllowedOrigins,
    methods: ["GET", "POST"],
  },
  allowRequest: (request, callback) => {
    const origin = request.headers.origin;
    callback(null, isAllowedSocketOrigin(origin, config.socketAllowedOrigins));
  },
});

// Attach io to app for use in route handlers
(app as any).io = io;

configureTripSockets(io);

server.listen(port, () => {
  console.log(`CarGo Kenya backend is running on http://localhost:${port}`);
});

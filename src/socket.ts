import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "./utils/jwtUtils";
import { User } from "./modules/user/user.models";
import { config } from "./config";

let io: Server;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
      const decoded: JwtPayload = verifyToken(token);
      if (!decoded?.userId) {
        return next(new Error("Authentication error: Invalid token"));
      }
      const user = await User.findById(decoded.userId).lean();
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }
      socket.data.user = user;

      if (user?._id) {
        socket.join(user._id.toString());
        console.log(`👤 User ${user._id} joined their room`);
      }
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  console.log(`📡 Socket.IO is running on port ${config.app.port}`);
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

export function sendMessageToUser(toUserId: string, payload: any) {
  getIO().to(toUserId).emit("receive_message", payload);
}

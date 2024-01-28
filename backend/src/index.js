import http from "http";
import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import { app } from "./app.js";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

connectDB()
  .then(() => {
    server.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });

    let users = [];

    const addUser = (userId, socketId) => {
      !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
    };
    const removeUser = (socketId) => {
      users = users.filter((user) => user.socketId !== socketId);
    };
    const getUser = (userId) => {
      return users.find((user) => user.userId === userId);
    };

    io.on("connection", (socket) => {
      console.log("a user connected")

      // take userid and socketid from user
      socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
      });

      // send msg
      socket.on("sendMsg", ({ senderId, receiverId, text, conversationId }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMsg", { senderId, text, conversationId })
      });

      socket.on("disconnect", () => {
        console.log("user dissconnected");
        removeUser(socket.id)
      });
    });

    server.listen(process.env.PORT || 8000, () => {
      console.log(`server started on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongo db connection failed", error);
  });

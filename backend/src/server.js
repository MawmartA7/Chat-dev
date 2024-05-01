const { createServer } = require("http");
const express = require("express");
const app = express();
const httpServer = createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);
const dotenv = require("dotenv");

dotenv.config();

let sockets = [];

io.on("connection", async (socket) => {
  console.log(socket.nsp.sockets);
  sockets.push(socket);
  console.log("client connected");
  socket.on("self connected", (NewUser) => {
    sockets.push(NewUser);
    console.log(sockets);

    socket.emit("update users array", sockets);
  });

  socket.on("error", console.error);
  socket.on("message", (data) => {
    console.log(data);
    sockets.forEach((client) => client.emit("receive message", data));
  });
  socket.on("disconnect", async () => {
    try {
      sockets = await io.fetchSockets();
      console.log(sockets.length);
    } catch (error) {
      console.error(error);
    }
  });
});

httpServer.listen(process.env.PORT || 8080, () =>
  console.log("The server is running.")
);

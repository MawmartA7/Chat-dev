const { createServer } = require("http");
const app = require("express")();
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require("dotenv");

dotenv.config();

let sockets = [];

io.on("connection", async (socket) => {
  socket.on("error", console.error);
  sockets.push(socket);
  socket.on("message", (data) => {
    console.log(data);
    sockets.forEach((client) => client.emit("receive message", data));
  });

  console.log("client connected");

  socket.on("disconnect", async () => {
    sockets = await io.fetchSockets();
    console.log(sockets.length);
  });
});

server.listen(process.env.PORT || 8080, () =>
  console.log("The server is running.")
);

const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

//since we are taking data from the frontend, we need to tell our server to accept the data
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

app.use("/api/user", userRoutes); //Abstracting the logic for routes in userRoutes
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(`Server is started on the port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000, //the amount of time it will wait while being inactive
  cors: {
    //to avoid cross-origin errors we pass cors
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  //each user should get their own socket
  socket.on("setup", (userData) => {
    //take user data from frontend, creating a new socket where frontend will take some data and join a room

    //create new room with the id of the userData
    socket.join(userData._id); //this room will be exclusive to that particular user'
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room); // creates a room with the userID and when the other user opens this chat from their device, they are added to this room
    console.log("user joined room : " + room); //clicking on any chat creates a new room
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

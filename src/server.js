import express from "express";
import http from 'http';
import { Server } from "socket.io";
import serverConfig from "./config/serverConfig.js";
import { connectDB } from "./config/db.config.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import taskRouter from "./routes/taskRoutes.js";
import logRouter from "./routes/logRoutes.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
//middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.get('/', (req, res) => {
    res.send('Welcome to collabboard backend!');
})

app.use('/auth', userRouter);
app.use('/tasks', taskRouter);
app.use("/logs", logRouter);

// Make socket.io accessible in the app
app.set('io', io);

// Socket.IO connection listener
io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

server.listen(serverConfig.PORT, () => {
    connectDB();
    console.log(`Server running on port ${serverConfig.PORT}`);
})

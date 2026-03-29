const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Stripe = require("stripe");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//  CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://healthcare-platform-smos.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

//  Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

//  Test routes
app.get("/", (req, res) => {
  res.send("Healthcare API Running...");
});

app.get("/test", (req, res) => {
  res.json({ message: "Working" });
});

//  SOCKET.IO SETUP (FIXED)
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://healthcare-platform-smos.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", peerId);
    });
  });
});

//  MongoDB (optional if already in connectDB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//  IMPORTANT: USE server.listen (NOT app.listen)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
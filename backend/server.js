const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const Stripe = require("stripe");
const mongoose = require("mongoose");

dotenv.config();
connectDB();


const authRoutes = require("./routes/auth");
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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




app.use(express.json());

app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Healthcare API Running...");
});


app.get("/test", (req, res) => {
  res.json({ message: "Working" });
});



const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://healthcare-platform-smos.vercel.app",
    methods: ["GET", "POST"]
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


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

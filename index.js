const express = require("express");
const http = require("http"); // To create an HTTP server
const { Server } = require("socket.io"); // Import Socket.IO
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/db");
const {
  notFound,
  errorHandler,
} = require("./common-middleware/errorMiddleware");

const cors = require("cors");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const welcomeMessage =
  "<h1 style='color: #801317;display:flex;justify-content:center; padding-top:30px';>Welcome to Ecommerce Backend! <br/> Author - Preetam Kr.</h1>";

// Routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  res.send(welcomeMessage);
});

app.get("/api", (req, res) => {
  res.send(welcomeMessage);
});

// Middleware for handling errors
app.use(notFound);
app.use(errorHandler);

// Create an HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your client URL for security
    methods: ["GET", "POST"],
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for custom events or disconnections if necessary
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make `io` globally accessible for emitting events
global.io = io;

// Start the server
server.listen(port, () => {
  console.log(`Backend server is running at port ${port}`);
});

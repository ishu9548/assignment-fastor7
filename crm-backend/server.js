require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Fastor CRM & App API is running successfully",
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/leadRoutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGODB_URI and JWT_SECRET must be configured in .env");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
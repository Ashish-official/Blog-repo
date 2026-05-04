import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
    : []),
].map((origin) => origin.replace(/\/$/, ""));

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Blog API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/posts", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", userRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;

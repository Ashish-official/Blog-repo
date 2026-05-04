import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ IMPORTANT
    credentials: true,
  })
);
app.options("*", cors());

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
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
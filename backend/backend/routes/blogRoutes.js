import express from "express";
import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogPost.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createBlogPost);
router.post("/create", authMiddleware, createBlogPost);
router.get("/", getAllBlogPosts);
router.get("/:id", getBlogPostById);
router.put("/:id", authMiddleware, adminOnly, updateBlogPost);
router.delete("/:id", authMiddleware, adminOnly, deleteBlogPost);

export default router;

import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  DeleteUser,
} from "../controllers/userController.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = Router();

router.post("/", registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/all", authMiddleware, adminOnly, getAllUsers);
router.get("/:id", authMiddleware, adminOnly, getUserById);
router.put("/:id", authMiddleware, adminOnly, updateUser);
router.delete("/:id", authMiddleware, adminOnly, DeleteUser);

export default router;

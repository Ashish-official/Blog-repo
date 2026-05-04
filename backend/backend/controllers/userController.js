import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const userResponse = (user) => ({
  id: user._id,
  userName: user.userName,
  email: user.email,
  roles: user.roles,
});

const registerUser = async (req, res) => {
  const { userName, email, password, role } = req.body;

  try {
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      roles: role || "user",
    });

    res.status(201).json({
      token: createToken(newUser),
      user: userResponse(newUser),
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: createToken(user),
      user: userResponse(user),
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, email, password, roles } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.roles = roles || user.roles;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.status(200).json(userResponse(updatedUser));
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const DeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUser,
  DeleteUser,
  getUserById,
};

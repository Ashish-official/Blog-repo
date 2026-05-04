import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

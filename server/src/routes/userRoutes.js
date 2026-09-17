import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  guestLogin,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/signup", registerUser); // Alias
userRouter.post("/login", loginUser);
userRouter.post("/guest-login", guestLogin);
userRouter.get("/me", authMiddleware, getUserProfile);

export default userRouter;

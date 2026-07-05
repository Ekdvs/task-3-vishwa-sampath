import express from "express";
import auth from "../middleware/auth.js";
import { getUserData, login, logout, register } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/me", auth, getUserData);
authRouter.post("/logout", auth, logout);

export default authRouter;
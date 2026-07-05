import express from "express";
import auth from "../middleware/auth.js";
import { createCategory, deleteCategory, getmyAllCategories, updateCategory } from "../controllers/categoryController.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/my",auth,getmyAllCategories)
categoriesRouter.post("/create",auth,createCategory)
categoriesRouter.put("/update/:id",auth,updateCategory)
categoriesRouter.delete("/delete/:id",auth,deleteCategory)

export default categoriesRouter;
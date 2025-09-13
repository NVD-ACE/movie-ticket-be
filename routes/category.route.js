import express from "express";
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const categoryRoute = express.Router();

categoryRoute.get("/", getCategories);
categoryRoute.post("/", createCategory);
categoryRoute.get("/:id", getCategoryById);
categoryRoute.put("/:id", updateCategory);
categoryRoute.delete("/:id", deleteCategory);

export default categoryRoute;
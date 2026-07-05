import express from 'express';
import { createBudget, deleteBudget, getAllBudgetProgress, getBudgetById, getBudgetProgress, getBudgets, updateBudget } from '../controllers/budgetController.js';
import auth from '../middleware/auth.js';
const budgetRouter = express.Router();

budgetRouter.post('/create',auth, createBudget);
budgetRouter.put('/update/:budgetId',auth, updateBudget);
budgetRouter.get('/get/:budgetId',auth, getBudgetById);
budgetRouter.get('/getAll',auth, getBudgets);
budgetRouter.delete('/delete/:budgetId',auth, deleteBudget);
budgetRouter.get("/progress/:budgetId", auth, getBudgetProgress);
budgetRouter.get("/all-progress", auth, getAllBudgetProgress);

export default budgetRouter;
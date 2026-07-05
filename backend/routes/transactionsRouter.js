import express from "express";
import auth from "../middleware/auth.js";
import { createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../controllers/transactionController.js";

const TransactionsRouter = express.Router();

TransactionsRouter.post("/create", auth, createTransaction);
TransactionsRouter.put("/update/:transactionId", auth, updateTransaction);
TransactionsRouter.delete("/delete/:transactionId", auth, deleteTransaction);
TransactionsRouter.get("/my", auth, getTransactions);
TransactionsRouter.get("/my/:transactionId", auth, getTransactionById);

export default TransactionsRouter;
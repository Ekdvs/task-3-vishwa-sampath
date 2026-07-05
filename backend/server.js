import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/dg.js';
import authRouter from './routes/authRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import TransactionsRouter from './routes/transactionsRouter.js';
import budgetRouter from './routes/budgetRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import cors from 'cors';

dotenv.config();
const app = express();

//add cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth",authRouter)
app.use("/api/categories",categoriesRouter)
app.use("/api/transactions",TransactionsRouter)
app.use("/api/budgets", budgetRouter);
app.use("/api/dashboard", dashboardRouter);
//test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
});
import Category from "../models/category.js";
import Transaction from "../models/transaction.js";
import Budget from "../models/budget.js";

export const createTransaction = async (request, response) => {
    try {
        const { title, amount, type, categoryId, note, date } = request.body;
        const userId = request.userId;

        if (!title || !amount || !type || !categoryId) {
            return response.status(400).json({
                success: false,
                message: "All required fields must be provided",
                error: true
            });
        }

  
        if (amount <= 0) {
            return response.status(400).json({
                success: false,
                message: "Amount must be greater than 0",
                error: true
            });
        }


        const category = await Category.findOne({
            _id: categoryId,
            userId: userId
        });

        if (!category) {
            return response.status(400).json({
                success: false,
                message: "Category not found or not allowed",
                error: true
            });
        }

        if (category.type !== type) {
            return response.status(400).json({
                success: false,
                message: "Invalid category for selected transaction type",
                error: true
            });
        }


        const transaction = await Transaction.create({
            userId,
            title,
            amount,
            type,
            categoryId,
            note,
            date: date ? new Date(date) : new Date()
        });


        if (type === "expense") {
            const budget = await Budget.findOne({
                userId,
                categoryId
            });

            if (budget) {
                budget.spentAmount = (budget.spentAmount || 0) + amount;

                
                const remaining = budget.amount - budget.spentAmount;

                await budget.save();

                
                if (remaining < 0) {
                    console.log("⚠️ Budget exceeded for category:", category.name);
                }
            }
        }


        return response.status(201).json({
            success: true,
            error: false,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (error) {
        console.error("Transaction Error:", error);

        return response.status(500).json({
            success: false,
            message: "Failed to create transaction",
            error: true
        });
    }
};

//update transaction for user
export const updateTransaction = async (request, response) => {
    try {
        const { transactionId } = request.params;
        const { title, amount, type, categoryId, note, date } = request.body;

        if (!transactionId) {
            return response.status(400).json({
                success: false,
                message: "Transaction ID is required",
                error: true
            });
        }

        // validate category
        if (categoryId && type) {
            const category = await Category.findById(categoryId);
            if (!category || category.type !== type) {
                return response.status(400).json({
                    success: false,
                    message: "Invalid category for selected type",
                    error: true
                });
            }
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId: request.userId },
            {
                title,
                amount,
                type,
                categoryId,
                note,
                date
            },
            { new: true }
        );

        if (!updatedTransaction) {
            return response.status(404).json({
                success: false,
                message: "Transaction not found",
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Transaction updated successfully",
            data: updatedTransaction
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Failed to update transaction",
            error: true
        });
    }
};

//get all transactions for user
export const getTransactions = async (request, response) => {
    try {
        const { type, categoryId, from, to } = request.query;

        const filter = { userId: request.userId };

        if (type) filter.type = type;
        if (categoryId) filter.categoryId = categoryId;

        if (from || to) {
            filter.date = {};

            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const transactions = await Transaction.find(filter)
            .populate("categoryId", "name type")
            .sort({ date: -1 });

        return response.status(200).json({
            success: true,
            error: false,
            message: "Transactions fetched successfully",
            data: transactions
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Failed to get transactions",
            error: true
        });
    }
};

//delete transaction for user
export const deleteTransaction = async (request, response) => {
    try {
        const { transactionId } = request.params;

        if (!transactionId) {
            return response.status(400).json({
                success: false,
                message: "Transaction ID is required",
                error: true
            });
        }

        const deleted = await Transaction.findOneAndDelete({
            _id: transactionId,
            userId: request.userId
        });

        if (!deleted) {
            return response.status(404).json({
                success: false,
                message: "Transaction not found",
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Failed to delete transaction",
            error: true
        });
    }
};

//get transactions for transaction by id
export const getTransactionById = async (request, response) => {
    try {
        const { transactionId } = request.params;

        if (!transactionId) {
            return response.status(400).json({
                success: false,
                message: "Transaction ID is required",
                error: true
            });
        }

        const transaction = await Transaction.findOne({
            _id: transactionId,
            userId: request.userId
        }).populate("categoryId", "name type");

        if (!transaction) {
            return response.status(404).json({
                success: false,
                message: "Transaction not found",
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Transaction fetched successfully",
            data: transaction
        });

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "Failed to get transaction",
            error: true
        });
    }
};

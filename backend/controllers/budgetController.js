import mongoose from "mongoose";
import Budget from "../models/budget.js";
import Transaction from "../models/transaction.js";

//cretae new budget for user
export const createBudget = async (req, res) => {
  try {
    const { categoryId, amount, period, startDate, endDate, categoryName } = req.body;
    const userId = req.userId;

    if (!categoryId || !amount || !period) {
      return res.status(400).json({
        message: "Category ID, Amount and Period are required",
        error: true,
        success: false
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
        error: true,
        success: false
      });
    }

    const budget = await Budget.create({
      userId,
      categoryId,
      amount,
      period,
      startDate,
      endDate,
      categoryName
    });

    return res.status(201).json({
      message: "Budget created successfully",
      success: true,
      error: false,
      data: budget
    });

  } catch (error) {
    console.error("Create Budget Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};


//update budget for user
export const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const userId = req.userId;

    const updateData = req.body;

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId },
      updateData,
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({
        message: "Budget not found",
        error: true,
        success: false
      });
    }

    return res.status(200).json({
      message: "Budget updated successfully",
      success: true,
      data: updatedBudget
    });

  } catch (error) {
    console.error("Update Budget Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};


//get all budgets for user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });

    return res.status(200).json({
      message: "Budgets retrieved successfully",
      success: true,
      data: budgets
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

//get single budget by id
export const getBudgetById = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findOne({
      _id: budgetId,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
        error: true
      });
    }

    return res.status(200).json({
      success: true,
      data: budget
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};

//delete budget for user
export const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const deleted = await Budget.findOneAndDelete({
      _id: budgetId,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Budget not found",
        error: true
      });
    }

    return res.status(200).json({
      message: "Budget deleted successfully",
      success: true
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};


//get budget progress for user
export const getBudgetProgress = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const userId = req.userId;

    const budget = await Budget.findOne({ _id: budgetId, userId });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
        error: true
      });
    }

    const startDate = budget.startDate || new Date(new Date().setDate(1));
    const endDate = budget.endDate || new Date();

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          categoryId: new mongoose.Types.ObjectId(budget.categoryId),
          type: "expense",
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const spent = expenses[0]?.total || 0;

    const percentage = budget.amount > 0
      ? (spent / budget.amount) * 100
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        budgetId: budget._id,
        categoryName: budget.categoryName,
        budgetAmount: budget.amount,
        spent,
        remaining: budget.amount - spent,
        percentage: Number(percentage.toFixed(2)),
        isExceeded: spent > budget.amount
      },
      message: "Budget progress retrieved successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};


//get progress for all budgets for user
export const getAllBudgetProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const budgets = await Budget.find({ userId });

    const results = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = budget.startDate || new Date(new Date().setDate(1));
        const endDate = budget.endDate || new Date();

        const expenses = await Transaction.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              categoryId: new mongoose.Types.ObjectId(budget.categoryId),
              type: "expense",
              date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" }
            }
          }
        ]);

        const spent = expenses[0]?.total || 0;

        const percentage = budget.amount > 0
          ? (spent / budget.amount) * 100
          : 0;

        return {
          budgetId: budget._id,
          categoryName: budget.categoryName,
          budgetAmount: budget.amount,
          spent,
          remaining: budget.amount - spent,
          percentage: Number(percentage.toFixed(2)),
          isExceeded: spent > budget.amount
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: results,
      message: "All budget progress retrieved successfully",
      error: false
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: true });
  }
};


import Transaction from "../models/transaction.js";
import mongoose from "mongoose";
//get summary of user dashboard
export const getDashboardSummary = async (request, response) => {
    try {
        const userId = request.userId;

        if (!userId) {
            return response.status(400).json(
                {
                    message: "User ID is required",
                    error: true,
                    success: false
                }
            )
        }

        const results = await Transaction.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const income = results.find(result => result._id === "income")?.totalAmount || 0;
        const expense = results.find(result => result._id === "expense")?.totalAmount || 0;
        const balance = income - expense;

        return response.status(200).json(
            {
                message: "Dashboard summary retrieved successfully",
                error: false,
                success: true,
                data: {
                    income,
                    expense,
                    balance
                }
            }
        )
    } catch (error) {
        return response.status(500).json(
            {
                message: "Internal Server Error",
                error: true,
                success: false
            }
        )
    }
}

//get charts data for user dashboard
export const getDashboardChartsData = async (request, response) => {
    try {

        const userId = request.userId;

        if (!userId) {
            return response.status(400).json(
                {
                    message: "User ID is required",
                    error: true,
                    success: false
                }
            )
        }

        // Monthly income vs expense (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyData = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                }
            }
        ]);

        // Expense by category
        const categoryData = await Transaction.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId), type: "expense" }
            },
            {
                $group: {
                    _id: "$categoryId",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: '$categoryInfo' },
{ $project: { name: '$categoryInfo.name', totalAmount: 1 } }

        ]);

        // Recent transactions
        const recentTransactions = await Transaction.find({ userId })
            .populate('categoryId', "name")
            .sort({ date: -1 }).limit(5);

        return response.status(200).json(
            {
                message: "Dashboard charts data retrieved successfully",
                error: false,
                success: true,
                data: {
                    monthlyData,
                    categoryData,
                    recentTransactions
                }
            }
        )

    } catch (error) {
        return response.status(500).json(
            {
                message: "Internal Server Error",
                error: true,
                success: false
            }
        )
    }
}
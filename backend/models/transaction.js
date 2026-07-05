import mongoose from "mongoose";

const transactionSchema =  new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
        categoryId:{
            type:mongoose.Schema.ObjectId,
            ref:"Category"
        },
        title:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        type:{
            type:String,
            enum:["income","expense"],
            required:true
        },
        note:{
            type:String
        },
        date:{
            type:Date,
            
        }

    },
    {timestamps:true}
)

const Transaction =new mongoose.model("Transaction",transactionSchema)

export default Transaction;
import Category from "../models/category.js";


//get all user categories
export const getmyAllCategories = async(request,response)=>{
    try {

        const userId = request.userId;

        if(!userId){
            return response.status(400).json(
                {
                    message:"User ID is required",
                    error:true,
                    success:false
                }
            )
        }

        const categories = await Category.find({ userId });

        return response.status(200).json(
            {
                message:"Categories retrieved successfully",
                error:false,
                success:true,
                data:categories
            }
        )


        
    } catch (error) {
        return response.status(500).json(
            {
                message:"Internal Server Error",
                error:true,
                success:false
            }
        )
    }
}

//create new category
export const createCategory = async(request,response)=>{
    try {

        const userId = request.userId;
        const { name, type } = request.body;

        if(!userId){
            return response.status(400).json(
                {
                    message:"User ID is required",
                    error:true,
                    success:false
                }
            )
        }

        if(!name || !type){
            return response.status(400).json(
                {
                    message:"Name and type are required",
                    error:true,
                    success:false
                }
            )
        }

        const newCategory = new Category({
            userId,
            name,
            type
        })  

        await newCategory.save();

        return response.status(201).json(
            {
                message:"Category created successfully",
                error:false,
                success:true,
                data:newCategory
            }
        )
        
    } catch (error) {
        return response.status(500).json(
            {
                message:"Internal Server Error",
                error:true,
                success:false
            }
        )
    }
}

//delete category
export const deleteCategory = async(request,response)=>{
    try {
        const userId = request.userId;
        const categoryId = request.params.id;

        if(!userId){
            return response.status(400).json(
                {
                    message:"User ID is required",
                    error:true,
                    success:false
                }
            )
        }

        if(!categoryId){
            return response.status(400).json(
                {
                    message:"Category ID is required",
                    error:true,
                    success:false
                }
            )
        }

        const deletedCategory = await Category.findOneAndDelete({ _id: categoryId, userId });

        if(!deletedCategory){
            return response.status(404).json(
                {
                    message:"Category not found",
                    error:true,
                    success:false
                }
            )
        }

        return response.status(200).json(
            {
                message:"Category deleted successfully",
                error:false,
                success:true
            }
        )
        
    } catch (error) {
        return response.status(500).json(
            {
                message:"Internal Server Error",
                error:true,
                success:false
            }
        )
    }
}

//update category
export const updateCategory = async(request,response)=>{
    try {
        const userId = request.userId;
        const categoryId = request.params.id;
        const { name, type } = request.body;

        if(!userId){ 
            return response.status(400).json(
                {
                    message:"User ID is required",
                    error:true,
                    success:false
                }
            )
        }

        if(!categoryId){
            return response.status(400).json(
                {
                    message:"Category ID is required",
                    error:true,
                    success:false
                }
            )
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, userId },
            { name, type },
            { new: true }
        );

        if(!updatedCategory){
            return response.status(404).json(
                {
                    message:"Category not found",
                    error:true,
                    success:false
                }
            )
        }

        return response.status(200).json(
            {
                message:"Category updated successfully",
                error:false,
                success:true,
                data:updatedCategory
            }
        )
        
    } catch (error) {
        return response.status(500).json(
            {
                message:"Internal Server Error",
                error:true,
                success:false
            }
        )
    }
}
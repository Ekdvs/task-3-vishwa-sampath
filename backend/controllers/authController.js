import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generatedAccesToken from "../utill/generatedAccesToken.js";

//register user
export const register = async (request, response) => {
    try {
        //get user input
        const { name, email, password } = request.body;

        //validate user input
        if (!name || !email || !password) {
            return response.status(400).json(
                {
                    message: "All fields are required",
                    error: true,
                    success: false
                }
            )
        }

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json(
                {
                    message: "User already exists",
                    error: true,
                    success: false
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        return response.status(201).json(
            {
                message: "User registered successfully",
                error: false,
                success: true,
                data: user
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

//login user
export const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        //validate user input
        if (!email || !password) {
            return response.status(400).json(
                {
                    message: "All fields are required",
                    error: true,
                    success: false
                }
            )
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).json(
                {
                    message: "Invalid credentials",
                    error: true,
                    success: false
                }
            )
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(400).json(
                {
                    message: "Invalid credentials",
                    error: true,
                    success: false
                }
            )
        }

        //generate token
        const accessToken = await generatedAccesToken(user);

        const safeUser = user.toObject();
        delete safeUser.password;

        return response.status(200).json(
            {
                message: "User logged in successfully",
                error: false,
                success: true,
                data: {
                    user: safeUser,
                    accessToken
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

//get user data after login
export const getUserData = async (request, response) => {
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

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return response.status(404).json(
                {
                    message: "User not found",
                    error: true,
                    success: false
                }
            )
        }

        return response.status(200).json(
            {
                message: "User data retrieved successfully",
                error: false,
                success: true,
                data: user
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

//logout user
export const logout = async (request, response) => {
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

        return response.status(200).json(
            {
                message: "User logged out successfully",
                error: false,
                success: true
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
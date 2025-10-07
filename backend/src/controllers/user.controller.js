import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"
import { comparePassword, encryptPassword } from "../helper/auth.helper.js";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

const register=asyncHandler( async (req,res)=>{
    const {name,email,password}=req.body;
    if(!name||!email||!password)
        res.status(400).json({message:"All fields are required"})

    const existedUserOnEmail=await User.findOne({email})
    // const existedUserOnUserName=await User.findOne({name})
    if(existedUserOnEmail) res.status(400).json({message:"User Already exists with the same email"})
    // if(existedUserOnUserName) res.status(400).json({message:"User Already exists with the same username"})
    
    const user=await User.create({
        name:name,
        email:email,
        password:password,
    })

    res.status(200).json(user)
})

const loginuser=asyncHandler( async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) return res.status(400).json({message:"Email and passwords are required"})
    
    const user=await User.findOne({email})
    if(!user) return res.status(400).json({message:"User does not exists"})
    
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid) return res.status(400).json({message:"Wrong Password"});

    const accessToken=user.generateToken()
    console.log("Generated token")
    console.log(accessToken)

    res.cookie('token', accessToken, {
        httpOnly: true,       // Prevent client-side access
        secure: false,         // Send only over HTTPS
        sameSite: 'Strict',   // Prevent CSRF
        maxAge: 3600000       // Cookie expiration (1 hour)
    });

    res.status(200).send(user)
})

const logoutuser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user.id);
    if(!user)throw new ApiError(400,"User is not logged in");

    const options={
        httpOnly:true,
        secure:false
    }

    res.status(200)
    .clearCookie("token",options)
    .json({message:"User logged out successfully"})
})

const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find()
    if(!users) throw new ApiError(400,"No users found")

    return res.status(200).send(users)
})

const getUserById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!id) throw new ApiError(400,"Id is required")

    const user=await User.findById(id)
    if(!user)throw new ApiError(500,"No user found")
    
    res.status(200).send(user)
})

const getLoggedinUser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user.id)
    if(!user)throw new ApiError(400,"User is not logged in")
    
    res.status(200).send(user)
})

// Add this to your user.controller.js

const updateUser = asyncHandler(async (req, res) => {
    console.log("=== UPDATE USER STARTED ===");
    console.log("req.user.id:", req.user.id);
    console.log("req.body:", req.body);
    
    // Get user from JWT
    const user = await User.findById(req.user.id);
    console.log("User found in DB:", user);
    
    if (!user) throw new ApiError(404, "User not found");

    const updates = req.body;

    // Check if email is being changed
    if (updates.email && updates.email !== user.email) {
        const existingUser = await User.findOne({ email: updates.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
    }

    // Update each field
    Object.keys(updates).forEach(key => {
        console.log(`Updating ${key} from "${user[key]}" to "${updates[key]}"`);
        if (updates[key] !== undefined && updates[key] !== null) {
            user[key] = updates[key];
        }
    });

    console.log("User before save:", user);
    
    // Save the user
    await user.save();
    
    console.log("User after save:", user);
    
    // Verify by fetching again
    const verifyUser = await User.findById(req.user.id);
    console.log("User verified from DB:", verifyUser);

    res.status(200).json({
        message: "User updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

export { register, loginuser, logoutuser, getAllUsers, getUserById, updateUser,getLoggedinUser }
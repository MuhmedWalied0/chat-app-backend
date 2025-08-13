import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

const register=async(req,res)=>{
    //check is a valid username
    const user = await User.findOne({
    username: req.validatedData.username
    });

    if(user){
        return res.status(400).json({
            success: false,
            errors: {
                username:"Username is already taken"
            }
        });
    }

    //hash password
    req.validatedData.password=await bcrypt.hash(req.validatedData.password,10)

    //create new user
    const newUser=await User.create(req.validatedData)
    
    const token = jwt.sign(
    {
        id: newUser._id,
        username: newUser.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const data={
        user:{
            id:newUser._id,
            firstName:newUser.firstName,
            lastName:newUser.lastName,
            username:newUser.username,
        },
        token
    }

    return res.status(200).json({
        success: true,
        data
    });
}

const login=async(req,res)=>{
    const {username,password}=req.validatedData
    //find user
    const user = await User.findOne({ username });
    if(!user){
        return res.status(400).json({
            success: false,
            errors: {
                username:"Invalid username or password"
            }
        });
    }
    const isValidPassword=await bcrypt.compare(password,user.password)
    
    if(!isValidPassword){
        return res.status(400).json({
            success: false,
            errors: {
                username:"Invalid username or password"
            }
        });
    }

    const token = jwt.sign(
    {
        id: user._id,
        username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const data = {
        user:{
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            username:user.username,
        },
        token
    };

    return res.status(200).json({
        success: true,
        data
    });
}

export {
    register,login
}
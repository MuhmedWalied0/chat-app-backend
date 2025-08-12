import express from 'express';
import connectDB from './config/dbConnect.js';
import userAuth from './routes/authUser.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
connectDB()
const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.use("/api/auth",userAuth)

app.listen(3000,()=>{
    console.log("Project started")
})
import express from 'express';
import connectDB from './config/dbConnect.js';
import userAuth from './routes/authUser.js';
import dotenv from 'dotenv';
import cors from 'cors';
import privateChat from './routes/privateChat.js';
import messages from './routes/messages.js';
import { authenticateToken } from './middlewares/authenticateToken.js';

dotenv.config();
connectDB()
const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.use("/api/auth",userAuth)

app.use("/api/private-chat",authenticateToken,privateChat)

app.use("/api/messages",authenticateToken,messages)


app.listen(3000,()=>{
    console.log("Project started")
})
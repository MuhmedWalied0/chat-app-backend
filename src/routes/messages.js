import express from 'express'
import Message from '../models/Message.js';
import mongoose from 'mongoose';

const router=express.Router()


router.get("/:chatId/messages", async (req, res) => {
    const { chatId } = req.params;
    const userId=new mongoose.Types.ObjectId(String(req.user.id))
    const messages = await Message.aggregate([
    { $match: { privateChat: new mongoose.Types.ObjectId(chatId) } },
    { $sort: { createdAt: 1 } },
    {
        $project: {
        id: '$_id',
        isSender: { $eq: ['$sender', userId] },
        privateChat: 1,
        content: 1,
        messageType: 1,
        isRead: 1,
        createdAt: 1
        }
    }
    ]);
    
    res.json({success:true,data:messages});
})

router.get("/:messageId",(req,res)=>{

})
router.post("/:chatId/messages", async (req, res) => {
    const { chatId } = req.params;
    const senderId = req.user.id;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Message content is required" });
    }

    const newMessage = await Message.create({
        privateChat: chatId,
        sender: senderId,
        content,
    });

    res.status(201).json(newMessage);
});


router.put("/:messageId",(req,res)=>{

})

router.delete("/:messageId",(req,res)=>{

})


export default router
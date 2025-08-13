import express from 'express'
import PrivateChat from '../models/PrivateChat.js'
import Message from '../models/Message.js';
import mongoose from 'mongoose';

const router=express.Router()

router.get("/",async(req,res)=>{
    const userId = new mongoose.Types.ObjectId(String(req.user.id));
    const chats = await PrivateChat.aggregate([
    {
        $match: {$or: [{ user1: userId },{ user2: userId }]}
    },
    {
        $addFields: {
            otherUserId: {$cond: [
                { $eq: ['$user1', userId] },
                '$user2',
                '$user1'
        ]}}
    },
    {
        $lookup: {
            from: "users",
            localField: "otherUserId",
            foreignField: "_id",
            as: "otherUser"
        }
    },
    {
        $lookup: {
            from: 'messages',let: { chatId: '$_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$privateChat', '$$chatId'] } } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 },
                {
                $project: {
                    content: 1,
                    createdAt: 1,
                    isSender: {
                    $cond: [
                        { $eq: ['$sender', userId] },
                        true,
                        false
                    ]
                    },
                    _id: 0
                }
                }
            ],
            as: 'lastMessage'
        }
    },
    {
        $unwind: {
            path: '$lastMessage',
            preserveNullAndEmptyArrays: true 
        }
    },
    {
        $unwind: {
            path: '$otherUser',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 1,
            otherUser: { username: 1,_id:1 },
            lastMessage: 1
        }
    }]);

    res.json(chats);
})

router.get("/:chatId", async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user.id; 

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chats = await PrivateChat.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
    { $addFields: {otherUserId: {$cond: [
            { $eq: ['$user1', userId] },
            '$user2',
            '$user1'
        ]}}
    },
    {  $lookup: {from: 'users',localField: 'otherUserId',foreignField: '_id',as: 'otherUser'}
    },
    { $unwind: '$otherUser' },
    { $project: {
        _id: 1,
        otherUser: { _id: 1, username: 1, firstName: 1, lastName: 1 }
        }
    }
    ])
    if (chats.length === 0) {
        return res.status(404).json({ message: "Private chat not found" });
    }

    const messages = await Message.aggregate([
        { $match: { privateChat: new mongoose.Types.ObjectId(chatId) } },
        { $sort: { createdAt: 1 } },
        {
        $project: {
            _id: 1,
            content: 1,
            messageType: 1,
            isRead: 1,
            createdAt: 1,
            isSender: { $eq: ['$sender', userId] }
        }
        }
    ]);

    res.json({
        success: true,
        data: {
        chat:chats[0],
        messages
        }
    });
});

router.post("/",async(req,res)=>{
    const user = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
        return res.status(400).json({ message: "otherUserId is required" });
    }

    let chat = await PrivateChat.findOne({
    $or: [
        { user1: user, user2: otherUserId },
        { user1: otherUserId, user2: user },
    ],
    });

    if (chat) {
        return res.json(chat);
    }

    chat = await PrivateChat.create({
        user1: user,
        user2: otherUserId,
    });

    res.status(201).json(chat);
})

router.delete("/:chatId",async(req,res)=>{
    const chat = await PrivateChat.findByIdAndDelete(req.params.chatId);
    if (!chat) {
        return res.status(404).json({ message: "Private chat not found" });
    }
    await Message.deleteMany({ privateChat: req.params.chatId});

    return res.json({ message: "Private chat deleted successfully" });
})


export default router
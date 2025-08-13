import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    privateChat: { type: mongoose.Schema.Types.ObjectId, ref: 'PrivateChat', default: null },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
    content: { type: String, required: true },
    messageType: { 
        type: String, 
        enum: ['text', 'image', 'file', 'voice'], 
        default: 'text' 
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
    }, {
    timestamps: true
});

const Message= mongoose.model('Message', MessageSchema);

export default Message;


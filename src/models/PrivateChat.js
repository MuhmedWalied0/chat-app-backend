import mongoose from 'mongoose';

const PrivateChatSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
    }, {
    timestamps: true
});
PrivateChatSchema.index({ user1: 1, user2: 1 }, { unique: true });

const PrivateChat = mongoose.model('PrivateChat', PrivateChatSchema);

export default PrivateChat;

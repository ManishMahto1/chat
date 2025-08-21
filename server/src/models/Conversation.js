
import mongoose, { Schema } from "mongoose";
const ConversationSchema = new mongoose.Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
});

export default mongoose.model('Conversation', ConversationSchema);

import mongoose, { Schema} from "mongoose";
const MessageSchema = new mongoose.Schema({
  conversationId:  { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ["sending", "sent", "delivered","read"], default: "sent" },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
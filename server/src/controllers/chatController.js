// controllers/chatController.js
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// ✅ Get all users except the logged-in one
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select('-password');
    res.json(users.map(user => ({
      ...user.toObject(),
      _id: user._id.toString()
    })));
  } catch (err) {
    console.error("❌ getUsers error:", err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ✅ Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params;

    // Verify the user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    // Ensure IDs are strings
    res.json(messages.map(msg => ({
      ...msg.toObject(),
      _id: msg._id.toString(),
      conversationId: msg.conversationId.toString(),
      senderId: msg.senderId.toString(),
    })));
  } catch (err) {
    console.error("❌ getMessages error:", err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// ✅ Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    console.log("🔍 createConversation called");
    console.log("req.userId:", req.userId);
    console.log("participantId:", participantId);

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.userId, participantId] }
    });

    if (existingConversation) {
      console.log("⚡ Conversation already exists:", existingConversation._id);
      return res.json({
        ...existingConversation.toObject(),
        _id: existingConversation._id.toString(),
        participants: existingConversation.participants.map(p => p.toString()),
      });
    }

    const conversation = new Conversation({
      participants: [req.userId, participantId],
    });

    await conversation.save();
    console.log("✅ New conversation saved:", conversation._id);

    res.status(201).json({
      ...conversation.toObject(),
      _id: conversation._id.toString(),
      participants: conversation.participants.map(p => p.toString()),
    });
  } catch (err) {
    console.error('❌ Create conversation error:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// ✅ Send Message 
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.userId;   // 🔥 use req.userId, not req.user._id

    if (!sender) {
      return res.status(401).json({ message: "Unauthorized: no sender found" });
    }

    // check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // create new message
    const newMessage = new Message({
      conversationId,
      senderId: sender,   // make sure field name matches your Message model
      text,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* // ✅ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.user._id;

    // check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // create new message
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
 */
/* // ✅ Get Messages of a conversation
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params; // conversationId
    const messages = await Message.find({ conversationId: id })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}; */
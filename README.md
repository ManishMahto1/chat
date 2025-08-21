# Chat App - React Native + Node.js + Socket.IO

A real-time 1:1 chat application built with **React Native** (frontend) and **Node.js + Express + Socket.IO** (backend).  
Messages are stored in **MongoDB** and the app features JWT-based authentication, online/offline status, typing indicators, and message delivery/read receipts.

---

## 📂 Project Structure

### Mobile (React Native)
mobile/
│── src/
│ ├── api/
│ │ ├── authApi.ts
│ │ └── chatApi.ts
│ │
│ ├── components/
│ │ ├── ChatBubble.tsx
│ │ ├── InputBox.tsx
│ │ └── UserCard.tsx
│ │
│ ├── context/
│ │ ├── AuthContext.tsx
│ │ └── SocketContext.tsx
│ │
│ ├── navigation/
│ │ └── AppNavigator.tsx
│ │
│ ├── screens/
│ │ ├── Auth/
│ │ │ ├── LoginScreen.tsx
│ │ │ └── RegisterScreen.tsx
│ │ ├── HomeScreen.tsx
│ │ └── ChatScreen.tsx
│ │
│ ├── utils/
│ │ └── storage.ts
│ ├── App.tsx
│ └── types.ts

shell
Copy
Edit

### Server (Node.js + Express)
```bash
server/
│── src/
│ ├── config/
│ │ ├── db.ts
│ │ └── jwt.ts
│ │
│ ├── controllers/
│ │ ├── authController.ts
│ │ └── chatController.ts
│ │
│ ├── models/
│ │ ├── User.ts
│ │ ├── Message.ts
│ │ └── Conversation.ts
│ │
│ ├── routes/
│ │ ├── authRoutes.ts
│ │ └── chatRoutes.ts
│ │
│ ├── sockets/
│ │ └── chatSocket.ts
│ │
│ ├── middlewares/
│ │ └── authMiddleware.ts
│ │
│ ├── utils/
│ │ └── logger.ts
│ │
│ ├── app.ts
│ └── server.ts
│
├── package.json
└── tsconfig.json

markdown
Copy
Edit

---

## ⚡ Features (MVP)

- **Authentication**: Register & Login with JWT
- **User List**: View all users and start chat
- **Chat Screen**:
  - Real-time messaging with Socket.IO
  - Messages persist in database
  - Typing indicator
  - Online/offline status
  - Message delivery/read receipts
- **Basic UI**:
  - Auth screens
  - Home screen (user list + last message)
  - Chat screen (scrollable messages, input box, typing, ticks)
- **API & Socket events**:
  - REST: `/auth/register`, `/auth/login`, `/users`, `/conversations/:id/messages`
  - Socket: `message:send`, `message:new`, `typing:start|stop`, `message:read`

---

## 🚀 Setup

### 1. Clone Repo
```bash
git clone <your-repo-url>
cd <repo-folder>
2. Backend Setup
bash
Copy
Edit
cd server
npm install
cp .env.example .env      # add your environment variables
npm run build             # compile TypeScript
npm start                 # start server
Backend URL: http://localhost:5000 (for local) or your Render deployment URL.

3. Mobile Setup (Expo)
bash
Copy
Edit
cd mobile
npm install
npx expo start
Make sure the backend URL in api/authApi.ts and chatApi.ts points to your server.

🛠 Environment Variables
Backend .env

ini
Copy
Edit
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
Mobile

Update API_URL in your API files to point to your backend.

📹 Demo
Include a short demo video (≤5 minutes) showing:

Register / Login

Viewing users

Sending and receiving messages in real-time

Typing indicators, online/offline, read receipts

⚡ Deployment
Backend: Can be hosted on Render or any Node.js hosting service.

Mobile: Can run via Expo client or built as standalone apps.



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

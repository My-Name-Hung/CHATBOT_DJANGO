# ChatSF — Full-Stack Agentic AI Chatbot

**ChatSF** là hệ thống chatbot AI đầy đủ tính năng với Agentic AI pipeline, RAG (Retrieval-Augmented Generation), Vector Database, và tích hợp Gemini 2.5 Flash Lite.

Giao diện & nội dung **tiếng Việt**, phong cách chatbot AI hiện đại, **không dùng gradient**, sử dụng bộ màu **Neo Tech Dark**.

## 🏗️ Kiến trúc hệ thống

### Frontend (React + Vite + TypeScript + CSS Modules)
- **UI hiện đại**: Phong cách Linear.app / Cursor / Notion
- **Theme**: Neo Tech Dark (không gradient)
- **CSS Modules**: Tách biệt class, tránh xung đột CSS
- **Components**: Modular, tối đa 150 dòng mỗi component
- **Routing**: React Router với protected routes
- **State Management**: Custom hooks (`useAuth`, `useChat`)

### Backend (Node.js + Express + TypeScript + MongoDB)
- **API RESTful**: Layered architecture (Controller → Service → Agent/RAG/Vector → AI)
- **Authentication**: JWT + bcrypt
- **Agentic AI Pipeline**: Intent detection → Tool selection → Execution → Summarization
- **RAG System**: PDF/Text/Webpage loaders, chunking, embedding (Gemini), retrieval
- **Vector Database**: ChromaDB (default), Pinecone (optional)
- **LLM**: Gemini 2.5 Flash Lite

## 📋 Yêu cầu

- **Node.js**: 18+ (khuyến nghị 20+)
- **MongoDB**: Atlas connection string (đã cấu hình trong `.env.example`)
- **Gemini API Key**: Lấy từ [Google AI Studio](https://makersuite.google.com/app/apikey)
- **ChromaDB** (optional): Nếu muốn dùng vector search local

## 🚀 Cài đặt và chạy

### 1. Clone và setup

```bash
# Clone repository
git clone <your-repo-url>
cd Chatbot

# Backend
cd backend
copy .env.example .env
# Chỉnh sửa .env với MongoDB URI và Gemini API key của bạn
npm install
npm run dev

# Frontend (terminal mới)
cd frontend
copy .env.example .env
npm install
npm run dev
```

### 2. Cấu hình biến môi trường

#### `backend/.env`
```env
NODE_ENV=development
PORT=8080

# MongoDB (đã có sẵn trong .env.example)
MONGODB_URI=mongodb+srv://thanhhung11112002:Hung20021@cluster0.t7rrmdc.mongodb.net/?appName=Cluster0

# Auth
JWT_SECRET=CHANGE_ME_SUPER_SECRET
JWT_EXPIRES_IN=7d

# Gemini (Primary LLM)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash-lite

# RAG / Vector
RAG_TOP_K=5
RAG_SCORE_THRESHOLD=0.2
CHUNK_SIZE_TOKENS=500

# Chroma (optional)
CHROMA_COLLECTION=chatsf_docs
CHROMA_URL=http://localhost:8000
```

#### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Chạy ứng dụng

**Backend** (chạy ở `http://localhost:8080`):
```bash
cd backend
npm run dev
```

**Frontend** (chạy ở `http://localhost:5173`):
```bash
cd frontend
npm run dev
```

Mở trình duyệt tại `http://localhost:5173` và đăng ký/đăng nhập để bắt đầu sử dụng.

## 📁 Cấu trúc thư mục

```
Chatbot/
├── backend/
│   ├── src/
│   │   ├── agents/          # Agentic AI pipeline
│   │   │   └── chatAgent.ts
│   │   ├── controllers/    # Request handlers
│   │   ├── db/             # MongoDB models & connection
│   │   ├── middlewares/    # Auth, error handling
│   │   ├── rag/            # RAG subsystem
│   │   │   ├── loader.ts
│   │   │   ├── chunker.ts
│   │   │   ├── embedder.ts
│   │   │   └── retriever.ts
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers
│   │   └── vector/         # Vector DB adapters
│   │       ├── chromaAdapter.ts
│   │       └── pineconeAdapter.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ChatWindow/
│   │   │   ├── MessageItem/
│   │   │   ├── Sidebar/
│   │   │   ├── Navbar/
│   │   │   ├── LoginForm/
│   │   │   └── ChatInput/
│   │   ├── hooks/          # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useChat.ts
│   │   ├── pages/          # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   └── ChatPage.tsx
│   │   ├── services/       # API client
│   │   │   └── api.ts
│   │   └── utils/          # Types & helpers
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký tài khoản mới
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Lấy thông tin user hiện tại

### Chat
- `POST /chat/query` - Gửi tin nhắn và nhận phản hồi từ AI (Agentic + RAG)

### History
- `GET /history/list` - Lấy danh sách lịch sử trò chuyện
- `GET /history/:id` - Lấy chi tiết một phiên trò chuyện
- `DELETE /history/clear` - Xóa toàn bộ lịch sử

## 🎨 Theme Colors (Neo Tech Dark)

```css
--bg-primary: #0D0F12      /* Background chính */
--bg-secondary: #1A1D23    /* Background secondary */
--bg-card: #111418          /* Card / Pane */
--color-primary: #4C9EFF    /* Primary (Brand) */
--color-accent: #6C63FF     /* Accent (nhấn mạnh) */
--color-border: #2A2E35     /* Border / Divider */
--color-title: #E6EEF8      /* Title */
--color-subtitle: #A9B4C6   /* Subtitle */
--color-body: #8C96A8       /* Body */
```

## 🛠️ Tính năng chính

✅ **Agentic AI Pipeline**: Tự động phát hiện intent và chọn tool phù hợp  
✅ **RAG System**: Tải và tìm kiếm trong PDF, Text, Webpage  
✅ **Vector Search**: ChromaDB hoặc Pinecone  
✅ **Chat History**: Lưu và quản lý lịch sử trò chuyện  
✅ **Authentication**: JWT-based auth với bcrypt  
✅ **Modern UI**: Giao diện hiện đại, responsive, tiếng Việt  

## 📝 Ghi chú

- Backend mặc định dùng **ChromaDB** qua REST API (không cần cài package)
- Nếu muốn dùng **Pinecone**, cấu hình `PINECONE_API_KEY` và `PINECONE_INDEX` trong `.env`
- Tất cả API calls từ frontend đều đi qua `services/api.ts` với auto token injection
- CSS Modules được sử dụng để tránh xung đột class names

## 🔒 Bảo mật

- Passwords được hash bằng bcrypt
- JWT tokens lưu trong `localStorage` (frontend)
- API routes được bảo vệ bởi `authMiddleware`
- CORS được cấu hình cho development

## 📄 License

MIT
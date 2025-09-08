# 🎵 Spotify Clone (Backend + Frontend)

A full-stack music streaming app inspired by Spotify.  
Backend is built with **Node.js + Express + MongoDB**.  
Frontend (React) will be added soon 🚧.  

---

## 📂 Project Structure

```
Spotify-Clone/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── controller/    # Request handlers
│   │   ├── lib/           # DB connection + utilities
│   │   ├── middleware/    # Clerk + custom middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   ├── .env               # Environment variables
│   ├── package.json
│   └── package-lock.json
├── frontend/              # (to be added later)
├── .gitignore
└── README.md
```

---

## 🚀 Features (Backend so far)

- ✅ User authentication (Clerk middleware)  
- ✅ Create / Delete Songs  
- ✅ Create Albums & link songs to albums  
- ✅ Upload audio & images (Cloudinary + express-fileupload)  
- ✅ Error handling middleware  
- 🚧 Stats & analytics (coming soon)  
- 🚧 Frontend integration  

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- Clerk (authentication)  
- Cloudinary (file storage)  
- dotenv  

**Frontend (planned)**
- React + Vite  
- Tailwind CSS  

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/badalsahani20/spotify-clone.git
cd spotify-clone/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables  
Create a `.env` file in `backend/` with:  

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 4. Start the server
```bash
npm start
```

Server runs at 👉 `http://localhost:5000`

---

## 🚧 Roadmap

- [x] Backend setup  
- [x] Song & Album CRUD  
- [ ] Stats & analytics  
- [ ] React frontend  
- [ ] Deployment (Railway/Render + Vercel/Netlify)

import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/songs.route.js";
import albumRoutes from "./routes/album.routes.js";
import statsRoutes from "./routes/stats.route.js";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express'
import fileUpload from "express-fileupload"
import path from "path";
import cors from "cors";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}));

app.use(express.json()); //to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits:{
        fileSize: 10 * 1024 * 1024, // 10MB
    },
}))

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);

//error handler
app.use((error,req, res, next) => {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
    connectDB();
})

//todo: socket.io
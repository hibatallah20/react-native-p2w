import express from "express";
import "dotenv/config";


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";


import {connectDB} from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/places",placeRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import boardRoutes from "./routes/board.js";
import listRoutes from "./routes/list.js";
import cardRoutes from "./routes/card.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


const app = express();
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URI;

app.use(cors({ origin: "https://kanban-board-1710ebat1-anshita-rathore.vercel.app" }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

app.get("/api/health", (req,res) => {
    res.json({status: "ok"});
});

async function main(){
    await mongoose.connect(dbURL);
    console.log("connected to DB");
};

main()
   .then(()=>{
     app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
   }).catch((err)=>{
     console.log(err);
   })
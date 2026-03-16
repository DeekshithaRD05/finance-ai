import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatbotRoute from "./routes/chatbot.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatbotRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
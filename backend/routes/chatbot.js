import express from "express";
import { getAdvice } from "../services/advisorService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await getAdvice(message);

    res.json({
      reply: response
    });

  } catch (error) {
    res.status(500).json({
      error: "AI error"
    });
  }
});

export default router;
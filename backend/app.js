import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const chatHistory = [
  {
    message: "Welcome to the channel.",
    user: "System",
  },
];

app.get("/", (req, res) => {
  res.json(chatHistory);
});

app.post("/", (req, res) => {
  try {
    let { message, user } = req.body;
    if (!message?.trim() || !user?.trim()) {
      res.status(406).json({ error: "Empty message or user are not allowed." });
      return;
    } else {
      chatHistory.push({
        message: message,
        user: user,
      });
      res.status(201).send("sent");
    }
  } catch (error) {
    console.error(`Failed to parse body as JSON: ${error}`);
    res.status(400).json({ error: "Expected body to be JSON." });
    return;
  }
});

app.listen(port, () => {
  console.log(`chatApp server is listening on port: ${port}`);
});

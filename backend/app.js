import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

const chatHistory = [
  {
    message: "Welcome to the channel.",
    user: "System",
    timestamp: 1778679493997,
  },
];

app.get("/", (req, res) => {
  res.json(chatHistory);
});

app.get("/messages", (req, res) => {
  const since = parseInt(req.query.since);
  if (isNaN(since)) {
    return res.json(chatHistory);
  }
  const newMessages = chatHistory.filter(({timestamp}) => timestamp > since);
  res.json(newMessages);
})

app.post("/", (req, res) => {
  try {
    let { message, user, timestamp } = req.body;
    if (!message?.trim() || !user?.trim()) {
      res.status(406).json({ error: "Empty message or user are not allowed." });
      return;
    } else {
      chatHistory.push({
        message: message,
        user: user,
        timestamp: timestamp
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

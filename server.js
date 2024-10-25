const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Event = require("./models/event");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const mongoURI =
  "mongodb://localhost:27017/frontend-monorepo-event-expressjs-server";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/events", async (req, res) => {
  const { title, date, time, description } = req.body;

  if (!title || !date || !time || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newEvent = new Event({ title, date, time, description });
    await newEvent.save();
    return res.status(201).json(newEvent);
  } catch (error) {
    return res.status(500).json({ message: "Error creating event", error });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching events", error });
  }
});

app.get("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching event", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
